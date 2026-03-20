import redis from "../config/redis.config.js"

const limit = 10;
const window = 60;

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip
    const key = `rate_limit:${ip}`

    const requestCount = await redis.incr(key)

    if (requestCount === 1) {
      await redis.expire(key, window)
    }

    if (requestCount > limit) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try later",
      })
    }

    next()

  } catch (error) {
    console.log("Error in rate limiting:", error)
    next()
  }
}

export default rateLimiter