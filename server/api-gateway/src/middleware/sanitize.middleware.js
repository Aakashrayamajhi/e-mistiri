import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss'

export const sanitizeMiddleware = (req, res, next) => {
  try {
    mongoSanitize()(req, res, () => {})
  } catch {
    // express-mongo-sanitize v2.x may throw on read-only Express 5 req properties;
    // fall through to the custom sanitizer below.
  }

  sanitizeAndAssign(req, 'body')
  sanitizeAndAssign(req, 'query')
  sanitizeAndAssign(req, 'params')
  next()
}

const getPropertyDescriptor = (obj, key) => {
  let current = obj
  while (current) {
    const descriptor = Object.getOwnPropertyDescriptor(current, key)
    if (descriptor) {
      return descriptor
    }
    current = Object.getPrototypeOf(current)
  }
  return undefined
}

const sanitizeAndAssign = (req, key) => {
  const value = req[key]
  if (value && typeof value === 'object') {
    const sanitized = sanitizeObject(value)
    const descriptor = getPropertyDescriptor(req, key)
    const canReassign = !descriptor || descriptor.writable === true || typeof descriptor.set === 'function'

    if (canReassign) {
      try {
        req[key] = sanitized
        return
      } catch {}
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < sanitized.length; i += 1) {
        if (Object.prototype.hasOwnProperty.call(value, i)) {
          try {
            value[i] = sanitized[i]
          } catch {}
        }
      }
      return
    }

    Object.keys(sanitized).forEach((k) => {
      const propDesc = Object.getOwnPropertyDescriptor(value, k)
      if (!propDesc || propDesc.writable === true || typeof propDesc.set === 'function') {
        try {
          value[k] = sanitized[k]
        } catch {}
      } else if (propDesc.configurable) {
        Object.defineProperty(value, k, {
          value: sanitized[k],
          writable: true,
          enumerable: propDesc.enumerable,
          configurable: true,
        })
      }
    })
  }
}

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? xss(obj) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  const sanitized = {}
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (typeof value === 'string') {
      sanitized[key] = xss(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}
