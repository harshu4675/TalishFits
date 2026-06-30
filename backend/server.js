require('dotenv').config()
const app = require('./src/app')
const { connectDB } = require('./src/config/db')
const { startScheduler } = require('./src/services/scheduler')
const logger = require('./src/utils/logger')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      logger.info(`TalishFits Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV}`)
      logger.info(`URL: http://localhost:${PORT}`)
      logger.info(`Health: http://localhost:${PORT}/health`)
    })

    startScheduler()
    logger.info('Notification scheduler initialized')
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err.message)
  process.exit(1)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.')
  process.exit(0)
})