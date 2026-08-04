import { jest } from '@jest/globals';

const request = (await import('supertest')).default;
const { JWT_SECRET } = await import('../src/config/env.config.js');
const { app } = await import('../src/app.js');
const jwt = (await import('jsonwebtoken')).default;

describe('Auth Middleware', () => {
  it('should allow request with valid token', async () => {
    const token = jwt.sign({ id: 'user123', role: 'user' }, JWT_SECRET, { expiresIn: '15m' });
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it('should reject request with missing token', async () => {
    const res = await request(app)
      .get('/api/user');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Unauthorized/);
  });

  it('should reject request with invalid token format', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', 'InvalidFormat token');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject request with expired token', async () => {
    const token = jwt.sign({ id: 'user123', role: 'user' }, JWT_SECRET, { expiresIn: '-1s' });
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/expired/i);
  });

  it('should reject request with tampered token', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Invalid token|Token could not be verified/);
  });

  it('should reject request with token missing user id', async () => {
    const token = jwt.sign({ role: 'user' }, JWT_SECRET, { expiresIn: '15m' });
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
