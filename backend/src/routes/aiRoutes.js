const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const User = require('../models/User')
const aiService = require('../services/aiService')

router.use(protect)

// AI Chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body
    const user = await User.findById(req.user._id)

    const prompt = `
User Profile: ${user.healthProfile?.gender || 'unknown'}, 
${user.healthProfile?.age || 'unknown'} years old, 
Goal: ${user.selectedGoal || 'general fitness'}, 
Experience: ${user.healthProfile?.workoutExperience || 'beginner'}

User Question: ${message}

Provide a helpful, specific, and motivating response.
Return JSON: { "response": "your answer", "tips": ["tip1", "tip2"], "relatedTopics": ["topic1"] }
`
    const response = await aiService.generate(prompt, 800)
    const parsed = JSON.parse(response)

    return res.status(200).json({ success: true, data: { ai: parsed } })
  } catch (error) {
    console.error('AI chat error:', error)
    return res.status(500).json({ success: false, message: 'AI service unavailable' })
  }
})

// Get motivation
router.get('/motivation', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const motivation = await aiService.generateMotivation({
      name: user.name.split(' ')[0],
      goal: user.selectedGoal || 'fitness',
      streak: user.gamification?.streak?.current || 0,
      progress: 0,
    })

    return res.status(200).json({ success: true, data: { motivation } })
  } catch (error) {
    console.error('AI motivation error:', error)
    return res.status(200).json({
      success: true,
      data: {
        motivation: {
          messages: [{ type: 'morning', title: 'Keep Going', message: 'Every rep counts. Stay consistent.', emoji: '🔥' }],
          dailyQuote: 'The body achieves what the mind believes.',
          weeklyChallenge: 'Complete all your planned workouts this week.',
        },
      },
    })
  }
})

// Generate custom meal
router.post('/meal', async (req, res) => {
  try {
    const { mealType, calories, preference } = req.body
    const user = await User.findById(req.user._id)

    const prompt = `
Create a specific ${mealType} meal for a ${user.healthProfile?.foodPreference || preference || 'non_veg'} diet.
Target calories: ${calories || 400}
User's goal: ${user.selectedGoal || 'healthy eating'}

Return JSON: {
  "mealName": "name",
  "ingredients": [{"item": "name", "amount": "quantity", "calories": 0}],
  "totalCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "recipe": "step by step preparation",
  "prepTime": "X minutes",
  "tips": ["tip1"]
}
`
    const response = await aiService.generate(prompt, 1000)
    const meal = JSON.parse(response)

    return res.status(200).json({ success: true, data: { meal } })
  } catch (error) {
    console.error('AI meal error:', error)
    return res.status(500).json({ success: false, message: 'AI service unavailable' })
  }
})

// Recovery advice
router.get('/recovery', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const prompt = `
Provide recovery advice for a ${user.healthProfile?.workoutExperience || 'intermediate'} 
fitness enthusiast with goal: ${user.selectedGoal || 'general fitness'}.
Sleep: ${user.healthProfile?.sleepHours || 7} hours.

Return JSON: {
  "recoveryTips": ["tip1", "tip2", "tip3"],
  "stretchingRoutine": [{"stretch": "name", "duration": "30 sec", "target": "muscle"}],
  "nutritionForRecovery": ["advice1", "advice2"],
  "sleepOptimization": "advice",
  "activeRecovery": "suggestions"
}
`
    const response = await aiService.generate(prompt, 1000)
    const recovery = JSON.parse(response)

    return res.status(200).json({ success: true, data: { recovery } })
  } catch (error) {
    console.error('AI recovery error:', error)
    return res.status(500).json({ success: false, message: 'AI service unavailable' })
  }
})

module.exports = router