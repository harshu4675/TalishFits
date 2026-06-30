const cron = require('node-cron')
const User = require('../models/User')
const Notification = require('../models/Notification')
const logger = require('../utils/logger')

const motivationMessages = [
  { title: 'Rise & Train', message: 'Discipline beats motivation. Your body is waiting.' },
  { title: 'Time to Move', message: 'A workout today is a gift to tomorrow you.' },
  { title: 'Stay Strong', message: 'Every rep counts. Every choice matters.' },
  { title: 'Make It Count', message: 'The only bad workout is the one that didn\'t happen.' },
  { title: 'Start Strong', message: 'Champions are built one rep at a time.' },
]

const workoutReminders = [
  { title: 'Workout Reminder', message: 'You have an active workout plan. Time to crush it.' },
  { title: 'Time to Train', message: 'Your body is your gym. Get moving.' },
  { title: 'Don\'t Skip Today', message: 'Consistency is your superpower. Show up.' },
]

const waterReminders = [
  { title: 'Hydration Check', message: 'Drink a glass of water now. Your performance depends on it.' },
  { title: 'Water Break', message: 'Time to refill your water bottle. Stay hydrated.' },
  { title: 'Stay Hydrated', message: 'Your muscles need water to perform. Take a sip.' },
]

const sleepReminders = [
  { title: 'Wind Down', message: 'Quality sleep equals muscle growth and recovery. Time to rest.' },
  { title: 'Recovery Time', message: 'Sleep is when your body builds. Get your rest tonight.' },
]

const mealReminders = [
  { title: 'Meal Time', message: 'Fuel your body with quality nutrition. Time to eat.' },
  { title: 'Don\'t Skip Meals', message: 'Consistent meals power your transformation.' },
]

const sendBulkNotification = async (users, template, type) => {
  if (!users || users.length === 0) return

  try {
    const docs = users.map(user => ({
      user: user._id,
      title: template.title,
      message: template.message,
      type,
      isRead: false,
      createdAt: new Date(),
    }))

    await Notification.insertMany(docs)
    logger.info(`Sent ${docs.length} ${type} notifications`)
  } catch (err) {
    logger.error(`Failed to send ${type} notifications:`, err.message)
  }
}

const getRandomTemplate = (templates) => {
  return templates[Math.floor(Math.random() * templates.length)]
}

const startScheduler = () => {

  cron.schedule('0 7 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.morning': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(motivationMessages)
      await sendBulkNotification(users, template, 'motivation')
    } catch (err) {
      logger.error('Morning motivation error:', err.message)
    }
  })

  cron.schedule('0 8 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.workout': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(workoutReminders)
      await sendBulkNotification(users, template, 'workout_reminder')
    } catch (err) {
      logger.error('Workout reminder error:', err.message)
    }
  })

  cron.schedule('0 17 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.workout': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(workoutReminders)
      await sendBulkNotification(users, template, 'workout_reminder')
    } catch (err) {
      logger.error('Evening workout reminder error:', err.message)
    }
  })

  cron.schedule('0 10,13,16 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.water': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(waterReminders)
      await sendBulkNotification(users, template, 'water_reminder')
    } catch (err) {
      logger.error('Water reminder error:', err.message)
    }
  })

  cron.schedule('0 12 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.meal': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(mealReminders)
      await sendBulkNotification(users, template, 'meal_reminder')
    } catch (err) {
      logger.error('Lunch reminder error:', err.message)
    }
  })

  cron.schedule('0 19 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.meal': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(mealReminders)
      await sendBulkNotification(users, template, 'meal_reminder')
    } catch (err) {
      logger.error('Dinner reminder error:', err.message)
    }
  })

  cron.schedule('0 22 * * *', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.sleep': { $ne: false },
      }).select('_id')

      const template = getRandomTemplate(sleepReminders)
      await sendBulkNotification(users, template, 'sleep_reminder')
    } catch (err) {
      logger.error('Sleep reminder error:', err.message)
    }
  })

  cron.schedule('0 9 * * 0', async () => {
    try {
      const users = await User.find({
        isActive: true,
        isOnboarded: true,
        'preferences.notifications.weekly': { $ne: false },
      }).select('_id')

      const template = {
        title: 'Your Weekly Report Is Ready',
        message: 'Check your dashboard to see how you performed this week and plan ahead.',
      }
      await sendBulkNotification(users, template, 'weekly_report')
    } catch (err) {
      logger.error('Weekly report error:', err.message)
    }
  })

  cron.schedule('0 3 * * *', async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true,
      })
      logger.info(`Cleaned up ${result.deletedCount} old notifications`)
    } catch (err) {
      logger.error('Notification cleanup error:', err.message)
    }
  })

  logger.info('All cron jobs registered successfully')
}

module.exports = { startScheduler, sendBulkNotification }