const WorkoutPlan = require('../models/WorkoutPlan')
const User = require('../models/User')
const Progress = require('../models/Progress')
const Goal = require('../models/Goal')
const { asyncHandler, createError } = require('../middleware/auth')
const { successResponse } = require('../utils/responseHandler')
const aiService = require('../services/aiService')
const logger = require('../utils/logger')


const generateWorkoutPlan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user.healthProfile?.weight?.value) {
    throw createError(400, 'Complete health assessment first')
  }

  if (!user.selectedGoal) {
    throw createError(400, 'Please select a goal first')
  }

  const { planType = 'gym', daysPerWeek = 5 } = req.body

  await WorkoutPlan.updateMany(
    { user: req.user._id, isActive: true },
    { isActive: false }
  )

  let planData

  try {
    planData = await aiService.generateWorkoutPlan({
      goal: user.selectedGoal,
      experience: user.healthProfile.workoutExperience,
      gender: user.healthProfile.gender,
      age: user.healthProfile.age,
      weight: user.healthProfile.weight.value,
      height: user.healthProfile.height.value,
      activityLevel: user.healthProfile.activityLevel,
      equipment: planType,
      daysPerWeek,
      medicalConditions: user.healthProfile.medicalConditions,
      duration: 8,
    })
  } catch (err) {
    logger.error('Workout plan generation failed:', err.message)
    planData = generateFallbackPlan(user, planType, daysPerWeek)
  }

  if (!planData.title) {
    planData.title = `${user.selectedGoal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Plan`
  }

  if (!planData.schedule || planData.schedule.length === 0) {
    planData.schedule = generateFallbackSchedule(user.selectedGoal, daysPerWeek, planType)
  }

  planData.schedule = planData.schedule.map(day => {
    if (!day.exercises) day.exercises = []
    if (!day.warmup) day.warmup = []
    if (!day.cooldown) day.cooldown = []
    day.exercises = day.exercises.map((ex, i) => ({
      name: ex.name || `Exercise ${i + 1}`,
      category: ex.category || 'strength',
      musclesWorked: ex.musclesWorked || [],
      primaryMuscle: ex.primaryMuscle || '',
      equipment: ex.equipment || ['bodyweight'],
      difficulty: ex.difficulty || user.healthProfile.workoutExperience || 'beginner',
      sets: ex.sets || 3,
      reps: ex.reps || { min: 8, max: 12 },
      duration: ex.duration || null,
      restTime: ex.restTime || 60,
      calories: ex.calories || 30,
      instructions: ex.instructions || [],
      tips: ex.tips || [],
      commonMistakes: ex.commonMistakes || [],
      alternatives: ex.alternatives || [],
      isCompound: ex.isCompound || false,
      order: i + 1,
    }))
    return day
  })

  const workoutPlan = await WorkoutPlan.create({
    user: req.user._id,
    title: planData.title,
    description: planData.description || `AI-generated ${planType} workout plan`,
    type: planType,
    level: user.healthProfile.workoutExperience || 'beginner',
    duration: planData.duration || { weeks: 8, daysPerWeek, minutesPerSession: 45 },
    schedule: planData.schedule,
    isAIGenerated: true,
    isActive: true,
  })

  await Goal.findOneAndUpdate(
    { user: req.user._id, isActive: true },
    { workoutPlanId: workoutPlan._id }
  )

  return successResponse(res, 201, 'Workout plan generated', { workoutPlan })
})

const getActiveWorkoutPlan = asyncHandler(async (req, res) => {
  const workoutPlan = await WorkoutPlan.findOne({ user: req.user._id, isActive: true })
  return successResponse(res, 200, workoutPlan ? 'Workout plan fetched' : 'No active plan', {
    workoutPlan: workoutPlan || null,
  })
})

const getTodayWorkout = asyncHandler(async (req, res) => {
  const workoutPlan = await WorkoutPlan.findOne({ user: req.user._id, isActive: true })

  if (!workoutPlan) {
    return successResponse(res, 200, 'No active plan', { workout: null })
  }

  const dayOfWeek = new Date().getDay()
  const dayMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  const todayDayNumber = dayMap[dayOfWeek]

  const todayWorkout = workoutPlan.schedule.find((day) => day.dayNumber === todayDayNumber)

  return successResponse(res, 200, "Today's workout", {
    workout: todayWorkout || null,
    planTitle: workoutPlan.title,
    weekNumber: workoutPlan.weekNumber,
  })
})

const completeWorkoutDay = asyncHandler(async (req, res) => {
  const { dayNumber, duration, caloriesBurned, feedback, rating, exercises } = req.body

  const workoutPlan = await WorkoutPlan.findOne({ user: req.user._id, isActive: true })
  if (!workoutPlan) throw createError(404, 'No active workout plan')

  workoutPlan.completedDays.push({
    date: new Date(),
    dayNumber,
    completed: true,
    feedback,
    rating,
  })

  await workoutPlan.save()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await Progress.findOneAndUpdate(
    { user: req.user._id, date: { $gte: today } },
    {
      $set: {
        'workout.completed': true,
        'workout.duration': duration || 45,
        'workout.caloriesBurned': caloriesBurned || 300,
        'workout.exercises': exercises || 0,
        date: new Date(),
      },
    },
    { upsert: true, new: true }
  )

  const user = await User.findById(req.user._id)
  user.gamification.totalWorkouts += 1
  user.gamification.totalCaloriesBurned += caloriesBurned || 300

  const lastWorkout = user.gamification.streak.lastWorkout
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  yesterday.setHours(0, 0, 0, 0)

  if (!lastWorkout || new Date(lastWorkout) < yesterday) {
    user.gamification.streak.current = 1
  } else if (new Date(lastWorkout).toDateString() !== new Date().toDateString()) {
    user.gamification.streak.current += 1
  }

  user.gamification.streak.lastWorkout = new Date()
  user.gamification.streak.longest = Math.max(
    user.gamification.streak.longest,
    user.gamification.streak.current
  )

  user.gamification.xp += 50
  if (user.gamification.xp >= user.gamification.level * 500) {
    user.gamification.level += 1
  }

  await user.save()

  return successResponse(res, 200, 'Workout completed', {
    streak: user.gamification.streak.current,
    totalWorkouts: user.gamification.totalWorkouts,
    xpEarned: 50,
    level: user.gamification.level,
  })
})

const getExerciseTips = asyncHandler(async (req, res) => {
  const { exerciseName } = req.params
  return successResponse(res, 200, 'Tips fetched', {
    tips: {
      exercise: exerciseName,
      formTips: ['Maintain proper form', 'Control the movement', 'Breathe consistently'],
      commonMistakes: ['Using too much weight', 'Rushing through reps'],
      alternatives: [],
    },
  })
})

const getAllWorkoutPlans = asyncHandler(async (req, res) => {
  const plans = await WorkoutPlan.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('-schedule')
  return successResponse(res, 200, 'Plans fetched', { plans })
})

const getWorkoutStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query
  const days = parseInt(period)
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const progressData = await Progress.find({
    user: req.user._id,
    date: { $gte: startDate },
    'workout.completed': true,
  }).sort({ date: 1 })

  const stats = {
    totalWorkouts: progressData.length,
    totalCaloriesBurned: progressData.reduce((s, p) => s + (p.workout?.caloriesBurned || 0), 0),
    totalDuration: progressData.reduce((s, p) => s + (p.workout?.duration || 0), 0),
    avgCaloriesPerWorkout: progressData.length > 0
      ? Math.round(progressData.reduce((s, p) => s + (p.workout?.caloriesBurned || 0), 0) / progressData.length)
      : 0,
    chartData: progressData.map((p) => ({
      date: p.date,
      calories: p.workout?.caloriesBurned || 0,
      duration: p.workout?.duration || 0,
    })),
  }

  return successResponse(res, 200, 'Stats fetched', { stats })
})

function generateFallbackPlan(user, planType, daysPerWeek) {
  const goal = user.selectedGoal || 'lean'
  return {
    title: `${goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Plan`,
    description: `Personalized ${planType} plan`,
    type: planType,
    level: user.healthProfile?.workoutExperience || 'beginner',
    duration: { weeks: 8, daysPerWeek, minutesPerSession: 45 },
    schedule: generateFallbackSchedule(goal, daysPerWeek, planType),
  }
}

const HOME_EXERCISES = {
  'Upper Body': [
    { name: 'Push-ups', sets: 4, reps: { min: 10, max: 20 }, restTime: 60, calories: 35, musclesWorked: ['chest', 'triceps', 'shoulders'], equipment: ['bodyweight'], instructions: ['Start in plank position with hands shoulder-width apart', 'Lower your body until chest nearly touches floor', 'Push back up to starting position', 'Keep core tight throughout'] },
    { name: 'Diamond Push-ups', sets: 3, reps: { min: 8, max: 12 }, restTime: 60, calories: 30, musclesWorked: ['triceps', 'chest'], equipment: ['bodyweight'], instructions: ['Form diamond with hands under chest', 'Lower until chest touches hands', 'Push back up explosively'] },
    { name: 'Pike Push-ups', sets: 3, reps: { min: 8, max: 12 }, restTime: 75, calories: 35, musclesWorked: ['shoulders', 'triceps'], equipment: ['bodyweight'], instructions: ['Form inverted V shape', 'Lower head toward ground', 'Push back up to starting position'] },
    { name: 'Tricep Dips (chair)', sets: 3, reps: { min: 10, max: 15 }, restTime: 60, calories: 30, musclesWorked: ['triceps'], equipment: ['bodyweight'], instructions: ['Sit on edge of chair, hands gripping edge', 'Slide off and lower body by bending elbows', 'Push back up'] },
    { name: 'Plank Up-Downs', sets: 3, reps: { min: 8, max: 12 }, restTime: 60, calories: 35, musclesWorked: ['shoulders', 'core'], equipment: ['bodyweight'], instructions: ['Start in forearm plank', 'Push up to high plank one arm at a time', 'Lower back down'] },
    { name: 'Wall Push-ups', sets: 3, reps: { min: 12, max: 20 }, restTime: 45, calories: 20, musclesWorked: ['chest', 'shoulders'], equipment: ['bodyweight'], instructions: ['Stand arm length from wall', 'Push body away then back to wall', 'Keep body straight'] },
  ],
  'Lower Body': [
    { name: 'Bodyweight Squats', sets: 4, reps: { min: 15, max: 25 }, restTime: 60, calories: 45, musclesWorked: ['quads', 'glutes'], equipment: ['bodyweight'], instructions: ['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up and knees over toes', 'Drive through heels to stand'] },
    { name: 'Walking Lunges', sets: 3, reps: { min: 12, max: 20 }, restTime: 60, calories: 40, musclesWorked: ['quads', 'glutes'], equipment: ['bodyweight'], instructions: ['Step forward into lunge position', 'Lower back knee toward ground', 'Push up and step forward with other leg'] },
    { name: 'Glute Bridges', sets: 3, reps: { min: 15, max: 20 }, restTime: 45, calories: 30, musclesWorked: ['glutes', 'hamstrings'], equipment: ['bodyweight'], instructions: ['Lie on back, knees bent', 'Squeeze glutes and lift hips up', 'Hold briefly at top', 'Lower with control'] },
    { name: 'Jump Squats', sets: 3, reps: { min: 10, max: 15 }, restTime: 60, calories: 50, musclesWorked: ['quads', 'glutes', 'calves'], equipment: ['bodyweight'], instructions: ['Perform a squat', 'Explode upward into a jump', 'Land softly and immediately squat again'] },
    { name: 'Single Leg Deadlifts', sets: 3, reps: { min: 8, max: 12 }, restTime: 60, calories: 35, musclesWorked: ['hamstrings', 'glutes'], equipment: ['bodyweight'], instructions: ['Balance on one leg', 'Hinge at hips lowering torso', 'Extend back leg behind you', 'Return to start'] },
    { name: 'Calf Raises', sets: 3, reps: { min: 20, max: 30 }, restTime: 45, calories: 20, musclesWorked: ['calves'], equipment: ['bodyweight'], instructions: ['Stand with feet flat', 'Rise up onto balls of feet', 'Lower slowly with control'] },
  ],
  'Full Body': [
    { name: 'Burpees', sets: 4, reps: { min: 8, max: 15 }, restTime: 60, calories: 60, musclesWorked: ['full_body'], equipment: ['bodyweight'], instructions: ['Squat down and place hands on floor', 'Jump feet back to plank', 'Do a push-up', 'Jump feet forward and explode up'] },
    { name: 'Mountain Climbers', sets: 3, reps: { min: 20, max: 30 }, restTime: 45, calories: 45, musclesWorked: ['core', 'shoulders'], equipment: ['bodyweight'], instructions: ['Start in plank position', 'Alternate driving knees toward chest rapidly', 'Keep core tight'] },
    { name: 'Jumping Jacks', sets: 3, reps: { min: 30, max: 50 }, restTime: 30, calories: 30, musclesWorked: ['full_body'], equipment: ['bodyweight'], instructions: ['Start standing with arms at sides', 'Jump feet wide while raising arms overhead', 'Jump back to start'] },
    { name: 'High Knees', sets: 3, reps: { min: 30, max: 50 }, restTime: 30, calories: 35, musclesWorked: ['legs', 'core'], equipment: ['bodyweight'], instructions: ['Run in place', 'Drive knees up to waist height', 'Pump arms naturally'] },
    { name: 'Plank to Push-up', sets: 3, reps: { min: 8, max: 12 }, restTime: 60, calories: 40, musclesWorked: ['core', 'chest', 'shoulders'], equipment: ['bodyweight'], instructions: ['Start in forearm plank', 'Push up to high plank', 'Lower back to forearms', 'Alternate leading arm'] },
    { name: 'Bear Crawl', sets: 3, reps: { min: 10, max: 15 }, restTime: 60, calories: 35, musclesWorked: ['full_body'], equipment: ['bodyweight'], instructions: ['Start on hands and toes, knees off floor', 'Crawl forward maintaining position', 'Keep hips low'] },
  ],
  'Core & Abs': [
    { name: 'Plank Hold', sets: 3, reps: { min: 30, max: 60 }, duration: 1, restTime: 45, calories: 25, musclesWorked: ['core'], equipment: ['bodyweight'], instructions: ['Forearms and toes on floor', 'Body in straight line', 'Hold position'] },
    { name: 'Bicycle Crunches', sets: 3, reps: { min: 15, max: 25 }, restTime: 45, calories: 30, musclesWorked: ['abs', 'obliques'], equipment: ['bodyweight'], instructions: ['Lie on back, hands behind head', 'Bring opposite elbow to knee', 'Alternate sides'] },
    { name: 'Russian Twists', sets: 3, reps: { min: 20, max: 30 }, restTime: 45, calories: 25, musclesWorked: ['obliques'], equipment: ['bodyweight'], instructions: ['Sit with knees bent, lean back slightly', 'Twist torso side to side', 'Keep feet off ground for challenge'] },
    { name: 'Leg Raises', sets: 3, reps: { min: 12, max: 20 }, restTime: 45, calories: 30, musclesWorked: ['lower_abs'], equipment: ['bodyweight'], instructions: ['Lie on back, legs straight', 'Raise legs to 90 degrees', 'Lower slowly without touching floor'] },
    { name: 'Side Plank', sets: 3, reps: { min: 20, max: 40 }, duration: 1, restTime: 30, calories: 20, musclesWorked: ['obliques'], equipment: ['bodyweight'], instructions: ['Side lying, prop on forearm', 'Lift hips off ground', 'Hold straight line'] },
    { name: 'Dead Bug', sets: 3, reps: { min: 10, max: 15 }, restTime: 45, calories: 20, musclesWorked: ['core'], equipment: ['bodyweight'], instructions: ['Lie on back, arms up, knees at 90 degrees', 'Lower opposite arm and leg', 'Return and switch sides'] },
  ],
}

const GYM_EXERCISES = {
  'Chest & Triceps': [
    { name: 'Barbell Bench Press', sets: 4, reps: { min: 8, max: 12 }, restTime: 90, calories: 60, musclesWorked: ['chest', 'triceps'], equipment: ['barbell', 'bench'], isCompound: true, instructions: ['Lie flat on bench', 'Grip bar slightly wider than shoulders', 'Lower bar to chest', 'Press up explosively'] },
    { name: 'Incline Dumbbell Press', sets: 3, reps: { min: 10, max: 12 }, restTime: 75, calories: 50, musclesWorked: ['chest', 'shoulders'], equipment: ['dumbbell', 'bench'] },
    { name: 'Cable Flyes', sets: 3, reps: { min: 12, max: 15 }, restTime: 60, calories: 40, musclesWorked: ['chest'], equipment: ['cable'] },
    { name: 'Tricep Pushdowns', sets: 3, reps: { min: 12, max: 15 }, restTime: 60, calories: 30, musclesWorked: ['triceps'], equipment: ['cable'] },
    { name: 'Overhead Tricep Extension', sets: 3, reps: { min: 10, max: 12 }, restTime: 60, calories: 30, musclesWorked: ['triceps'], equipment: ['dumbbell'] },
    { name: 'Push-ups', sets: 3, reps: { min: 15, max: 20 }, restTime: 45, calories: 35, musclesWorked: ['chest', 'triceps'], equipment: ['bodyweight'] },
  ],
  'Back & Biceps': [
    { name: 'Deadlift', sets: 4, reps: { min: 6, max: 8 }, restTime: 120, calories: 80, musclesWorked: ['back', 'hamstrings'], equipment: ['barbell'], isCompound: true },
    { name: 'Pull-ups', sets: 3, reps: { min: 8, max: 12 }, restTime: 90, calories: 50, musclesWorked: ['back', 'biceps'], equipment: ['pull_up_bar'], isCompound: true },
    { name: 'Barbell Rows', sets: 4, reps: { min: 8, max: 12 }, restTime: 75, calories: 55, musclesWorked: ['back'], equipment: ['barbell'] },
    { name: 'Lat Pulldown', sets: 3, reps: { min: 10, max: 12 }, restTime: 60, calories: 40, musclesWorked: ['back'], equipment: ['cable'] },
    { name: 'Barbell Curls', sets: 3, reps: { min: 10, max: 12 }, restTime: 60, calories: 30, musclesWorked: ['biceps'], equipment: ['barbell'] },
    { name: 'Hammer Curls', sets: 3, reps: { min: 12, max: 15 }, restTime: 60, calories: 25, musclesWorked: ['biceps'], equipment: ['dumbbell'] },
  ],
  'Legs & Core': [
    { name: 'Barbell Squat', sets: 4, reps: { min: 8, max: 12 }, restTime: 120, calories: 80, musclesWorked: ['quads', 'glutes'], equipment: ['barbell'], isCompound: true },
    { name: 'Romanian Deadlift', sets: 3, reps: { min: 10, max: 12 }, restTime: 90, calories: 60, musclesWorked: ['hamstrings', 'glutes'], equipment: ['barbell'] },
    { name: 'Leg Press', sets: 3, reps: { min: 12, max: 15 }, restTime: 75, calories: 50, musclesWorked: ['quads'], equipment: ['machine'] },
    { name: 'Walking Lunges', sets: 3, reps: { min: 12, max: 16 }, restTime: 60, calories: 45, musclesWorked: ['quads', 'glutes'], equipment: ['dumbbell'] },
    { name: 'Hanging Leg Raises', sets: 3, reps: { min: 12, max: 15 }, restTime: 60, calories: 30, musclesWorked: ['abs'], equipment: ['pull_up_bar'] },
    { name: 'Plank Hold', sets: 3, reps: { min: 30, max: 60 }, restTime: 45, calories: 20, musclesWorked: ['abs'], equipment: ['bodyweight'] },
  ],
  'Shoulders & Arms': [
    { name: 'Overhead Press', sets: 4, reps: { min: 8, max: 12 }, restTime: 90, calories: 55, musclesWorked: ['shoulders'], equipment: ['barbell'], isCompound: true },
    { name: 'Lateral Raises', sets: 3, reps: { min: 12, max: 15 }, restTime: 60, calories: 30, musclesWorked: ['shoulders'], equipment: ['dumbbell'] },
    { name: 'Face Pulls', sets: 3, reps: { min: 15, max: 20 }, restTime: 60, calories: 25, musclesWorked: ['shoulders', 'back'], equipment: ['cable'] },
    { name: 'EZ Bar Curls', sets: 3, reps: { min: 10, max: 12 }, restTime: 60, calories: 30, musclesWorked: ['biceps'], equipment: ['barbell'] },
    { name: 'Skull Crushers', sets: 3, reps: { min: 10, max: 12 }, restTime: 60, calories: 30, musclesWorked: ['triceps'], equipment: ['barbell'] },
    { name: 'Dips', sets: 3, reps: { min: 10, max: 15 }, restTime: 75, calories: 40, musclesWorked: ['triceps', 'chest'], equipment: ['bodyweight'] },
  ],
  'Full Body HIIT': [
    { name: 'Burpees', sets: 4, reps: { min: 10, max: 15 }, restTime: 45, calories: 50, musclesWorked: ['full_body'], equipment: ['bodyweight'] },
    { name: 'Kettlebell Swings', sets: 4, reps: { min: 15, max: 20 }, restTime: 45, calories: 55, musclesWorked: ['glutes', 'hamstrings'], equipment: ['kettlebell'] },
    { name: 'Box Jumps', sets: 3, reps: { min: 10, max: 12 }, restTime: 60, calories: 45, musclesWorked: ['quads', 'calves'], equipment: ['bodyweight'] },
    { name: 'Mountain Climbers', sets: 3, reps: { min: 20, max: 30 }, restTime: 30, calories: 40, musclesWorked: ['abs', 'shoulders'], equipment: ['bodyweight'] },
    { name: 'Battle Ropes', sets: 3, reps: { min: 20, max: 30 }, restTime: 45, calories: 50, musclesWorked: ['shoulders', 'arms'], equipment: ['rope'] },
    { name: 'Jump Squats', sets: 3, reps: { min: 15, max: 20 }, restTime: 45, calories: 45, musclesWorked: ['quads', 'glutes'], equipment: ['bodyweight'] },
  ],
}

function generateFallbackSchedule(goal, daysPerWeek, planType = 'gym') {
  const isHome = planType === 'home'
  const exerciseDB = isHome ? HOME_EXERCISES : GYM_EXERCISES

  const dayConfigs = isHome
    ? [
        { dayNumber: 1, dayName: 'Monday', focus: 'Upper Body', type: 'strength' },
        { dayNumber: 2, dayName: 'Tuesday', focus: 'Lower Body', type: 'strength' },
        { dayNumber: 3, dayName: 'Wednesday', focus: 'Core & Abs', type: 'strength' },
        { dayNumber: 4, dayName: 'Thursday', focus: 'Rest & Recovery', type: 'rest', isRestDay: true },
        { dayNumber: 5, dayName: 'Friday', focus: 'Full Body', type: 'hiit' },
        { dayNumber: 6, dayName: 'Saturday', focus: 'Upper Body', type: 'strength' },
        { dayNumber: 7, dayName: 'Sunday', focus: 'Active Recovery', type: 'rest', isRestDay: true },
      ]
    : [
        { dayNumber: 1, dayName: 'Monday', focus: 'Chest & Triceps', type: 'strength' },
        { dayNumber: 2, dayName: 'Tuesday', focus: 'Back & Biceps', type: 'strength' },
        { dayNumber: 3, dayName: 'Wednesday', focus: 'Legs & Core', type: 'strength' },
        { dayNumber: 4, dayName: 'Thursday', focus: 'Rest & Recovery', type: 'rest', isRestDay: true },
        { dayNumber: 5, dayName: 'Friday', focus: 'Shoulders & Arms', type: 'strength' },
        { dayNumber: 6, dayName: 'Saturday', focus: 'Full Body HIIT', type: 'hiit' },
        { dayNumber: 7, dayName: 'Sunday', focus: 'Active Recovery', type: 'rest', isRestDay: true },
      ]

  return dayConfigs.map(config => {
    const exercises = exerciseDB[config.focus] || []
    const totalCalories = exercises.reduce((s, e) => s + (e.calories || 30) * (e.sets || 3), 0)

    return {
      dayNumber: config.dayNumber,
      dayName: config.dayName,
      focus: config.focus,
      type: config.type,
      totalDuration: config.isRestDay ? 0 : 45,
      totalCalories: config.isRestDay ? 0 : totalCalories,
      warmup: config.isRestDay ? [] : [
        { name: 'Jumping Jacks', sets: 1, reps: { min: 30, max: 30 }, duration: 2, restTime: 0, calories: 15, musclesWorked: ['full_body'], equipment: ['bodyweight'], order: 1 },
        { name: 'Arm Circles', sets: 1, reps: { min: 20, max: 20 }, duration: 1, restTime: 0, calories: 5, musclesWorked: ['shoulders'], equipment: ['bodyweight'], order: 2 },
      ],
      exercises: exercises.map((ex, i) => ({
        ...ex,
        order: i + 1,
        category: 'strength',
        difficulty: 'intermediate',
        instructions: ex.instructions || [],
        tips: ex.tips || [],
        commonMistakes: [],
      })),
      cooldown: config.isRestDay ? [] : [
        { name: 'Static Stretching', sets: 1, reps: { min: 1, max: 1 }, duration: 5, restTime: 0, calories: 10, musclesWorked: ['full_body'], equipment: ['bodyweight'], order: 1 },
      ],
      notes: config.isRestDay ? 'Focus on recovery. Light walking and stretching recommended.' : '',
      isRestDay: config.isRestDay || false,
    }
  })
}

module.exports = {
  generateWorkoutPlan,
  getActiveWorkoutPlan,
  getTodayWorkout,
  completeWorkoutDay,
  getExerciseTips,
  getAllWorkoutPlans,
  getWorkoutStats,
}