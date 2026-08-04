import { validate } from '../src/middleware/validation.middleware.js';
import { z } from 'zod';

const mockSchema = z.object({
  phone: z.string().length(10),
  fullname: z.string().min(3).max(50)
});

describe('Validation Middleware', () => {
  const mockReq = (data = {}) => ({ body: data, params: data, query: data });
  const mockRes = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res;
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate body and call next', () => {
    const middleware = validate(mockSchema, 'body');
    const req = mockReq({ phone: '9876543210', fullname: 'John' });
    const res = mockRes();

    middleware(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.validatedBody).toEqual({ phone: '9876543210', fullname: 'John' });
  });

  it('should validate params and call next', () => {
    const middleware = validate(mockSchema, 'params');
    const req = mockReq({ phone: '9876543210', fullname: 'John' });
    const res = mockRes();

    middleware(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.validatedParams).toEqual({ phone: '9876543210', fullname: 'John' });
  });

  it('should validate query and call next', () => {
    const middleware = validate(mockSchema, 'query');
    const req = mockReq({ phone: '9876543210', fullname: 'John' });
    const res = mockRes();

    middleware(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.validatedQuery).toEqual({ phone: '9876543210', fullname: 'John' });
  });

  it('should return 400 with errors on invalid input', () => {
    const middleware = validate(mockSchema, 'body');
    const req = mockReq({ phone: 'invalid' });
    const res = mockRes();

    middleware(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: expect.any(Object)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
