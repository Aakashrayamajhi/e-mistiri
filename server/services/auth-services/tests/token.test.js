import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  isRefreshTokenValid
} from '../src/utils/token.service.js';
import mockRedis, { getCalls, clearCalls } from './__mocks__/auth-services/redis.config.js';
import { env } from '../src/config/dotenv.config.js';

describe('Token Service', () => {
  beforeEach(() => {
    clearCalls();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: 'user123', role: 'user' };
      const token = generateAccessToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, env.JWT_SECRET);
      expect(decoded.id).toBe('user123');
      expect(decoded.role).toBe('user');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const payload = { id: 'user123', role: 'user' };
      const token = generateRefreshToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
      expect(decoded.id).toBe('user123');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const payload = { id: 'user123', role: 'user' };
      const token = generateRefreshToken(payload);
      const decoded = verifyRefreshToken(token);
      expect(decoded.id).toBe('user123');
    });

    it('should throw on invalid token', () => {
      expect(() => verifyRefreshToken('invalid-token')).toThrow();
    });
  });

  describe('storeRefreshToken', () => {
    it('should call redis.set with correct arguments', async () => {
      await storeRefreshToken('user123', 'some-token');
      const calls = getCalls();
      const setCall = calls.find(c => c.method === 'set');
      expect(setCall).toBeDefined();
      expect(setCall.args[0]).toBe('refreshToken:user123:some-token');
      expect(setCall.args[1]).toBe('valid');
      expect(setCall.args[2]).toBe('EX');
      expect(setCall.args[3]).toBe(604800);
    });
  });

  describe('revokeRefreshToken', () => {
    it('should call redis.del with correct arguments', async () => {
      await revokeRefreshToken('user123', 'some-token');
      const calls = getCalls();
      const delCall = calls.find(c => c.method === 'del');
      expect(delCall).toBeDefined();
      expect(delCall.args[0]).toBe('refreshToken:user123:some-token');
    });
  });

  describe('isRefreshTokenValid', () => {
    it('should return true when redis.exists returns 1', async () => {
      mockRedis.exists = async () => 1;
      const result = await isRefreshTokenValid('user123', 'some-token');
      expect(result).toBe(true);
    });

    it('should return false when redis.exists returns 0', async () => {
      mockRedis.exists = async () => 0;
      const result = await isRefreshTokenValid('user123', 'some-token');
      expect(result).toBe(false);
    });
  });
});
