import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app.js';

jest.mock('../src/config/redis.config.js', () => ({
  __esModule: true,
  default: {
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    pexpire: jest.fn(),
    pttl: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    quit: jest.fn(),
  }
}));

jest.mock('../src/config/services.config.js', () => ({
  __esModule: true,
  SERVICES: {
    CHAT_SERVICE: 'http://localhost:5001',
    USER_SERVICE: 'http://localhost:5002',
    GARAGE_SERVICE: 'http://localhost:5003',
    MECHANIC_SERVICE: 'http://localhost:5004',
  }
}));

describe('Health Endpoint', () => {
  it('should return 200 with status message', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('API Gateway is running');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.environment).toBeDefined();
  });
});

describe('Metrics Endpoint', () => {
  it('should return metrics data', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text/);
  });
});
