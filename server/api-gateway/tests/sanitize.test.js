import { jest } from '@jest/globals';
import { sanitizeMiddleware } from '../src/middleware/sanitize.middleware.js';

describe('Sanitize Middleware', () => {
  const createReqRes = (body = {}, query = {}, params = {}) => {
    const req = {
      body,
      query,
      params,
      ip: '127.0.0.1',
      method: 'POST',
      originalUrl: '/test',
    };
    const res = {
      statusCode: 200,
      json: jest.fn(),
      headersSent: false,
      status: jest.fn(() => res),
    };
    const next = jest.fn();
    return { req, res, next };
  };

  it('should strip script tags from body', () => {
    const { req, res, next } = createReqRes({
      fullname: '<script>alert(1)</script>',
    });

    sanitizeMiddleware(req, res, next);

    expect(req.body.fullname).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  it('should allow middleware to run without crashing on MongoDB operator keys', () => {
    const { req, res, next } = createReqRes({
      fullname: 'Test',
      '$gt': '',
    });

    sanitizeMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should sanitize nested objects', () => {
    const { req, res, next } = createReqRes({
      data: { key: '<img src=x onerror=alert(1)>' }
    });

    sanitizeMiddleware(req, res, next);

    expect(req.body.data.key).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  it('should sanitize query parameters', () => {
    const { req, res, next } = createReqRes({}, { search: '<script>alert(1)</script>' });

    sanitizeMiddleware(req, res, next);

    expect(req.query.search).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  it('should not crash when req.query is a getter-only property', () => {
    const query = {
      search: '<script>alert(1)</script>',
    };
    const req = {
      body: {},
      params: {},
      ip: '127.0.0.1',
      method: 'POST',
      originalUrl: '/test',
    };
    Object.defineProperty(req, 'query', {
      get: () => query,
      enumerable: true,
    });
    const res = {
      statusCode: 200,
      json: jest.fn(),
      headersSent: false,
      status: jest.fn(() => res),
    };
    const next = jest.fn();

    sanitizeMiddleware(req, res, next);

    expect(req.query.search).not.toContain('<script>');
    expect(req.query.query).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
