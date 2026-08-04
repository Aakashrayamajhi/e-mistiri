import winston from 'winston'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { LOG_LEVEL } from '../config/env.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDir = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
})

const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ allButObjects: true }),
  winston.format.printf(({ level, message, timestamp, service, requestId, ...meta }) => {
    const logEntry = {
      service: 'api-gateway',
      level,
      message,
      timestamp,
      ...(requestId && { requestId }),
      ...(Object.keys(meta).length > 0 && { meta })
    }
    return JSON.stringify(logEntry)
  })
)

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : ''
    return `${timestamp} [${level}]: ${message} ${metaString}`
  })
)

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  levels,
  format: jsonFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(jsonFormat, winston.format.colorize({ all: true }))
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: jsonFormat
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'all.log'),
      format: jsonFormat
    })
  ]
})
