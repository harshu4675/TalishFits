const rateLimit = require('express-rate-limit')

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

const authLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  'Too many auth attempts. Please try again in 15 minutes.'
)

const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests. Please slow down.'
)

const aiLimiter = createLimiter(
  60 * 60 * 1000,
  30,
  'AI rate limit exceeded. Please try again in an hour.'
)

module.exports = { authLimiter, apiLimiter, aiLimiter }