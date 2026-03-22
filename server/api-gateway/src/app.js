
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import userRouter from './modules/user/user.route.js'
import garageRouter from './modules/garage/garage.route.js'
import userAuthRouter from './modules/userAuth/userAuth.route.js'
import garageAuthRouter from './modules/garageAuth/garageAuth.route.js'

import { loggerMiddleware } from './middleware/logger.middleware.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import { apilimiter } from './middleware/ratelimiter.middleware.js'
import { authMiddleware } from './middleware/auth.middleware.js'
import redis from './config/redis.config.js'


const app = express()


app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}))

redis 

app.use(loggerMiddleware)
app.use(apilimiter)

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.use('/api/userAuth',
  userAuthRouter
)

app.use('/api/garageAuth',
  garageAuthRouter
)

app.use('/api/user', authMiddleware, userRouter)
app.use('/api/garage', authMiddleware, garageRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    timestamp: new Date().toISOString()
  })
})

app.use(errorMiddleware)

export { app }