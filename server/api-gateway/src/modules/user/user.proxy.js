import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.USER_SERVICE,
  changeOrigin: true,

  pathRewrite: (path, req) => {
    return '/api/v1/user' + path
  },

  onProxyReq: (proxyReq, req, res) => {
    console.log('Forwarding to:', proxyReq.path)
  }
})