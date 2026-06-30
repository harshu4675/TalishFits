const Notification = require('../models/Notification')
const logger = require('./logger')

const sendNotification = async ({ userId, title, message, type = 'system', metadata = {} }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      metadata,
      isRead: false,
    })
    return notification
  } catch (err) {
    logger.error('Notification creation failed:', err.message)
    return null
  }
}

module.exports = { sendNotification }