import { loginLimiter, signupLimiter, otpLimiter } from '../src/middleware/rateLimiter.middleware.js';
import mockRedis from './__mocks__/auth-services/redis.config.js';

describe('Rate Limiter Middleware', () => {
  beforeEach(() => {
    Object.assign(mockRedis, {
      incr: async () => 1,
      pexpire: async () => 1,
      pttl: async () => 60000,
    });
  });

  it('should allow request within limit', async () => {
    const req = { ip: '127.0.0.1', body: {} };
    let statusCode = null;
    let nextCalled = false;
    const res = {
      set: () => res,
      status: (code) => { statusCode = code; return res; },
      json: (data) => data,
    };
    const next = () => { nextCalled = true; };

    await loginLimiter(req, res, next);
    expect(nextCalled).toBe(true);
    expect(statusCode).toBeNull();
  });

  it('should block request exceeding limit', async () => {
    mockRedis.incr = async () => 6;
    mockRedis.pttl = async () => 30000;

    const req = { ip: '127.0.0.1', body: {} };
    let statusCode = null;
    let jsonData = null;
    let nextCalled = false;
    const res = {
      set: () => res,
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonData = data; return res; },
    };
    const next = () => { nextCalled = true; };

    await loginLimiter(req, res, next);
    expect(statusCode).toBe(429);
    expect(jsonData.success).toBe(false);
    expect(nextCalled).toBe(false);
  });

  it('should call next on Redis error', async () => {
    mockRedis.incr = async () => { throw new Error('Redis down'); };

    const req = { ip: '127.0.0.1', body: {} };
    let nextCalled = false;
    const res = {};
    const next = () => { nextCalled = true; };

    await loginLimiter(req, res, next);
    expect(nextCalled).toBe(true);
  });

  it('should use phone-based key for OTP limiter', async () => {
    const req = { ip: '127.0.0.1', body: { phone: '9876543210' } };
    let nextCalled = false;
    const res = {
      set: () => res,
      status: (code) => res,
      json: (data) => data,
    };
    const next = () => { nextCalled = true; };

    await otpLimiter(req, res, next);
    expect(nextCalled).toBe(true);
  });
});
