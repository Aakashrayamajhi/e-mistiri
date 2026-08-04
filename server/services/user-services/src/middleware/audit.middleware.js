import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379
});

export const auditLog = (entity, action) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (body && body.success) {
        const timestamp = Date.now();
        const id = req.params.id || body.data?._id || 'unknown';
        const key = `audit:${entity}:${id}:${timestamp}`;
        await redis.hSet(key, {
          action,
          userId: req.headers['x-user-id'] || 'anonymous',
          ip: req.ip,
          userAgent: req.headers['user-agent'] || ''
        });
        await redis.expire(key, 86400);
      }
      return originalJson(body);
    };
    next();
  };
};
