import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'
import { logger } from '../../utils/logger.js'

export default createProxyMiddleware({
  target: SERVICES.USER_AUTH_SERVICE,
  changeOrigin: true,
  timeout: 10000,

 pathRewrite: (path, req) => {
  return '/api/v1/userAuth' + path
},


  on: {
    error: (err, req, res) => {
      logger.error('Proxy error', { error: err.message, path: req.path })
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable',
          timestamp: new Date().toISOString()
        })
      }
    },
    proxyReq: (proxyReq, req, res) => {
      const target = SERVICES.USER_AUTH_SERVICE
      const fullurl = target + proxyReq.path
      console.log('Forwarding to:', fullurl)
    }
  }
})