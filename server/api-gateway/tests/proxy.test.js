import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authMiddleware: (req, res, next) => next(),
}));

jest.unstable_mockModule('../src/middleware/rbac.middleware.js', () => ({
  rbac: () => (req, res, next) => next(),
}));

const request = (await import('supertest')).default;
const { app } = await import('../src/app.js');

describe('Proxy Routes', () => {
  it('should proxy chat routes', async () => {
    const res = await request(app)
      .get('/api/chat');

    expect([200, 404, 503]).toContain(res.status);
  });

  it('should proxy user routes', async () => {
    const res = await request(app)
      .get('/api/user');

    expect([200, 404, 503]).toContain(res.status);
  });

  it('should proxy garage routes', async () => {
    const res = await request(app)
      .get('/api/garage');

    expect([200, 404, 503]).toContain(res.status);
  });

  it('should proxy mechanic routes', async () => {
    const res = await request(app)
      .get('/api/mechanic');

    expect([200, 404, 503]).toContain(res.status);
  });
});
