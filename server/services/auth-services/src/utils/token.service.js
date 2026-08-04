import jwt from 'jsonwebtoken';
import redis from '../config/redis.config.js';
import { env } from '../config/dotenv.config.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '15m'
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

export const storeRefreshToken = async (userId, token) => {
  const key = `refreshToken:${userId}:${token}`;
  const ttl = 7 * 24 * 60 * 60;
  await redis.set(key, 'valid', 'EX', ttl);
};

export const revokeRefreshToken = async (userId, token) => {
  const key = `refreshToken:${userId}:${token}`;
  await redis.del(key);
};

export const isRefreshTokenValid = async (userId, token) => {
  const key = `refreshToken:${userId}:${token}`;
  const result = await redis.exists(key);
  return result === 1;
};
