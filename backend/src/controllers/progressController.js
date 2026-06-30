const Progress = require("../models/Progress");
const User = require("../models/User");
const Goal = require("../models/Goal");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { successResponse } = require("../utils/responseHandler");
const { calculateBMI, getBMICategory } = require("../utils/bmiCalculator");
const { uploadProgressPhoto } = require("../services/cloudinaryService");
const aiService = require("../services/aiService");

// ─── LOG PROGRESS ─────────────────────────────────────────────────────────────
const logProgress = asyncHandler(async (req, res) => {
  const { weight, bodyFat, measurements, sleep, mood, energyLevel, notes } =
    req.body;

  const user = await User.findById(req.user._id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let bmi, bmiCategory;
  if (weight) {
    bmi = calculateBMI(weight, user.healthProfile?.height?.value || 170);
    bmiCategory = getBMICategory(bmi);
  }

  const progressData = {
    user: req.user._id,
    date: new Date(),
    sleep,
    mood,
    energyLevel,
    notes,
  };

  if (weight) {
    progressData.weight = parseFloat(weight);
    progressData.bmi = bmi;
    progressData.bmiCategory = bmiCategory;

    // Update user's current weight in health profile
    user.healthProfile.weight.value = parseFloat(weight);

    // Update goal progress
    const activeGoal = await Goal.findOne({
      user: req.user._id,
      isActive: true,
    });
    if (activeGoal) {
      activeGoal.currentWeight = parseFloat(weight);
      const totalChange = Math.abs(
        activeGoal.startWeight - activeGoal.targetWeight,
      );
      const currentChange = Math.abs(
        activeGoal.startWeight - parseFloat(weight),
      );
      activeGoal.progressPercentage = Math.min(
        Math.round((currentChange / totalChange) * 100),
        100,
      );
      await activeGoal.save();
    }

    // Update body metrics
    if (user.bodyMetrics) {
      user.bodyMetrics.weightStatus.current = parseFloat(weight);
    }
    await user.save();
  }

  if (bodyFat) progressData.bodyFat = parseFloat(bodyFat);
  if (measurements) progressData.measurements = measurements;

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, date: { $gte: today } },
    { $set: progressData },
    { upsert: true, new: true },
  );

  return successResponse(res, 200, "Progress logged", { progress });
});

// ─── GET PROGRESS HISTORY ─────────────────────────────────────────────────────
const getProgressHistory = asyncHandler(async (req, res) => {
  const { period = "30", metric = "all" } = req.query;
  const days = parseInt(period);
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const query = { user: req.user._id, date: { $gte: startDate } };

  const progress = await Progress.find(query).sort({ date: 1 });

  // Format chart data
  const weightData = progress
    .filter((p) => p.weight)
    .map((p) => ({ date: p.date, value: p.weight }));

  const bmiData = progress
    .filter((p) => p.bmi)
    .map((p) => ({ date: p.date, value: p.bmi }));

  const calorieData = progress
    .filter((p) => p.nutrition?.calories)
    .map((p) => ({
      date: p.date,
      consumed: p.nutrition.calories,
      burned: p.workout?.caloriesBurned || 0,
      target: p.nutrition.caloriesTarget,
    }));

  const workoutData = progress
    .filter((p) => p.workout?.completed)
    .map((p) => ({
      date: p.date,
      duration: p.workout.duration,
      calories: p.workout.caloriesBurned,
      type: p.workout.workoutType,
    }));

  return successResponse(res, 200, "Progress history fetched", {
    progress,
    charts: {
      weight: weightData,
      bmi: bmiData,
      calories: calorieData,
      workouts: workoutData,
    },
    summary: {
      totalEntries: progress.length,
      period: days,
    },
  });
});

// ─── UPLOAD PROGRESS PHOTO ────────────────────────────────────────────────────
const uploadProgressPhotoHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createError(400, "Please upload an image");
  }

  const { photoType = "front" } = req.body;

  const result = await uploadProgressPhoto(req.file.buffer, req.user._id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, date: { $gte: today } },
    {
      $push: {
        photos: {
          public_id: result.public_id,
          url: result.url,
          type: photoType,
          uploadedAt: new Date(),
        },
      },
      $setOnInsert: {
        user: req.user._id,
        date: new Date(),
      },
    },
    { upsert: true, new: true },
  );

  return successResponse(res, 200, "Progress photo uploaded", {
    photo: { url: result.url, type: photoType },
  });
});

// ─── GET AI PROGRESS ADVICE ───────────────────────────────────────────────────
const getProgressAdvice = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const activeGoal = await Goal.findOne({ user: req.user._id, isActive: true });

  const weeksIn = activeGoal
    ? Math.floor(
        (Date.now() - new Date(activeGoal.startDate).getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      )
    : 0;

  const recentProgress = await Progress.find({ user: req.user._id })
    .sort({ date: -1 })
    .limit(14);

  const avgWorkouts =
    recentProgress.filter((p) => p.workout?.completed).length / 2;
  const avgCalories =
    recentProgress.length > 0
      ? recentProgress.reduce(
          (sum, p) => sum + (p.nutrition?.calories || 0),
          0,
        ) / recentProgress.length
      : 0;

  const advice = await aiService.generateProgressAdvice({
    currentWeight: user.healthProfile?.weight?.value,
    startWeight: activeGoal?.startWeight,
    weeksIn,
    goal: user.selectedGoal,
    avgWorkouts: Math.round(avgWorkouts),
    avgCalories: Math.round(avgCalories),
  });

  return successResponse(res, 200, "Progress advice fetched", { advice });
});

// ─── GET BODY MEASUREMENTS ────────────────────────────────────────────────────
const getBodyMeasurements = asyncHandler(async (req, res) => {
  const latestProgress = await Progress.findOne({
    user: req.user._id,
    measurements: { $exists: true },
  }).sort({ date: -1 });

  const measurementHistory = await Progress.find({
    user: req.user._id,
    "measurements.waist": { $exists: true },
  })
    .sort({ date: 1 })
    .limit(10)
    .select("date measurements");

  return successResponse(res, 200, "Measurements fetched", {
    latest: latestProgress?.measurements || null,
    history: measurementHistory,
  });
});
const logSteps = asyncHandler(async (req, res) => {
  const { steps } = req.body

  if (!steps || steps < 0) {
    throw createError(400, 'Invalid step count')
  }

  const user = await User.findById(req.user._id)
  const weightKg = user.healthProfile?.weight?.value || 70
  const heightCm = user.healthProfile?.height?.value || 170

  const strideLength = heightCm * 0.413 / 100
  const distanceKm = (steps * strideLength) / 1000
  const caloriesBurned = Math.round(steps * 0.04 * (weightKg / 70))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  let existingProgress = await Progress.findOne({
    user: req.user._id,
    date: { $gte: today, $lt: tomorrow },
  })

  if (!existingProgress) {
    existingProgress = await Progress.create({
      user: req.user._id,
      date: new Date(),
      steps: {
        count: steps,
        caloriesBurned,
        distance: parseFloat(distanceKm.toFixed(2)),
        target: 10000,
        lastUpdate: new Date(),
      },
    })
  } else {
    existingProgress.steps = {
      count: steps,
      caloriesBurned,
      distance: parseFloat(distanceKm.toFixed(2)),
      target: existingProgress.steps?.target || 10000,
      lastUpdate: new Date(),
    }
    existingProgress.markModified('steps')
    await existingProgress.save()
  }

  return successResponse(res, 200, 'Steps logged', {
    steps: existingProgress.steps,
  })
})

const getTodaySteps = asyncHandler(async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const progress = await Progress.findOne({
    user: req.user._id,
    date: { $gte: today, $lt: tomorrow },
  })

  const steps = progress?.steps || {
    count: 0,
    caloriesBurned: 0,
    distance: 0,
    target: 10000,
  }

  return successResponse(res, 200, 'Steps fetched', { steps })
})
module.exports = {
  logProgress,
  getProgressHistory,
  uploadProgressPhotoHandler,
  getProgressAdvice,
  getBodyMeasurements,
  logSteps,
  getTodaySteps,
}