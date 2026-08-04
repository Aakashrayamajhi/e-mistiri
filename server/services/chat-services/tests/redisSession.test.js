import { saveUserSession, getUserSession, removeUserSession } from '../src/utils/redisSession.js';

jest.mock('ioredis', () => {
  const mockSet = jest.fn();
  const mockGet = jest.fn();
  const mockDel = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      set: mockSet,
      get: mockGet,
      del: mockDel,
    }))
  };
});

describe('Redis Session', () => {
  let mockRedis;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedis = await import('ioredis');
  });

  describe('saveUserSession', () => {
    it('should save user session with 24h expiry', async () => {
      mockRedis.default().set.mockResolvedValue('OK');

      await saveUserSession('user123', 'socketId456');
      expect(mockRedis.default().set).toHaveBeenCalledWith(
        'user:socket:user123',
        'socketId456',
        'EX',
        86400
      );
    });
  });

  describe('getUserSession', () => {
    it('should return socket id when session exists', async () => {
      mockRedis.default().get.mockResolvedValue('socketId456');

      const result = await getUserSession('user123');
      expect(result).toBe('socketId456');
    });

    it('should return null when session does not exist', async () => {
      mockRedis.default().get.mockResolvedValue(null);

      const result = await getUserSession('user123');
      expect(result).toBeNull();
    });
  });

  describe('removeUserSession', () => {
    it('should remove user session', async () => {
      mockRedis.default().del.mockResolvedValue(1);

      await removeUserSession('user123');
      expect(mockRedis.default().del).toHaveBeenCalledWith('user:socket:user123');
    });
  });
});
