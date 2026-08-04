import { jest } from '@jest/globals';
import { auditLog } from '../src/middleware/audit.middleware.js';

jest.mock('ioredis', () => {
  const mockHSet = jest.fn();
  const mockExpire = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      hSet: mockHSet,
      expire: mockExpire,
    }))
  };
});

describe('Audit Middleware', () => {
  let mockRedis;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedis = await import('ioredis');
  });

  it('should log successful response', async () => {
    mockRedis.default().hSet.mockResolvedValue(1);
    mockRedis.default().expire.mockResolvedValue(1);

    const middleware = auditLog('user', 'create');
    const req = {
      params: { id: '123' },
      headers: { 'x-user-id': 'user1', 'user-agent': 'test' },
      ip: '127.0.0.1'
    };
    const originalJson = jest.fn(() => ({}));
    const res = {
      json: originalJson,
    };
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();

    res.json({ success: true, data: { _id: '123' } });
    expect(mockRedis.default().hSet).toHaveBeenCalled();
  });

  it('should not log failed response', async () => {
    const middleware = auditLog('user', 'create');
    const req = {
      params: { id: '123' },
      headers: { 'x-user-id': 'user1' },
      ip: '127.0.0.1'
    };
    const originalJson = jest.fn(() => ({}));
    const res = {
      json: originalJson,
    };
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();

    res.json({ success: false, message: 'Error' });
    expect(mockRedis.default().hSet).not.toHaveBeenCalled();
  });

  it('should use unknown id when no id in params or data', async () => {
    mockRedis.default().hSet.mockResolvedValue(1);
    mockRedis.default().expire.mockResolvedValue(1);

    const middleware = auditLog('user', 'create');
    const req = {
      params: {},
      headers: {},
      ip: '127.0.0.1'
    };
    const originalJson = jest.fn(() => ({}));
    const res = {
      json: originalJson,
    };
    const next = jest.fn();

    middleware(req, res, next);
    res.json({ success: true });
    expect(mockRedis.default().hSet).toHaveBeenCalled();
  });
});
