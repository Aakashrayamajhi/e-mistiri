import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'
import { logger } from '../../utils/logger.js'

export default createProxyMiddleware({
  target: SERVICES.CHAT_SERVICE,
  changeOrigin: true,
  timeout: 10000,

  pathRewrite: (path, req) => {
    return '/api/chat' + path
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
      const target = SERVICES.CHAT_SERVICE
      const fullurl = target + proxyReq.path
      console.log('Forwarding to:', fullurl)

      console.log("Proxy req.user:", req.user);
      if (req.user && req.user.id) {
        proxyReq.setHeader('x-user-id', req.user.id)
        proxyReq.setHeader('x-user-role', req.user.role)
        
      }
    }
  }
})