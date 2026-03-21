import winston from 'winston'
import fs from 'fs'
import path from 'path'

const logDir = 'logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
}

winston.addColors(colors)

// Base format (NO color here)
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? JSON.stringify(meta)
      : ''

    return `${timestamp} [${level.toUpperCase()}] API-GATEWAY: ${message} ${metaString}`
  })
)

export const logger = winston.createLogger({
  level: 'debug',
  levels,
  transports: [
    // ✅ Console (color LAST)
    new winston.transports.Console({
      format: winston.format.combine(
        baseFormat,
        winston.format.colorize({ all: true })
      )
    }),

    // ✅ Error file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: baseFormat
    }),

    // ✅ All logs file
    new winston.transports.File({
      filename: path.join(logDir, 'all.log'),
      format: baseFormat
    })
  ]
})