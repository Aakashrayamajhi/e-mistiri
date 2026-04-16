import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.MECHANIC_AUTH_SERVICE,
  changeOrigin: true,

  pathRewrite: (path, req) => {
    return '/api/v1/mechanicAuth' + path
  },

  on: {
    proxyReq: (proxyReq, req, res) => {
      const target = SERVICES.MECHANIC_AUTH_SERVICE
      const fullurl = target + proxyReq.path
      console.log('Forwarding to:', fullurl)
    }
  }
})