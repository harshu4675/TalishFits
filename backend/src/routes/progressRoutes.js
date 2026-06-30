const express = require('express')
const router = express.Router()

const {
  logProgress,
  getProgressHistory,
  uploadProgressPhotoHandler,
  getProgressAdvice,
  getBodyMeasurements,
  logSteps,
  getTodaySteps,
} = require('../controllers/progressController')

const { protect } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.use(protect)

router.post('/log', logProgress)
router.get('/history', getProgressHistory)
router.post('/photo', upload.single('photo'), uploadProgressPhotoHandler)
router.get('/advice', getProgressAdvice)
router.get('/measurements', getBodyMeasurements)
router.post('/steps', logSteps)
router.get('/steps/today', getTodaySteps)

module.exports = router 