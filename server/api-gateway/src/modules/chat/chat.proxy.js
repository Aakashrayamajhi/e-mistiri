import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.CHAT_SERVICE,
  changeOrigin: true,

  pathRewrite: (path, req) => {
    return '/api/chat' + path
  },

  on: {
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