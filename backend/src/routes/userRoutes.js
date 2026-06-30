const express = require('express')
const router = express.Router()

const {
  updateHealthProfile,
  setGoal,
  completeOnboarding,
  getProfile,
  updateProfile,
  uploadAvatarHandler,
  getDashboard,
  updateFCMToken,
  deleteAccount,
} = require('../controllers/userController')

const { protect } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/dashboard', getDashboard)
router.put('/health-profile', updateHealthProfile)
router.post('/goal', setGoal)
router.post('/complete-onboarding', completeOnboarding)
router.post('/avatar', upload.single('avatar'), uploadAvatarHandler)
router.put('/fcm-token', updateFCMToken)
router.delete('/account', deleteAccount)

module.exports = router