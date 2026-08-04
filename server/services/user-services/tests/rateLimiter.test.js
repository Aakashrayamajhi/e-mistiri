import { publicReadLimiter, writeLimiter, adminActionLimiter } from '../src/middleware/rateLimiter.middleware.js';

jest.mock('ioredis', () => {
  const mockInc = jest.fn();
  const mockExpire = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      incr: mockInc,
      expire: mockExpire,
    }))
  };
});

describe('Rate Limiter Middleware', () => {
  let mockRedis;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedis = await import('ioredis');
  });

  it('should allow GET requests within public read limit', async () => {
    mockRedis.default().incr.mockResolvedValue(1);
    mockRedis.default().expire.mockResolvedValue(1);

    const req = { method: 'GET', ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await publicReadLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should skip non-GET requests for public read limiter', async () => {
    const req = { method: 'POST', ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = {};
    const next = jest.fn();

    await publicReadLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(mockRedis.default().incr).not.toHaveBeenCalled();
  });

  it('should block requests exceeding public read limit', async () => {
    mockRedis.default().incr.mockResolvedValue(51);

    const req = { method: 'GET', ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await publicReadLimiter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow write requests within limit', async () => {
    mockRedis.default().incr.mockResolvedValue(1);
    mockRedis.default().expire.mockResolvedValue(1);

    const req = { method: 'POST', ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await writeLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should skip non-write requests for write limiter', async () => {
    const req = { method: 'GET', ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = {};
    const next = jest.fn();

    await writeLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should block requests exceeding write limit', async () => {
    mockRedis.default().incr.mockResolvedValue(21);

    const req = { method: 'POST', ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await writeLimiter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow admin requests within limit', async () => {
    mockRedis.default().incr.mockResolvedValue(1);
    mockRedis.default().expire.mockResolvedValue(1);

    const req = { ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await adminActionLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should block requests exceeding admin limit', async () => {
    mockRedis.default().incr.mockResolvedValue(11);

    const req = { ip: '127.0.0.1', originalUrl: '/api/v1/user' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await adminActionLimiter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });
});
