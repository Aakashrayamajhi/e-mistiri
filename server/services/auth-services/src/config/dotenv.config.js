import dotenv from 'dotenv'
import path from  "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.join(__dirname, "../../.env")
})

const env = {
    PORT : process.env.PORT || 4002,
    JWT_SECRET: process.env.JWT_SECRET || 'justchill',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/emistiri-auth',
    NODE_ENV: process.env.NODE_ENV || 'development',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379
}

export {env}