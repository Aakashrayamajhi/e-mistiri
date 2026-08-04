import { jest } from '@jest/globals';
import { requireAdmin } from '../src/middleware/rbac.middleware.js';

describe('RBAC Middleware', () => {
  const mockReq = (headers = {}) => ({ headers });
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

  it('should allow admin role', () => {
    const req = mockReq({ 'x-user-role': 'admin' });
    const res = mockRes();

    requireAdmin(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should block non-admin role', () => {
    const req = mockReq({ 'x-user-role': 'user' });
    const res = mockRes();

    requireAdmin(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Admin access required'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should block missing role header', () => {
    const req = mockReq({});
    const res = mockRes();

    requireAdmin(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should block empty role', () => {
    const req = mockReq({ 'x-user-role': '' });
    const res = mockRes();

    requireAdmin(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
