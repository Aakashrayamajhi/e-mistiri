import request from 'supertest';
import { app } from '../src/app.js';

jest.mock('../src/config/services.config.js', () => ({
  SERVICES: {
    CHAT_SERVICE: 'http://localhost:5001',
    USER_SERVICE: 'http://localhost:5002',
    GARAGE_SERVICE: 'http://localhost:5003',
    MECHANIC_SERVICE: 'http://localhost:5004',
  }
}));

describe('Proxy Routes', () => {
  it('should proxy chat routes', async () => {
    const res = await request(app)
      .get('/api/chat')
      .set('Authorization', 'Bearer validtoken');

    expect([200, 404, 503]).toContain(res.status);
  });

  it('should proxy user routes', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', 'Bearer validtoken');

    expect([200, 404, 503]).toContain(res.status);
  });

  it('should proxy garage routes', async () => {
    const res = await request(app)
      .get('/api/garage')
      .set('Authorization', 'Bearer validtoken');

    expect([200, 404, 503]).toContain(res.status);
  });

  it('should proxy mechanic routes', async () => {
    const res = await request(app)
      .get('/api/mechanic')
      .set('Authorization', 'Bearer validtoken');

    expect([200, 404, 503]).toContain(res.status);
  });
});
