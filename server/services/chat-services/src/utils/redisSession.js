import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

const PREFIX = "user:socket:";

export const saveUserSession = async (userId, socketId) => {
  await redis.set(`${PREFIX}${userId}`, socketId, "EX", 24 * 60 * 60);
};

export const getUserSession = async (userId) => {
  const socketId = await redis.get(`${PREFIX}${userId}`);
  return socketId;
};

export const removeUserSession = async (userId) => {
  await redis.del(`${PREFIX}${userId}`);
};

export { redis as redisSessionClient };
