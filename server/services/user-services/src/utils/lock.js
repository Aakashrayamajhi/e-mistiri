import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379
});

export const acquireLock = async (key, ttl = 10) => {
  const lockKey = `lock:${key}`;
  const result = await redis.set(lockKey, '1', 'NX', 'EX', ttl);
  return result === 'OK';
};

export const releaseLock = async (key) => {
  const lockKey = `lock:${key}`;
  await redis.del(lockKey);
};
