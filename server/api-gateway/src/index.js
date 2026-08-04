import { app } from './app.js'
import { PORT } from './config/env.config.js'
import http from "http"
import { initSocketGateway } from './modules/chat/socket.gateway.js'
import { logger } from './utils/logger.js'

let server

const StartServer = () => {
  try {
    server = http.createServer(app)
    initSocketGateway(server)
    server.listen(PORT, "0.0.0.0", () => {
      logger.info(`API Gateway running on port: ${PORT}`, { environment: process.env.NODE_ENV || 'development' })
    })

    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)

  } catch (error) {
    logger.error('Failed to start API Gateway', { error: error.message })
    process.exit(1)
  }
}

const gracefulShutdown = () => {
  logger.info('Shutting down API Gateway gracefully...')

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed')
      process.exit(0)
    })

    setTimeout(() => {
      logger.error('Forced shutdown - connections did not close gracefully')
      process.exit(1)
    }, 10000)
  } else {
    process.exit(0)
  }
}

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: String(reason), promise: String(promise) })
  process.exit(1)
})

process.on('warning', (warning) => {
  logger.warn('Process Warning', { name: warning.name, message: warning.message, stack: warning.stack })
})

process.on('SIGUSR2', () => {
  logger.info('Received SIGUSR2 - gracefully shutting down')
  gracefulShutdown()
})

StartServer()
