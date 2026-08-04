import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss'

export const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

const sanitizeObject = (obj) => {
  const result = {}
  for (const key of Object.keys(obj)) {
    const cleanKey = xss(key)
    const value = obj[key]
    if (Array.isArray(value)) {
      result[cleanKey] = value.map((item) =>
        typeof item === 'string' ? xss(item) : typeof item === 'object' && item !== null ? sanitizeObject(item) : item
      )
    } else if (value !== null && typeof value === 'object') {
      result[cleanKey] = sanitizeObject(value)
    } else if (typeof value === 'string') {
      result[cleanKey] = xss(value)
    } else {
      result[cleanKey] = value
    }
  }
  return result
}
