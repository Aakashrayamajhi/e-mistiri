import request from 'supertest';
import { app } from '../src/app.js';

describe('Sanitize Middleware', () => {
  it('should sanitize XSS in body', async () => {
    const res = await request(app)
      .post('/api/userAuth/signup')
      .send({ phone: '9876543210', fullname: '<script>alert(1)</script>', password: 'ValidPass1!' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should sanitize MongoDB injection in body', async () => {
    const res = await request(app)
      .post('/api/userAuth/signup')
      .send({ phone: '9876543210', fullname: '{$gt: ""}', password: 'ValidPass1!' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should sanitize nested objects', async () => {
    const res = await request(app)
      .post('/api/userAuth/signup')
      .send({
        phone: '9876543210',
        fullname: 'Test',
        password: 'ValidPass1!',
        nested: { key: '<img src=x onerror=alert(1)>' }
      });

    expect(res.status).toBe(400);
  });

  it('should sanitize query parameters', async () => {
    const res = await request(app)
      .get('/api/user?search=<script>alert(1)</script>');

    expect(res.status).toBe(404);
  });
});
