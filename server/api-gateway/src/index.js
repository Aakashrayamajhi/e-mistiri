import { app } from './app.js'
import { PORT } from './config/env.config.js'

let server

const StartServer = () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`API Gateway running on port: ${PORT}`)
    })
    
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    
  } catch (error) {
    console.error('Failed to start API Gateway:', error.message)
    process.exit(1)
  }
}

const gracefulShutdown = () => {
  console.log('\nShutting down API Gateway gracefully...')
  
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
      process.exit(0)
    })
    
    setTimeout(() => {
      console.error('Forced shutdown - connections did not close gracefully')
      process.exit(1)
    }, 10000)
  } else {
    process.exit(0)
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

StartServer()