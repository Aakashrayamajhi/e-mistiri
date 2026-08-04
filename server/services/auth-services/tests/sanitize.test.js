import { sanitize } from '../src/middleware/sanitize.middleware.js';

describe('Sanitize Middleware', () => {
  const middleware = sanitize;
  const req = { body: {}, query: {}, params: {} };
  const res = {};
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  beforeEach(() => {
    nextCalled = false;
    req.body = {};
    req.query = {};
    req.params = {};
  });

  it('should sanitize XSS in body strings', () => {
    req.body = { name: '<script>alert(1)</script>' };
    middleware(req, res, next);
    expect(req.body.name).not.toContain('<script>');
    expect(nextCalled).toBe(true);
  });

  it('should sanitize nested objects', () => {
    req.body = { user: { name: '<script>alert(1)</script>' } };
    middleware(req, res, next);
    expect(req.body.user.name).not.toContain('<script>');
    expect(nextCalled).toBe(true);
  });

  it('should sanitize arrays', () => {
    req.body = { tags: ['<script>1</script>', '<b>bold</b>'] };
    middleware(req, res, next);
    expect(req.body.tags[0]).not.toContain('<script>');
    expect(nextCalled).toBe(true);
  });

  it('should sanitize query parameters', () => {
    req.query = { search: '<script>alert(1)</script>' };
    middleware(req, res, next);
    expect(req.query.search).not.toContain('<script>');
    expect(nextCalled).toBe(true);
  });

  it('should sanitize params', () => {
    req.params = { id: '<script>alert(1)</script>' };
    middleware(req, res, next);
    expect(req.params.id).not.toContain('<script>');
    expect(nextCalled).toBe(true);
  });

  it('should leave non-string values unchanged', () => {
    req.body = { count: 42, active: true, nested: { val: 123 } };
    middleware(req, res, next);
    expect(req.body.count).toBe(42);
    expect(req.body.active).toBe(true);
    expect(nextCalled).toBe(true);
  });
});
