import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.USER_SERVICE,
  changeOrigin: true,

pathRewrite: (path, req) => {
  return '/api/v1/user' + path
},

    on: {
    proxyReq: (proxyReq, req, res) => {
      const target = SERVICES.USER_SERVICE
      const fullurl = target + proxyReq.path
      console.log('Forwarding to:', fullurl)
    }
  }
})