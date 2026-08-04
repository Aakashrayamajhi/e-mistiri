import client from 'prom-client'
import { logger } from './logger.js'

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
})

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

export const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP error responses',
  labelNames: ['method', 'route', 'status_code']
})

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    const route = req.route?.path || req.path

    httpRequestDuration.observe({ method: req.method, route, status_code: res.statusCode }, duration)
    httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode })

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({ method: req.method, route, status_code: res.statusCode })
    }
  })

  next()
}

export const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType)
    res.end(await client.register.metrics())
  } catch (error) {
    logger.error('Metrics endpoint error', { error: error.message })
    res.status(500).json({ success: false, message: 'Failed to collect metrics' })
  }
}

export { client }
