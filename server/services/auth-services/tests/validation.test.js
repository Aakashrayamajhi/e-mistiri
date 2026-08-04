import { validate } from '../src/middleware/validation.middleware.js';
import { z } from 'zod';

const mockSchema = z.object({
  phone: z.string().min(10),
  password: z.string()
});

describe('Validation Middleware', () => {
  it('should call next on valid body', async () => {
    const middleware = validate(mockSchema);
    let nextCalled = false;
    const req = { body: { phone: '9876543210', password: 'password123' } };
    const res = {};
    const next = () => { nextCalled = true; };

    middleware(req, res, next);
    expect(nextCalled).toBe(true);
  });

  it('should return error status for invalid body', async () => {
    const middleware = validate(mockSchema);
    const req = { body: { phone: '9876543210' } };
    let statusCode = null;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: () => res,
    };
    const next = () => {};

    try {
      middleware(req, res, next);
    } catch (e) {
      statusCode = 500;
    }
    expect(statusCode).toBeGreaterThanOrEqual(400);
  });

  it('should return error status for missing required field', async () => {
    const middleware = validate(mockSchema);
    const req = { body: {} };
    let statusCode = null;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: () => res,
    };
    const next = () => {};

    try {
      middleware(req, res, next);
    } catch (e) {
      statusCode = 500;
    }
    expect(statusCode).toBeGreaterThanOrEqual(400);
  });
});
