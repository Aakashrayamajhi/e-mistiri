import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true
})

export const createRateLimiter = (limit, windowMs) => {
  const windowSec = Math.floor(windowMs / 1000)

  return async (req, res, next) => {
    try {
      const ip = req.ip || req.socket?.remoteAddress || 'unknown'
      const key = `ratelimit:${ip}:${req.method}:${req.path}`

      const current = await redis.incr(key)

      if (current === 1) {
        await redis.expire(key, windowSec)
      }

      const ttl = await redis.ttl(key)
      res.setHeader('Retry-After', String(Math.max(ttl, 1)))

      if (current > limit) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: ttl
        })
      }

      res.setHeader('X-RateLimit-Limit', String(limit))
      res.setHeader('X-RateLimit-Remaining', String(Math.max(limit - current, 0)))

      next()
    } catch (error) {
      console.error('Rate limiter error:', error)
      next()
    }
  }
}

const PUBLIC_PATHS = ['/api/userAuth', '/api/garageAuth', '/api/mechanicAuth', '/health', '/api/docs']
const AUTH_PATHS = ['/api/chat', '/api/user', '/api/garage', '/api/mechanic']

const isPublicPath = (path) => PUBLIC_PATHS.some((prefix) => path === prefix || path.startsWith(prefix + '/'))
const isAuthPath = (path) => AUTH_PATHS.some((prefix) => path === prefix || path.startsWith(prefix + '/'))

const publicLimiter = createRateLimiter(20, 60_000)
const authLimiter = createRateLimiter(5, 60_000)

export const apilimiter = async (req, res, next) => {
  const path = req.path

  if (isAuthPath(path)) {
    return authLimiter(req, res, next)
  }

  if (isPublicPath(path)) {
    return publicLimiter(req, res, next)
  }

  return publicLimiter(req, res, next)
}
