import { idempotencyMiddleware } from '../src/middleware/idempotency.middleware.js';

jest.mock('ioredis', () => {
  const mockGet = jest.fn();
  const mockSetEx = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      get: mockGet,
      setEx: mockSetEx,
    }))
  };
});

describe('Idempotency Middleware', () => {
  let mockRedis;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedis = await import('ioredis');
  });

  it('should pass through GET requests', async () => {
    const req = { method: 'GET', headers: {} };
    const res = {};
    const next = jest.fn();

    await idempotencyMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(mockRedis.default().get).not.toHaveBeenCalled();
  });

  it('should pass through requests without idempotency key', async () => {
    const req = { method: 'POST', headers: {} };
    const res = { json: jest.fn() };
    const next = jest.fn();

    await idempotencyMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(mockRedis.default().get).not.toHaveBeenCalled();
  });

  it('should return cached response when idempotency key exists', async () => {
    const cachedResponse = { success: true, data: { id: '123' } };
    mockRedis.default().get.mockResolvedValue(JSON.stringify(cachedResponse));

    const req = { method: 'POST', headers: { 'idempotency-key': 'key123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await idempotencyMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cachedResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it('should cache response for new idempotency key', async () => {
    mockRedis.default().get.mockResolvedValue(null);
    mockRedis.default().setEx.mockResolvedValue('OK');

    const req = { method: 'POST', headers: { 'idempotency-key': 'key456' } };
    const originalJson = jest.fn(() => ({ success: true }));
    const res = {
      json: originalJson,
    };
    const next = jest.fn();

    await idempotencyMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();

    res.json({ success: true, data: { id: '456' } });
    expect(mockRedis.default().setEx).toHaveBeenCalledWith(
      'idempotency:key456',
      86400,
      JSON.stringify({ success: true, data: { id: '456' } })
    );
  });

  it('should pass through PATCH and DELETE without idempotency key', async () => {
    const req = { method: 'DELETE', headers: {} };
    const res = {};
    const next = jest.fn();

    await idempotencyMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(mockRedis.default().get).not.toHaveBeenCalled();
  });
});
