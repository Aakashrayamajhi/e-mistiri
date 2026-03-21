import { logger } from '../utils/logger.js'

export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  
  logger.error(`[${status}] ${message}`, {
    path: req.path,
    method: req.method,
    error: err.stack
  })

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
