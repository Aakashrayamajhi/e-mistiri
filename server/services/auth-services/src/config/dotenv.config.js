import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

const env = {
    PORT: process.env.PORT || 4002,
    JWT_SECRET: process.env.JWT_SECRET || 'justchill',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refreshsecret',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/emistiri-auth',
    NODE_ENV: process.env.NODE_ENV || 'development',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '*',
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3002/api/v1/user',
    GARAGE_SERVICE_URL: process.env.GARAGE_SERVICE_URL || 'http://localhost:3002/api/v1/garage',
    MECHANIC_SERVICE_URL: process.env.MECHANIC_SERVICE_URL || 'http://localhost:3002/api/v1/mechanic',
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE: process.env.TWILIO_PHONE
};

export { env };
