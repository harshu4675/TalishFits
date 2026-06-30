const express = require('express')
const router = express.Router()

const {
  getUserAchievements,
  checkAchievements,
} = require('../controllers/achievementController')

const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', getUserAchievements)
router.post('/check', checkAchievements)

module.exports = router