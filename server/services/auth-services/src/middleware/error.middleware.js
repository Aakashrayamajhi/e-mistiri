import { logger } from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(message, {
    path: req.path,
    method: req.method,
    error: err.stack,
    statusCode: status
  });

  res.status(status).json({
    success: false,
    code: status,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
