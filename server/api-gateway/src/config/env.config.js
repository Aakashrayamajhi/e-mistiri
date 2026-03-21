import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

export const PORT = process.env.PORT || 2002
export const JWT_SECRET = process.env.JWT_SECRET || 'justchill'
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emistiri'
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT || 6379