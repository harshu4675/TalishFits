const express = require('express')
const router = express.Router()

const {
  generateDietPlan,
  getActiveDietPlan,
  getTodayMeals,
  logNutrition,
  getMealAlternatives,
  getNutritionStats,
} = require('../controllers/dietController')

const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/generate', generateDietPlan)
router.get('/active', getActiveDietPlan)
router.get('/today', getTodayMeals)
router.post('/log', logNutrition)
router.get('/stats', getNutritionStats)
router.get('/alternatives/:meal', getMealAlternatives)

module.exports = router