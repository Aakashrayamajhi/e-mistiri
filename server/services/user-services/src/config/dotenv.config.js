import dotenv from 'dotenv'
import path from  "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.join(__dirname, "../../.env")
})

const env = {
    PORT : process.env.PORT || 3002,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/emistiri-users',
    NODE_ENV: process.env.NODE_ENV || 'development',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}

export {env}
