const express = require('express')
const router = express.Router()

const {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
} = require('../controllers/notificationController')

const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', getNotifications)
router.post('/', createNotification)
router.put('/read/:notificationId', markAsRead)
router.delete('/:notificationId', deleteNotification)

module.exports = router