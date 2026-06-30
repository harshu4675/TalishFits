const DietPlan = require('../models/Meal')
const User = require('../models/User')
const Progress = require('../models/Progress')
const Goal = require('../models/Goal')
const { asyncHandler, createError } = require('../middleware/auth')
const { successResponse } = require('../utils/responseHandler')
const aiService = require('../services/aiService')
const logger = require('../utils/logger')

const generateDietPlan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user.healthProfile?.weight?.value) {
    throw createError(400, 'Complete health assessment first')
  }

  const { dietStyle = 'balanced', budget = 'medium' } = req.body

  await DietPlan.updateMany(
    { user: req.user._id, isActive: true },
    { isActive: false }
  )

  let planData

  try {
    planData = await aiService.generateDietPlan({
      goal: user.selectedGoal,
      foodPreference: user.healthProfile.foodPreference,
      targetCalories: user.bodyMetrics?.macros?.calories || 2000,
      macros: user.bodyMetrics?.macros || { protein: 150, carbs: 200, fat: 65 },
      allergies: user.healthProfile.allergies,
      weight: user.healthProfile.weight.value,
      gender: user.healthProfile.gender,
      dietStyle,
      budget,
    })
  } catch (err) {
    logger.error('Diet plan generation failed:', err.message)
    planData = generateFallbackDietPlan(user)
  }

  if (!planData.title) {
    planData.title = `${(user.healthProfile.foodPreference || 'Balanced').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Nutrition Plan`
  }

  if (!planData.days || planData.days.length === 0) {
    planData.days = generateFallbackDays(user)
  }

  const dietPlan = await DietPlan.create({
    user: req.user._id,
    title: planData.title,
    description: planData.description || 'Personalized nutrition plan',
    type: user.healthProfile.foodPreference || 'non_veg',
    dailyCalorieTarget: planData.dailyCalorieTarget || user.bodyMetrics?.macros?.calories || 2000,
    dailyProteinTarget: planData.dailyProteinTarget || user.bodyMetrics?.macros?.protein || 150,
    dailyCarbTarget: planData.dailyCarbTarget || user.bodyMetrics?.macros?.carbs || 200,
    dailyFatTarget: planData.dailyFatTarget || user.bodyMetrics?.macros?.fat || 65,
    dailyWaterTarget: planData.dailyWaterTarget || user.bodyMetrics?.dailyWaterIntake || 3,
    days: planData.days,
    supplements: planData.supplements || [],
    isAIGenerated: true,
    isActive: true,
  })

  await Goal.findOneAndUpdate(
    { user: req.user._id, isActive: true },
    { dietPlanId: dietPlan._id }
  )

  return successResponse(res, 201, 'Diet plan generated', { dietPlan })
})

const getActiveDietPlan = asyncHandler(async (req, res) => {
  const dietPlan = await DietPlan.findOne({ user: req.user._id, isActive: true })
  return successResponse(res, 200, dietPlan ? 'Diet plan fetched' : 'No active plan', {
    dietPlan: dietPlan || null,
  })
})

const getTodayMeals = asyncHandler(async (req, res) => {
  const dietPlan = await DietPlan.findOne({ user: req.user._id, isActive: true })

  if (!dietPlan) {
    return successResponse(res, 200, 'No active diet plan', { meals: null })
  }

  const dayOfWeek = new Date().getDay()
  const dayMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
  const todayDayNumber = dayMap[dayOfWeek]

  const todayMeals = dietPlan.days.find((d) => d.dayNumber === todayDayNumber) || dietPlan.days[0]

  return successResponse(res, 200, "Today's meals", {
    meals: todayMeals || null,
    planTitle: dietPlan.title,
    dailyTargets: {
      calories: dietPlan.dailyCalorieTarget,
      protein: dietPlan.dailyProteinTarget,
      carbs: dietPlan.dailyCarbTarget,
      fat: dietPlan.dailyFatTarget,
      water: dietPlan.dailyWaterTarget,
    },
  })
})

const logNutrition = asyncHandler(async (req, res) => {
  const { calories, protein, carbs, fat, water } = req.body

  console.log('LOG NUTRITION REQUEST:', { calories, protein, carbs, fat, water })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const user = await User.findById(req.user._id)
  const targets = user.bodyMetrics?.macros || {}

  let existingProgress = await Progress.findOne({
    user: req.user._id,
    date: { $gte: today, $lt: tomorrow },
  })

  if (!existingProgress) {
    existingProgress = await Progress.create({
      user: req.user._id,
      date: new Date(),
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
        caloriesTarget: targets.calories || 2000,
        proteinTarget: targets.protein || 150,
        carbsTarget: targets.carbs || 200,
        fatTarget: targets.fat || 65,
        waterTarget: user.bodyMetrics?.dailyWaterIntake || 3,
      },
    })
  }

  const currentNutrition = existingProgress.nutrition || {}

  console.log('CURRENT NUTRITION:', currentNutrition)

  const newCalories = Math.max(0, (Number(currentNutrition.calories) || 0) + (Number(calories) || 0))
  const newProtein = Math.max(0, (Number(currentNutrition.protein) || 0) + (Number(protein) || 0))
  const newCarbs = Math.max(0, (Number(currentNutrition.carbs) || 0) + (Number(carbs) || 0))
  const newFat = Math.max(0, (Number(currentNutrition.fat) || 0) + (Number(fat) || 0))
  const newWater = Math.max(0, (Number(currentNutrition.water) || 0) + (Number(water) || 0))

  console.log('NEW VALUES:', { newCalories, newProtein, newCarbs, newFat, newWater })

  existingProgress.nutrition = {
    calories: newCalories,
    protein: newProtein,
    carbs: newCarbs,
    fat: newFat,
    water: newWater,
    caloriesTarget: targets.calories || 2000,
    proteinTarget: targets.protein || 150,
    carbsTarget: targets.carbs || 200,
    fatTarget: targets.fat || 65,
    waterTarget: user.bodyMetrics?.dailyWaterIntake || 3,
  }

  existingProgress.markModified('nutrition')
  await existingProgress.save()

  console.log('SAVED PROGRESS:', existingProgress.nutrition)

  return successResponse(res, 200, 'Nutrition logged', { progress: existingProgress })
})

const getMealAlternatives = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'Alternatives fetched', { alternatives: { alternatives: [] } })
})

const getNutritionStats = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query
  const days = parseInt(period)
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const progressData = await Progress.find({
    user: req.user._id,
    date: { $gte: startDate },
  }).sort({ date: 1 })

  const stats = {
    avgCalories: progressData.length > 0
      ? Math.round(progressData.reduce((s, p) => s + (p.nutrition?.calories || 0), 0) / progressData.length)
      : 0,
    avgProtein: progressData.length > 0
      ? Math.round(progressData.reduce((s, p) => s + (p.nutrition?.protein || 0), 0) / progressData.length)
      : 0,
    avgWater: progressData.length > 0
      ? Math.round((progressData.reduce((s, p) => s + (p.nutrition?.water || 0), 0) / progressData.length) * 10) / 10
      : 0,
    chartData: progressData.map((p) => ({
      date: p.date,
      calories: p.nutrition?.calories || 0,
      protein: p.nutrition?.protein || 0,
      carbs: p.nutrition?.carbs || 0,
      fat: p.nutrition?.fat || 0,
      water: p.nutrition?.water || 0,
    })),
  }

  return successResponse(res, 200, 'Stats fetched', { stats })
})

function generateFallbackDietPlan(user) {
  const calories = user.bodyMetrics?.macros?.calories || 2000
  const protein = user.bodyMetrics?.macros?.protein || 150
  const carbs = user.bodyMetrics?.macros?.carbs || 200
  const fat = user.bodyMetrics?.macros?.fat || 65
  const pref = user.healthProfile?.foodPreference || 'non_veg'

  return {
    title: `${pref.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Nutrition Plan`,
    description: 'Balanced nutrition plan tailored to your goals',
    dailyCalorieTarget: calories,
    dailyProteinTarget: protein,
    dailyCarbTarget: carbs,
    dailyFatTarget: fat,
    dailyWaterTarget: user.bodyMetrics?.dailyWaterIntake || 3,
    days: generateFallbackDays(user),
    supplements: [
      { name: 'Whey Protein', timing: 'Post-workout', amount: '30g', purpose: 'Muscle recovery' },
      { name: 'Creatine Monohydrate', timing: 'Daily', amount: '5g', purpose: 'Strength & performance' },
      { name: 'Multivitamin', timing: 'Morning', amount: '1 tablet', purpose: 'Overall health' },
    ],
  }
}

function generateFallbackDays(user) {
  const pref = user.healthProfile?.foodPreference || 'non_veg'

  const mealTemplates = {
    non_veg: {
      breakfast: [
        { name: 'Eggs (3 whole)', quantity: 150, unit: 'g', calories: 210, protein: 18, carbs: 2, fat: 15, isVeg: false },
        { name: 'Whole Wheat Toast', quantity: 2, unit: 'slices', calories: 140, protein: 6, carbs: 24, fat: 2, isVeg: true },
        { name: 'Banana', quantity: 1, unit: 'piece', calories: 90, protein: 1, carbs: 23, fat: 0, isVeg: true },
      ],
      lunch: [
        { name: 'Grilled Chicken Breast', quantity: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7, isVeg: false },
        { name: 'Brown Rice', quantity: 150, unit: 'g', calories: 170, protein: 4, carbs: 36, fat: 1, isVeg: true },
        { name: 'Mixed Vegetables', quantity: 200, unit: 'g', calories: 80, protein: 3, carbs: 14, fat: 1, isVeg: true },
      ],
      dinner: [
        { name: 'Salmon Fillet', quantity: 180, unit: 'g', calories: 350, protein: 40, carbs: 0, fat: 20, isVeg: false },
        { name: 'Sweet Potato', quantity: 200, unit: 'g', calories: 180, protein: 4, carbs: 42, fat: 0, isVeg: true },
        { name: 'Green Salad', quantity: 150, unit: 'g', calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
      ],
      snack: [
        { name: 'Greek Yogurt', quantity: 200, unit: 'g', calories: 130, protein: 20, carbs: 8, fat: 2, isVeg: true },
        { name: 'Almonds', quantity: 30, unit: 'g', calories: 170, protein: 6, carbs: 6, fat: 14, isVeg: true },
      ],
    },
    veg: {
      breakfast: [
        { name: 'Oats with Milk', quantity: 80, unit: 'g', calories: 280, protein: 12, carbs: 48, fat: 6, isVeg: true },
        { name: 'Mixed Fruits', quantity: 150, unit: 'g', calories: 90, protein: 1, carbs: 22, fat: 0, isVeg: true },
        { name: 'Peanut Butter', quantity: 20, unit: 'g', calories: 120, protein: 5, carbs: 3, fat: 10, isVeg: true },
      ],
      lunch: [
        { name: 'Paneer Tikka', quantity: 150, unit: 'g', calories: 320, protein: 28, carbs: 8, fat: 20, isVeg: true },
        { name: 'Roti (3)', quantity: 3, unit: 'pieces', calories: 240, protein: 9, carbs: 45, fat: 3, isVeg: true },
        { name: 'Dal Fry', quantity: 200, unit: 'ml', calories: 180, protein: 12, carbs: 28, fat: 4, isVeg: true },
      ],
      dinner: [
        { name: 'Tofu Stir Fry', quantity: 200, unit: 'g', calories: 250, protein: 20, carbs: 12, fat: 14, isVeg: true },
        { name: 'Quinoa', quantity: 150, unit: 'g', calories: 180, protein: 8, carbs: 32, fat: 3, isVeg: true },
        { name: 'Steamed Broccoli', quantity: 150, unit: 'g', calories: 50, protein: 4, carbs: 8, fat: 1, isVeg: true },
      ],
      snack: [
        { name: 'Protein Smoothie', quantity: 300, unit: 'ml', calories: 200, protein: 25, carbs: 18, fat: 4, isVeg: true },
        { name: 'Trail Mix', quantity: 40, unit: 'g', calories: 190, protein: 5, carbs: 15, fat: 13, isVeg: true },
      ],
    },
  }

  const template = mealTemplates[pref] || mealTemplates.non_veg
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return dayNames.map((name, i) => {
    const bfCal = template.breakfast.reduce((s, f) => s + f.calories, 0)
    const lnCal = template.lunch.reduce((s, f) => s + f.calories, 0)
    const dnCal = template.dinner.reduce((s, f) => s + f.calories, 0)
    const snCal = template.snack.reduce((s, f) => s + f.calories, 0)

    return {
      dayNumber: i + 1,
      dayName: name,
      totalCalories: bfCal + lnCal + dnCal + snCal,
      totalProtein: [...template.breakfast, ...template.lunch, ...template.dinner, ...template.snack].reduce((s, f) => s + f.protein, 0),
      totalCarbs: [...template.breakfast, ...template.lunch, ...template.dinner, ...template.snack].reduce((s, f) => s + f.carbs, 0),
      totalFat: [...template.breakfast, ...template.lunch, ...template.dinner, ...template.snack].reduce((s, f) => s + f.fat, 0),
      waterIntake: 3,
      meals: [
        { type: 'breakfast', time: '7:30 AM', foods: template.breakfast, totalCalories: bfCal, totalProtein: template.breakfast.reduce((s, f) => s + f.protein, 0), totalCarbs: template.breakfast.reduce((s, f) => s + f.carbs, 0), totalFat: template.breakfast.reduce((s, f) => s + f.fat, 0) },
        { type: 'lunch', time: '1:00 PM', foods: template.lunch, totalCalories: lnCal, totalProtein: template.lunch.reduce((s, f) => s + f.protein, 0), totalCarbs: template.lunch.reduce((s, f) => s + f.carbs, 0), totalFat: template.lunch.reduce((s, f) => s + f.fat, 0) },
        { type: 'dinner', time: '7:30 PM', foods: template.dinner, totalCalories: dnCal, totalProtein: template.dinner.reduce((s, f) => s + f.protein, 0), totalCarbs: template.dinner.reduce((s, f) => s + f.carbs, 0), totalFat: template.dinner.reduce((s, f) => s + f.fat, 0) },
        { type: 'snack', time: '4:30 PM', foods: template.snack, totalCalories: snCal, totalProtein: template.snack.reduce((s, f) => s + f.protein, 0), totalCarbs: template.snack.reduce((s, f) => s + f.carbs, 0), totalFat: template.snack.reduce((s, f) => s + f.fat, 0) },
      ],
      shoppingList: [...new Set([...template.breakfast, ...template.lunch, ...template.dinner, ...template.snack].map(f => f.name))],
    }
  })
}

module.exports = {
  generateDietPlan,
  getActiveDietPlan,
  getTodayMeals,
  logNutrition,
  getMealAlternatives,
  getNutritionStats,
}