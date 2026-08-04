import request from 'supertest';
import app from '../src/app.js';

jest.mock('../src/database/connection.js', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('Chat Service App', () => {
  it('should return 200 on health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should return metrics data', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('requestCount');
    expect(res.body).toHaveProperty('errorCount');
    expect(res.body).toHaveProperty('avgLatency');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should track request count on metrics', async () => {
    const res1 = await request(app).get('/health');
    expect(res1.status).toBe(200);

    const res2 = await request(app).get('/metrics');
    expect(res2.status).toBe(200);
    expect(res2.body.requestCount).toBeGreaterThanOrEqual(2);
  });
});
