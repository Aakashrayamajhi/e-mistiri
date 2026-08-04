import request from 'supertest';
import { app } from '../src/app.js';
import mockRedis from './__mocks__/auth-services/redis.config.js';

describe('Auth Routes Integration', () => {
  beforeEach(() => {
    Object.assign(mockRedis, {
      set: async () => 'OK',
      get: async () => null,
      del: async () => 1,
    });
  });

  describe('POST /api/v1/userAuth/signup', () => {
    it('should return 400 for invalid phone', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/signup')
        .send({ phone: '123', fullname: 'John Doe', password: 'ValidPass1!' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for weak password', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/signup')
        .send({ phone: '9876543210', fullname: 'John Doe', password: 'weak' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/signup')
        .send({ phone: '9876543210' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 200 when OTP is requested', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/signup')
        .send({ phone: '9876543210', fullname: 'John Doe', password: 'ValidPass1!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/OTP sent/);
    });
  });

  describe('POST /api/v1/userAuth/login', () => {
    it('should return 400 for missing phone', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/login')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid phone format', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/login')
        .send({ phone: '123', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing password', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/login')
        .send({ phone: '9876543210' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/userAuth/refresh-token', () => {
    it('should return 400 for missing refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/refresh-token')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for extra fields', async () => {
      const res = await request(app)
        .post('/api/v1/userAuth/refresh-token')
        .send({ refreshToken: 'token', extra: 'x' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
