import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app.js';

jest.mock('../src/config/redis.config.js', () => ({
  __esModule: true,
  default: {
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
  }
}));

describe('Rate Limiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow requests within limit', async () => {
    const mockRedis = await import('../src/config/redis.config.js');
    mockRedis.default.incr.mockResolvedValue(1);
    mockRedis.default.expire.mockResolvedValue(1);
    mockRedis.default.ttl.mockResolvedValue(60);

    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('should block requests exceeding limit', async () => {
    const mockRedis = await import('../src/config/redis.config.js');
    mockRedis.default.incr.mockResolvedValue(21);
    mockRedis.default.ttl.mockResolvedValue(60);

    const res = await request(app).get('/health');
    expect(res.status).toBe(429);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Too many requests/);
  });

  it('should set rate limit headers', async () => {
    const mockRedis = await import('../src/config/redis.config.js');
    mockRedis.default.incr.mockResolvedValue(1);
    mockRedis.default.expire.mockResolvedValue(1);
    mockRedis.default.ttl.mockResolvedValue(60);

    const res = await request(app).get('/health');
    expect(res.headers['x-ratelimit-limit']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBeDefined();
  });

  it('should continue on Redis error', async () => {
    const mockRedis = await import('../src/config/redis.config.js');
    mockRedis.default.incr.mockRejectedValue(new Error('Redis down'));

    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
