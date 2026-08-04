import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import userRouter from './modules/user/user.route.js'
import garageRouter from './modules/garage/garage.route.js'
import mechanicRouter from './modules/mechanic/mechanic.route.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import { sanitizeMiddleware } from './middleware/sanitize.middleware.js'
import { publicReadLimiter, writeLimiter, adminActionLimiter } from './middleware/rateLimiter.middleware.js'
import { idempotencyMiddleware } from './middleware/idempotency.middleware.js'
import { requestLogger } from './utils/logger.js'
import { metricsMiddleware } from './middleware/metrics.middleware.js'

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}))

app.use(sanitizeMiddleware)

app.use(express.json({ limit: '10kb' }))

app.use(requestLogger)
app.use(metricsMiddleware)

app.use(publicReadLimiter)
app.use(writeLimiter)
app.use(adminActionLimiter)

app.use(idempotencyMiddleware)

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'User Service OK', timestamp: new Date().toISOString() })
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/garage', garageRouter)
app.use('/api/v1/mechanic', mechanicRouter )

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  })
})

app.use(errorMiddleware)

export { app }
