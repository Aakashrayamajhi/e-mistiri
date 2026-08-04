import { jest } from '@jest/globals';

const mockRedis = {
  store: {},
  async incr(key) {
    this.store[key] = (this.store[key] || 0) + 1;
    return this.store[key];
  },
  async expire(key, ttl) { return 1; },
  async ttl(key) {
    if (!this.store[key]) return -2;
    return 60;
  },
  async set(key, value) {
    this.store[key] = value;
    return 'OK';
  },
  async get(key) {
    return this.store[key] || null;
  },
  async del(key) {
    delete this.store[key];
    return 1;
  },
  async keys(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Object.keys(this.store).filter(k => regex.test(k));
  },
  async quit() { return 'OK'; },
};

jest.unstable_mockModule('ioredis', () => ({
  __esModule: true,
  default: class MockRedis {
    constructor() {
      return mockRedis;
    }
  }
}));

const { createRateLimiter } = await import('../src/middleware/ratelimiter.middleware.js');

describe('Rate Limiter', () => {
  beforeEach(() => {
    mockRedis.store = {};
  });

  it('should allow requests within limit', async () => {
    const limiter = createRateLimiter(20, 60000);
    const next = jest.fn();
    const res = {
      setHeader: jest.fn(),
      status: jest.fn(() => ({ json: jest.fn() })),
    };

    await limiter({ ip: '127.0.0.1', method: 'GET', path: '/test' }, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should block requests exceeding limit', async () => {
    const limiter = createRateLimiter(20, 60000);
    const next = jest.fn();
    const jsonMock = jest.fn();
    const res = {
      setHeader: jest.fn(),
      status: jest.fn(() => ({ json: jsonMock })),
    };

    mockRedis.store['ratelimit:127.0.0.1:GET:/test'] = 21;
    await limiter({ ip: '127.0.0.1', method: 'GET', path: '/test' }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringMatching(/Too many requests/),
      })
    );
  });

  it('should set rate limit headers', async () => {
    const limiter = createRateLimiter(20, 60000);
    const next = jest.fn();
    const res = {
      setHeader: jest.fn(),
      status: jest.fn(() => ({ json: jest.fn() })),
    };

    await limiter({ ip: '127.0.0.1', method: 'GET', path: '/test' }, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '20');
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(String));
  });

  it('should continue on Redis error', async () => {
    const limiter = createRateLimiter(20, 60000);
    mockRedis.incr = async () => { throw new Error('Redis down'); };
    const next = jest.fn();
    const res = {
      setHeader: jest.fn(),
      status: jest.fn(() => ({ json: jest.fn() })),
    };

    await limiter({ ip: '127.0.0.1', method: 'GET', path: '/test' }, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
