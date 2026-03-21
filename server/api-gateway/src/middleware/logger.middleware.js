import { logger } from '../utils/logger.js'

export const loggerMiddleware = (req, res, next) => {
    console.log("LOGGER HIT")
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    const logData = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    }

    const message = `${req.method} ${req.originalUrl} - ${res.statusCode}`

    if (res.statusCode >= 500) {
      logger.error(message, logData)
    } else if (res.statusCode >= 400) {
      logger.warn(message, logData)
    } else {
      logger.info(message, logData)
    }
  })

  next()
}