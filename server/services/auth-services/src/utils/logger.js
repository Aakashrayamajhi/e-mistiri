import winston from 'winston';
import { env } from '../config/dotenv.config.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'production'
      ? format
      : winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          })
        )
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format
  }),
  new winston.transports.File({
    filename: 'logs/all.log',
    format
  })
];

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  transports,
  defaultMeta: {
    service: 'auth-service'
  }
});
