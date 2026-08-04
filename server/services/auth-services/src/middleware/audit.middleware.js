import redis from '../../config/redis.config.js';
import { logger } from '../../utils/logger.js';

export const auditLog = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
      if (req.user && [200, 201].includes(res.statusCode)) {
        const auditData = {
          action,
          userId: req.user.id,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent'),
          timestamp: new Date().toISOString()
        };

        const key = `audit:${req.user.id}:${Date.now()}`;
        redis.set(key, JSON.stringify(auditData), 'EX', 30 * 24 * 60 * 60).catch((err) => {
          logger.error('Audit log error:', err);
        });
      }

      res.send = originalSend;
      return res.send(body);
    };

    next();
  };
};
