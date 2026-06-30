const User = require('../models/User')
const Goal = require('../models/Goal')
const Progress = require('../models/Progress')
const { asyncHandler, createError } = require('../middleware/auth')
const { successResponse } = require('../utils/responseHandler')
const { calculateAllMetrics } = require('../utils/bmiCalculator')
const aiService = require('../services/aiService')
const logger = require('../utils/logger')

const feetInchesToCm = (feet, inches) => {
  const f = parseInt(feet) || 0
  const i = parseInt(inches) || 0
  return (f * 30.48) + (i * 2.54)
}

const calculateAge = (dob) => {
  if (!dob) return null
  const today = new Date()
  const birth = new Date(dob)
  let a = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
  return a
}

const updateHealthProfile = asyncHandler(async (req, res) => {
  const {
    gender, dateOfBirth, age,
    height, heightFeet, heightInches,
    weight, activityLevel, lifestyle,
    sleepHours, waterIntake, medicalConditions,
    foodPreference, allergies, workoutExperience,
  } = req.body

  const user = await User.findById(req.user._id)
  if (!user) throw createError(404, 'User not found')

  let heightCm
  if (heightFeet !== undefined && heightFeet !== null && heightFeet !== '') {
    heightCm = feetInchesToCm(heightFeet, heightInches)
  } else if (height) {
    heightCm = parseFloat(height)
  } else {
    heightCm = user.healthProfile?.height?.value || 170
  }

  const userAge = age ? parseInt(age) : (dateOfBirth ? calculateAge(dateOfBirth) : user.healthProfile?.age)
  const weightKg = weight ? parseFloat(weight) : user.healthProfile?.weight?.value

  user.healthProfile = {
    gender: gender || user.healthProfile?.gender,
    dateOfBirth: dateOfBirth || user.healthProfile?.dateOfBirth,
    age: userAge,
    height: { value: heightCm, unit: 'cm' },
    weight: { value: weightKg, unit: 'kg' },
    activityLevel: activityLevel || user.healthProfile?.activityLevel,
    lifestyle: lifestyle || user.healthProfile?.lifestyle,
    sleepHours: sleepHours !== undefined ? parseFloat(sleepHours) : user.healthProfile?.sleepHours || 7,
    waterIntake: waterIntake !== undefined ? parseFloat(waterIntake) : user.healthProfile?.waterIntake || 2,
    medicalConditions: medicalConditions || user.healthProfile?.medicalConditions || [],
    foodPreference: foodPreference || user.healthProfile?.foodPreference,
    allergies: allergies || user.healthProfile?.allergies || [],
    workoutExperience: workoutExperience || user.healthProfile?.workoutExperience,
  }

  const metrics = calculateAllMetrics({
    weight: weightKg,
    height: heightCm,
    age: userAge,
    gender: user.healthProfile.gender,
    activityLevel: user.healthProfile.activityLevel,
    goal: user.selectedGoal || 'lean',
  })

  user.bodyMetrics = metrics
  user.onboardingStep = Math.max(user.onboardingStep || 0, 1)

  await user.save()

  return successResponse(res, 200, 'Health profile updated', {
    user: user.toSafeObject(),
    metrics,
  })
})

const setGoal = asyncHandler(async (req, res) => {
  const { goalType } = req.body

  if (!goalType) throw createError(400, 'Goal type is required')

  const validGoals = [
    'lean', 'athletic', 'muscular', 'bodybuilder',
    'fat_loss', 'six_pack', 'v_shape', 'womens_toned',
    'powerlifting', 'functional_fitness',
  ]

  if (!validGoals.includes(goalType)) {
    throw createError(400, 'Invalid goal type')
  }

  const user = await User.findById(req.user._id)
  if (!user) throw createError(404, 'User not found')

  if (!user.healthProfile?.weight?.value) {
    throw createError(400, 'Complete health assessment first')
  }

  await Goal.updateMany({ user: req.user._id, isActive: true }, { isActive: false })

  const metrics = calculateAllMetrics({
    weight: user.healthProfile.weight.value,
    height: user.healthProfile.height.value,
    age: user.healthProfile.age,
    gender: user.healthProfile.gender,
    activityLevel: user.healthProfile.activityLevel,
    goal: goalType,
  })

  let roadmap = {
    overview: `Your personalized ${goalType.replace(/_/g, ' ')} program is ready.`,
    expectedTransformation: 'Significant changes expected within 8-12 weeks with consistency.',
    difficulty: 'Moderate',
    estimatedWeeks: 12,
    weeklyTargets: [],
    monthlyTargets: [],
    supplements: [],
    recoveryAdvice: ['Get 7-9 hours of sleep', 'Stay hydrated', 'Take rest days seriously'],
    sleepAdvice: 'Aim for 7-9 hours of quality sleep.',
  }

  try {
    const aiRoadmap = await aiService.generateRoadmap({
      goal: goalType,
      weight: user.healthProfile.weight.value,
      idealWeight: metrics.idealWeight,
      bmi: metrics.bmi,
      experience: user.healthProfile.workoutExperience,
      timelineWeeks: 12,
    })
    if (aiRoadmap) roadmap = { ...roadmap, ...aiRoadmap }
  } catch (err) {
    logger.warn('AI roadmap failed, using default:', err.message)
  }

  const getGoalTitle = (g) => {
    const titles = {
      lean: 'Lean Body Transformation',
      athletic: 'Athletic Performance',
      muscular: 'Muscular Build',
      bodybuilder: 'Bodybuilder Physique',
      fat_loss: 'Fat Loss Journey',
      six_pack: 'Six Pack Abs',
      v_shape: 'V-Shape Body',
      womens_toned: "Women's Toned Body",
      powerlifting: 'Powerlifting Strength',
      functional_fitness: 'Functional Fitness',
    }
    return titles[g] || g
  }

  const goal = await Goal.create({
    user: req.user._id,
    type: goalType,
    title: getGoalTitle(goalType),
    description: `AI-powered ${goalType.replace(/_/g, ' ')} program`,
    startDate: new Date(),
    targetDate: new Date(Date.now() + (roadmap.estimatedWeeks || 12) * 7 * 24 * 60 * 60 * 1000),
    estimatedWeeks: roadmap.estimatedWeeks || 12,
    currentWeight: user.healthProfile.weight.value,
    startWeight: user.healthProfile.weight.value,
    targetWeight: metrics.idealWeight,
    roadmap: {
      overview: roadmap.overview || '',
      expectedTransformation: roadmap.expectedTransformation || '',
      difficulty: roadmap.difficulty || 'Moderate',
      calorieTarget: metrics.macros.calories,
      weeklyTargets: roadmap.weeklyTargets || [],
      monthlyTargets: roadmap.monthlyTargets || [],
    },
    supplements: roadmap.supplements || [],
    recoveryAdvice: roadmap.recoveryAdvice || [],
    sleepAdvice: roadmap.sleepAdvice || '',
  })

  user.selectedGoal = goalType
  user.bodyMetrics = metrics
  user.onboardingStep = Math.max(user.onboardingStep || 0, 2)
  user.isOnboarded = true
  await user.save()

  return successResponse(res, 201, 'Goal set successfully', {
    goal,
    metrics,
    user: user.toSafeObject(),
  })
})

const completeOnboarding = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  user.isOnboarded = true
  user.onboardingStep = 3
  await user.save()
  return successResponse(res, 200, 'Onboarding completed', { user: user.toSafeObject() })
})

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) throw createError(404, 'User not found')

  const activeGoal = await Goal.findOne({ user: req.user._id, isActive: true })
  const recentProgress = await Progress.find({ user: req.user._id }).sort({ date: -1 }).limit(7)

  return successResponse(res, 200, 'Profile fetched', {
    user: user.toSafeObject(),
    activeGoal,
    recentProgress,
  })
})

const updateProfile = asyncHandler(async (req, res) => {
  const { name, preferences, healthProfile } = req.body
  const user = await User.findById(req.user._id)

  if (!user) throw createError(404, 'User not found')

  if (name) user.name = name
  if (preferences) user.preferences = { ...user.preferences, ...preferences }

  if (healthProfile) {
    const hp = user.healthProfile?.toObject ? user.healthProfile.toObject() : (user.healthProfile || {})
    let metricsChanged = false

    if (healthProfile.gender) {
      hp.gender = healthProfile.gender
      metricsChanged = true
    }
    if (healthProfile.age !== undefined && healthProfile.age !== '') {
      hp.age = parseInt(healthProfile.age)
      metricsChanged = true
    }
    if (healthProfile.weight !== undefined && healthProfile.weight !== '') {
      hp.weight = { value: parseFloat(healthProfile.weight), unit: 'kg' }
      metricsChanged = true
    }
    if (healthProfile.heightFeet !== undefined && healthProfile.heightFeet !== '') {
      const cm = feetInchesToCm(healthProfile.heightFeet, healthProfile.heightInches)
      hp.height = { value: cm, unit: 'cm' }
      metricsChanged = true
    } else if (healthProfile.height !== undefined && healthProfile.height !== '') {
      hp.height = { value: parseFloat(healthProfile.height), unit: 'cm' }
      metricsChanged = true
    }
    if (healthProfile.activityLevel) {
      hp.activityLevel = healthProfile.activityLevel
      metricsChanged = true
    }
    if (healthProfile.workoutExperience) hp.workoutExperience = healthProfile.workoutExperience
    if (healthProfile.foodPreference) hp.foodPreference = healthProfile.foodPreference
    if (healthProfile.sleepHours !== undefined) hp.sleepHours = parseFloat(healthProfile.sleepHours)
    if (healthProfile.waterIntake !== undefined) hp.waterIntake = parseFloat(healthProfile.waterIntake)
    if (healthProfile.lifestyle) hp.lifestyle = healthProfile.lifestyle
    if (healthProfile.allergies) hp.allergies = healthProfile.allergies
    if (healthProfile.medicalConditions) hp.medicalConditions = healthProfile.medicalConditions

    user.healthProfile = hp

    if (metricsChanged && hp.weight?.value && hp.height?.value && hp.age && hp.gender) {
      const metrics = calculateAllMetrics({
        weight: hp.weight.value,
        height: hp.height.value,
        age: hp.age,
        gender: hp.gender,
        activityLevel: hp.activityLevel || 'moderately_active',
        goal: user.selectedGoal || 'lean',
      })
      user.bodyMetrics = metrics

      const activeGoal = await Goal.findOne({ user: user._id, isActive: true })
      if (activeGoal) {
        activeGoal.currentWeight = hp.weight.value
        const totalChange = Math.abs(activeGoal.startWeight - activeGoal.targetWeight)
        const currentChange = Math.abs(activeGoal.startWeight - hp.weight.value)
        activeGoal.progressPercentage = totalChange > 0
          ? Math.min(Math.round((currentChange / totalChange) * 100), 100)
          : 0
        await activeGoal.save()
      }
    }
  }

  await user.save()

  return successResponse(res, 200, 'Profile updated', { user: user.toSafeObject() })
})

const uploadAvatarHandler = asyncHandler(async (req, res) => {
  if (!req.file) throw createError(400, 'Please upload an image')

  const user = await User.findById(req.user._id)

  try {
    const { uploadAvatar } = require('../services/cloudinaryService')
    const cloudinary = require('../config/cloudinary')

    if (user.avatar?.public_id) {
      try { await cloudinary.uploader.destroy(user.avatar.public_id) } catch {}
    }

    const result = await uploadAvatar(req.file.buffer, req.user._id)
    user.avatar = { public_id: result.public_id, url: result.url }
  } catch {
    const base64 = req.file.buffer.toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${base64}`
    user.avatar = { url: dataUri }
  }

  await user.save()
  return successResponse(res, 200, 'Avatar updated', { avatar: user.avatar })
})

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [user, activeGoal, todayProgress, weekProgress] = await Promise.all([
    User.findById(userId),
    Goal.findOne({ user: userId, isActive: true }),
    Progress.findOne({ user: userId, date: { $gte: today } }),
    Progress.find({
      user: userId,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).sort({ date: 1 }),
  ])

  const weeklyStats = {
    workoutsCompleted: weekProgress.filter((p) => p.workout?.completed).length,
    totalCaloriesBurned: weekProgress.reduce((s, p) => s + (p.workout?.caloriesBurned || 0), 0),
    avgCaloriesConsumed: weekProgress.length > 0
      ? Math.round(weekProgress.reduce((s, p) => s + (p.nutrition?.calories || 0), 0) / weekProgress.length)
      : 0,
    totalWater: weekProgress.reduce((s, p) => s + (p.nutrition?.water || 0), 0),
  }

  let motivation = {
    messages: [
      {
        type: 'morning',
        title: 'Stay Consistent',
        message: 'Every rep, every meal, every choice adds up. Keep going.',
      },
    ],
    dailyQuote: 'The body achieves what the mind believes.',
    weeklyChallenge: 'Complete all planned workouts this week.',
  }

  try {
    if (user.selectedGoal) {
      const aiMotivation = await aiService.generateMotivation({
        name: user.name.split(' ')[0],
        goal: user.selectedGoal,
        streak: user.gamification?.streak?.current || 0,
        progress: activeGoal?.progressPercentage || 0,
      })
      if (aiMotivation) motivation = aiMotivation
    }
  } catch {}

  return successResponse(res, 200, 'Dashboard data', {
    user: user.toSafeObject(),
    activeGoal,
    todayProgress,
    weekProgress,
    weeklyStats,
    motivation,
  })
})

const updateFCMToken = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { fcmToken: req.body.fcmToken })
  return successResponse(res, 200, 'FCM token updated')
})

const deleteAccount = asyncHandler(async (req, res) => {
  await Promise.all([
    User.findByIdAndDelete(req.user._id),
    Goal.deleteMany({ user: req.user._id }),
    Progress.deleteMany({ user: req.user._id }),
  ])

  res.clearCookie('accessToken')
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' })

  return successResponse(res, 200, 'Account deleted')
})

module.exports = {
  updateHealthProfile,
  setGoal,
  completeOnboarding,
  getProfile,
  updateProfile,
  uploadAvatarHandler,
  getDashboard,
  updateFCMToken,
  deleteAccount,
}