import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app.js';
import jwt from 'jsonwebtoken';

jest.mock('../src/config/env.config.js', () => ({
  JWT_SECRET: 'test-secret',
}));

describe('Auth Middleware', () => {
  it('should allow request with valid token', async () => {
    const token = jwt.sign({ id: 'user123', role: 'user' }, 'test-secret', { expiresIn: '15m' });
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
    const token = jwt.sign({ id: 'user123', role: 'user' }, 'test-secret', { expiresIn: '-1s' });
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
    expect(res.body.message).toMatch(/Invalid token/);
  });

  it('should reject request with token missing user id', async () => {
    const token = jwt.sign({ role: 'user' }, 'test-secret', { expiresIn: '15m' });
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
