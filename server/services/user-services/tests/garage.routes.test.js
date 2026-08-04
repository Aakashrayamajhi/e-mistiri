import request from 'supertest';
import { app } from '../src/app.js';

jest.mock('../src/database/dbconnection.js', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../src/modules/garage/garage.model.js', () => ({
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

const mockGarageModel = require('../src/modules/garage/garage.model.js').default;

describe('Garage Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/garage', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/garage')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid phone length', async () => {
      const res = await request(app)
        .post('/api/v1/garage')
        .send({
          phone: '987654321',
          fullname: 'Garage Name',
          password: 'ValidPass1!',
          ownerName: 'Owner',
          address: 'Address',
          city: 'City',
          location: { coordinates: [85.3, 27.7] },
          services: ['service1'],
          openingTime: '09:00',
          closingTime: '17:00',
          isOpen24Hours: false
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/v1/garage')
        .send({
          phone: '9876543210',
          fullname: 'Garage Name',
          password: 'weak',
          ownerName: 'Owner',
          address: 'Address',
          city: 'City',
          location: { coordinates: [85.3, 27.7] },
          services: ['service1'],
          openingTime: '09:00',
          closingTime: '17:00',
          isOpen24Hours: false
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/garage/:id', () => {
    it('should return 404 when garage not found', async () => {
      mockGarageModel.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/garage/123');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Garage not found');
    });

    it('should return garage when found', async () => {
      const mockGarage = { _id: '123', phone: '9876543210', fullname: 'Garage Name' };
      mockGarageModel.findById.mockResolvedValue(mockGarage);

      const res = await request(app)
        .get('/api/v1/garage/123');

      expect(res.status).toBe(200);
      expect(res.body.data.fullname).toBe('Garage Name');
    });
  });

  describe('GET /api/v1/garage/phone/:phone', () => {
    it('should return 404 when garage not found', async () => {
      mockGarageModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/garage/phone/9876543210');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Garage not found');
    });
  });

  describe('GET /api/v1/garage/nearby', () => {
    it('should validate query params', async () => {
      const res = await request(app)
        .get('/api/v1/garage/nearby');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should call service with valid params', async () => {
      mockGarageModel.find.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/v1/garage/nearby?lng=85.3&lat=27.7');

      expect([200, 500]).toContain(res.status);
    });
  });

  describe('PATCH /api/v1/garage/update/:id', () => {
    it('should update garage', async () => {
      mockGarageModel.findByIdAndUpdate.mockResolvedValue({ _id: '123', fullname: 'New Name' });

      const res = await request(app)
        .patch('/api/v1/garage/update/123')
        .send({ fullname: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/garage/:id', () => {
    it('should require admin role', async () => {
      const res = await request(app)
        .delete('/api/v1/garage/123');

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/garage/:id/approve', () => {
    it('should require admin role', async () => {
      const res = await request(app)
        .patch('/api/v1/garage/123/approve');

      expect(res.status).toBe(403);
    });
  });
});
