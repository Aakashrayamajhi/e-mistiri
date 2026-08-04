import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

export const acquireLock = async (key, ttl = 30) => {
  const result = await redis.set(`lock:${key}`, "1", "NX", "EX", ttl);
  return result === "OK";
};

export const releaseLock = async (key) => {
  await redis.del(`lock:${key}`);
};

export { redis as redisLockClient };
