import { app } from "./app.js"
import { env } from "./config/dotenv.config.js"
import dbConnection from "./database/dbconnection.js"

const PORT = env.PORT

let server

const StartServer = async () => {
  try {
    await dbConnection()
    
    server = app.listen(PORT, () => {
      console.log(`User service running at port: ${PORT}`)
    })
    
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...')
  
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed')
      try {
        const mongoose = (await import('mongoose')).default
        await mongoose.connection.close()
        console.log('Database connection closed')
      } catch (error) {
        console.error('Error closing database:', error.message)
      }
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