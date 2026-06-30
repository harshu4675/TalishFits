const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'ValidationError') {
    statusCode = 400
    const errors = Object.values(err.errors).map((val) => val.message)
    message = errors.join('. ')
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  if (statusCode >= 500) {
    console.error(`${statusCode} - ${message}`, {
      url: req.originalUrl,
      method: req.method,
    })
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

const createError = (statusCode, message) => {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

module.exports = { errorHandler, asyncHandler, createError }