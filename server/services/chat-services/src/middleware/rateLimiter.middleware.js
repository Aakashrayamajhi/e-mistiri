import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

const RATE_LIMIT_MESSAGE = "rl:msg";
const RATE_LIMIT_EVENT = "rl:event";

export const rateLimiterMiddleware = (req, res, next) => {
  next();
};

export const checkMessageRateLimit = async (userId) => {
  const key = `${RATE_LIMIT_MESSAGE}:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= 30;
};

export const checkEventRateLimit = async (userId) => {
  const key = `${RATE_LIMIT_EVENT}:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= 100;
};

export { redis as redisRateLimiterClient };
