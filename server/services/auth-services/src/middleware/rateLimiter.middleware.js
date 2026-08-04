import redis from '../../config/redis.config.js';

const createRateLimiter = (windowMs, max, getKey) => {
  return async (req, res, next) => {
    try {
      const key = getKey ? getKey(req) : `ratelimit:${req.ip}`;

      const count = await redis.incr(key);

      if (count === 1) {
        await redis.pexpire(key, windowMs);
      }

      const ttl = await redis.pttl(key);

      res.set('X-RateLimit-Limit', max.toString());
      res.set('X-RateLimit-Remaining', Math.max(0, max - count).toString());

      if (count > max) {
        res.set('Retry-After', Math.ceil(ttl / 1000).toString());
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const loginLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  (req) => `login:${req.ip}`
);

export const signupLimiter = createRateLimiter(
  60 * 60 * 1000,
  10,
  (req) => `signup:${req.ip}`
);

export const otpLimiter = createRateLimiter(
  10 * 60 * 1000,
  3,
  (req) => `otp:${req.body?.phone || req.query?.phone || 'unknown'}`
);
