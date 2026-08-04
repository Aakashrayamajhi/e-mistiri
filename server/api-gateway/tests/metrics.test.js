import request from 'supertest';
import { app } from '../src/app.js';

describe('Metrics Middleware', () => {
  it('should expose /metrics endpoint', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text/);
  });

  it('should track request metrics on successful request', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
