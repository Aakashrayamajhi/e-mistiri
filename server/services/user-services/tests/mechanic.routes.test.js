import request from 'supertest';
import { app } from '../src/app.js';

jest.mock('../src/database/dbconnection.js', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../src/modules/mechanic/mechanic.model.js', () => ({
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

const mockMechanicModel = require('../src/modules/mechanic/mechanic.model.js').default;

describe('Mechanic Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/mechanic', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/mechanic')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid phone length', async () => {
      const res = await request(app)
        .post('/api/v1/mechanic')
        .send({ phone: '987654321', fullname: 'John Doe', password: 'ValidPass1!' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/v1/mechanic')
        .send({ phone: '9876543210', fullname: 'John Doe', password: 'weak' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/mechanic/:id', () => {
    it('should return 404 when mechanic not found', async () => {
      mockMechanicModel.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/mechanic/123');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Mechanic not found');
    });

    it('should return mechanic when found', async () => {
      const mockMechanic = { _id: '123', phone: '9876543210', fullname: 'John Doe' };
      mockMechanicModel.findById.mockResolvedValue(mockMechanic);

      const res = await request(app)
        .get('/api/v1/mechanic/123');

      expect(res.status).toBe(200);
      expect(res.body.data.fullname).toBe('John Doe');
    });
  });

  describe('GET /api/v1/mechanic/phone/:phone', () => {
    it('should return 404 when mechanic not found', async () => {
      mockMechanicModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/mechanic/phone/9876543210');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Mechanic not found');
    });
  });

  describe('PATCH /api/v1/mechanic/update/:id', () => {
    it('should update mechanic', async () => {
      mockMechanicModel.findByIdAndUpdate.mockResolvedValue({ _id: '123', fullname: 'Jane Doe' });

      const res = await request(app)
        .patch('/api/v1/mechanic/update/123')
        .send({ fullname: 'Jane Doe' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/mechanic/:id', () => {
    it('should require admin role', async () => {
      const res = await request(app)
        .delete('/api/v1/mechanic/123');

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/mechanic/:id/approve', () => {
    it('should require admin role', async () => {
      const res = await request(app)
        .patch('/api/v1/mechanic/123/approve');

      expect(res.status).toBe(403);
    });
  });
});
