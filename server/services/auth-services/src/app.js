import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import userAuthRouter from './modules/userAuth/userAuth.router.js'
import garageAuthRouter from './modules/garageAuth/garageAuth.route.js'
import mechanicAuthRouter from './modules/mechanicAuth/mechanicAuth.route.js'
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
  res.json({ status: 'Auth Service OK', timestamp: new Date().toISOString() })
})

app.use('/api/v1/userAuth', userAuthRouter)
app.use('/api/v1/garageAuth', garageAuthRouter)
app.use('/api/v1/mechanicAuth', mechanicAuthRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  })
})

app.use(errorMiddleware)

export { app }
