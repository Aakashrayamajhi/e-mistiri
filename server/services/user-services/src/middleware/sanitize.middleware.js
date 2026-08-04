import xss from 'xss';
import mongoSanitize from 'express-mongo-sanitize';

export const sanitizeMiddleware = () => {
  return [
    mongoSanitize({
      replaceWith: '_',
      allowDots: false
    }),
    (req, res, next) => {
      const sanitize = (obj) => {
        if (typeof obj === 'string') {
          return xss(obj);
        }
        if (Array.isArray(obj)) {
          return obj.map(sanitize);
        }
        if (obj && typeof obj === 'object') {
          const sanitized = {};
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              sanitized[key] = sanitize(obj[key]);
            }
          }
          return sanitized;
        }
        return obj;
      };

      if (req.body) req.body = sanitize(req.body);
      if (req.query) req.query = sanitize(req.query);
      if (req.params) req.params = sanitize(req.params);

      next();
    }
  ];
};
