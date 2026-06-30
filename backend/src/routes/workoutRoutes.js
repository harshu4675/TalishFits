const express = require('express')
const router = express.Router()

const {
  generateWorkoutPlan,
  getActiveWorkoutPlan,
  getTodayWorkout,
  completeWorkoutDay,
  getExerciseTips,
  getAllWorkoutPlans,
  getWorkoutStats,
} = require('../controllers/workoutController')

const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/generate', generateWorkoutPlan)
router.get('/active', getActiveWorkoutPlan)
router.get('/today', getTodayWorkout)
router.post('/complete', completeWorkoutDay)
router.get('/all', getAllWorkoutPlans)
router.get('/stats', getWorkoutStats)
router.get('/exercise-tips/:exerciseName', getExerciseTips)

module.exports = router