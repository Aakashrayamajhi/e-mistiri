import mongoose from "mongoose"
import { env } from "../config/dotenv.config.js"

const dbConnection = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error('MONGO_URI is not configured')
    }
    
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2
    })
    
    console.log("Database connected successfully")
    
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error.message)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })
    
    return mongoose.connection
  } catch (error) {
    console.error('Failed to connect to database:', error.message)
    process.exit(1)
  }
}

export default dbConnection