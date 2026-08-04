import { checkMessageRateLimit, checkEventRateLimit } from '../src/middleware/rateLimiter.middleware.js';

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

describe('Rate Limiter', () => {
  let mockRedis;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedis = await import('ioredis');
  });

  describe('checkMessageRateLimit', () => {
    it('should allow message within limit', async () => {
      mockRedis.default().incr.mockResolvedValue(1);
      mockRedis.default().expire.mockResolvedValue(1);

      const result = await checkMessageRateLimit('user123');
      expect(result).toBe(true);
    });

    it('should block message exceeding limit', async () => {
      mockRedis.default().incr.mockResolvedValue(31);

      const result = await checkMessageRateLimit('user123');
      expect(result).toBe(false);
    });

    it('should allow message within limit on second request', async () => {
      mockRedis.default().incr.mockResolvedValue(5);
      mockRedis.default().expire.mockResolvedValue(1);

      const result = await checkMessageRateLimit('user123');
      expect(result).toBe(true);
    });
  });

  describe('checkEventRateLimit', () => {
    it('should allow event within limit', async () => {
      mockRedis.default().incr.mockResolvedValue(1);
      mockRedis.default().expire.mockResolvedValue(1);

      const result = await checkEventRateLimit('user123');
      expect(result).toBe(true);
    });

    it('should block event exceeding limit', async () => {
      mockRedis.default().incr.mockResolvedValue(101);

      const result = await checkEventRateLimit('user123');
      expect(result).toBe(false);
    });
  });
});
