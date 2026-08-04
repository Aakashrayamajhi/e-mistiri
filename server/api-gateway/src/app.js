import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";

import chatRouter from './modules/chat/chat.route.js'
import userRouter from './modules/user/user.route.js'
import garageRouter from './modules/garage/garage.route.js'
import mechanicRouter from './modules/mechanic/mechanic.route.js'
import userAuthRouter from './modules/userAuth/userAuth.route.js'
import garageAuthRouter from './modules/garageAuth/garageAuth.route.js'
import mechanicAuthRouter from './modules/mechanicAuth/mechanicAuth.route.js'

import { loggerMiddleware } from './middleware/logger.middleware.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import { apilimiter } from './middleware/ratelimiter.middleware.js'
import { authMiddleware } from './middleware/auth.middleware.js'
import { sanitizeMiddleware } from './middleware/sanitize.middleware.js'
import { metricsMiddleware, metricsEndpoint } from './middleware/metrics.middleware.js'
import { rbac } from './middleware/rbac.middleware.js'
import redis from './config/redis.config.js'

const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : []

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(sanitizeMiddleware)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use(metricsMiddleware)

app.use(loggerMiddleware)
app.use(apilimiter)

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/metrics', metricsEndpoint)

app.use('/api/userAuth', userAuthRouter)
app.use('/api/garageAuth', garageAuthRouter)
app.use('/api/mechanicAuth', mechanicAuthRouter)

app.use('/api/chat', authMiddleware, rbac('user', 'garage', 'mechanic'), chatRouter)

app.use('/api/user', authMiddleware, rbac('user'), userRouter)
app.use('/api/garage', authMiddleware, rbac('garage'), garageRouter)
app.use('/api/mechanic', authMiddleware, rbac('mechanic'), mechanicRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    timestamp: new Date().toISOString()
  })
})

app.use(errorMiddleware)

export { app, rbac }
