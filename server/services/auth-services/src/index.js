import { app } from './app.js'
import { env } from './config/dotenv.config.js'

const PORT = env.PORT

let server

const StartServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`Auth service running at port: ${PORT}`)
    })
    
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

const gracefulShutdown = () => {
  console.log('\nShutting down gracefully...')
  
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