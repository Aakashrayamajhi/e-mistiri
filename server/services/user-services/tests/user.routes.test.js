import request from 'supertest';
import { app } from '../src/app.js';

jest.mock('../src/database/dbconnection.js', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../src/modules/user/user.model.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
  }
}));

jest.mock('ioredis', () => ({
  __esModule: true,
  default: {
    incr: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    hSet: jest.fn(),
    del: jest.fn(),
  }
}));

jest.mock('../src/utils/cloudinary.util.js', () => ({
  uploadImage: jest.fn(() => ({ secure_url: 'http://example.com/image.jpg' }))
}));

const mockUserModel = require('../src/modules/user/user.model.js').default;

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/user/:id', () => {
    it('should return 404 when user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/user/123')
        .set('x-user-id', '123');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });

    it('should return user when found', async () => {
      const mockUser = { _id: '123', phone: '9876543210', fullname: 'John Doe' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/v1/user/123')
        .set('x-user-id', '123');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockUser);
    });
  });

  describe('GET /api/v1/user/phone/:phone', () => {
    it('should return 404 when user not found by phone', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/user/phone/9876543210');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return user by phone', async () => {
      const mockUser = { _id: '123', phone: '9876543210', fullname: 'John Doe' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/v1/user/phone/9876543210');

      expect(res.status).toBe(200);
      expect(res.body.data.phone).toBe('9876543210');
    });
  });

  describe('PATCH /api/v1/user/:id', () => {
    it('should reject update when user id does not match', async () => {
      const res = await request(app)
        .patch('/api/v1/user/123')
        .set('x-user-id', '456')
        .send({ fullname: 'Jane Doe' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('You are not allowed to update this user');
    });

    it('should allow update when user id matches', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValue({ _id: '123', fullname: 'Jane Doe' });

      const res = await request(app)
        .patch('/api/v1/user/123')
        .set('x-user-id', '123')
        .send({ fullname: 'Jane Doe' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/user/:id', () => {
    it('should require admin role', async () => {
      const res = await request(app)
        .delete('/api/v1/user/123');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/user', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/user')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid phone length', async () => {
      const res = await request(app)
        .post('/api/v1/user')
        .send({ phone: '987654321', fullname: 'John Doe', password: 'ValidPass1!' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
