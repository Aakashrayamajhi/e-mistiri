import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import userRouter from './modules/user/user.route.js'
import garageRouter from './modules/garage/garage.route.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import { logger } from './utils/logger.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`)
  })
  next()
})

app.get('/health', (req, res) => {
  res.json({ status: 'User Service OK', timestamp: new Date().toISOString() })
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/garage', garageRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  })
})

app.use(errorMiddleware)

export { app }
