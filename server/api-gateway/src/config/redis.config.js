import Redis from "ioredis"
import { REDIS_HOST, REDIS_PORT } from "./env.config.js"

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true
})

redis.on('connect', () => {
  console.log('Redis connected')
})

redis.on('error', (error) => {
  console.error('Redis connection error:', error.message)
})

redis.on('reconnecting', () => {
  console.warn('Redis reconnecting...')
})

export default redis