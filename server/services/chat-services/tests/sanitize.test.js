import { sanitizeMiddleware } from '../src/middleware/sanitize.middleware.js';
import xss from 'xss';

jest.mock('xss', () => jest.fn((str) => typeof str === 'string' ? str.replace(/<script>/gi, '') : str));

describe('Sanitize Middleware', () => {
  const middleware = sanitizeMiddleware;
  const req = { body: {} };
  const res = { };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    req.body = {};
  });

  it('should sanitize XSS in body', () => {
    req.body = { msg: '<script>alert(1)</script>' };
    middleware(req, res, next);
    expect(req.body.msg).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  it('should sanitize nested objects', () => {
    req.body = { data: { content: '<img src=x onerror=alert(1)>' } };
    middleware(req, res, next);
    expect(req.body.data.content).not.toContain('<img');
    expect(next).toHaveBeenCalled();
  });

  it('should sanitize arrays', () => {
    req.body = { tags: ['<script>1</script>', '<b>bold</b>'] };
    middleware(req, res, next);
    expect(req.body.tags[0]).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  it('should leave non-string values unchanged', () => {
    req.body = { count: 42, active: true, nested: { val: 123 } };
    middleware(req, res, next);
    expect(req.body.count).toBe(42);
    expect(req.body.active).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  it('should handle MongoDB injection patterns', () => {
    req.body = { msg: '{$gt: ""}' };
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
