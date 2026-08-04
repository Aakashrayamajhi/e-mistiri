import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379
});

export const publicReadLimiter = async (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }
  const key = `rate:public:${req.ip}:${req.originalUrl}`;
  const allowed = await redis.incr(key);
  if (allowed === 1) {
    await redis.expire(key, 60);
  }
  if (allowed > 50) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
  next();
};

export const writeLimiter = async (req, res, next) => {
  if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }
  const key = `rate:write:${req.ip}:${req.originalUrl}`;
  const allowed = await redis.incr(key);
  if (allowed === 1) {
    await redis.expire(key, 60);
  }
  if (allowed > 20) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
  next();
};

export const adminActionLimiter = async (req, res, next) => {
  const key = `rate:admin:${req.ip}:${req.originalUrl}`;
  const allowed = await redis.incr(key);
  if (allowed === 1) {
    await redis.expire(key, 60);
  }
  if (allowed > 10) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
  next();
};
