import { createProxyMiddleware} from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.GARAGE_SERVICE,
  changeOrigin: true,

  pathRewrite: (path) => {
    return '/api/v1/garage' + path
  },

  on: {
    proxyReq: (proxyReq, req, res) => {
      const target = SERVICES.GARAGE_SERVICE
      const fullurl = target + proxyReq.path
      console.log('Forwarding to:', fullurl)

      console.log("Proxy req.user OF GARAGE:", req.user);
      if (req.user && req.user.id) {
        proxyReq.setHeader('x-user-id', req.user.id)
        proxyReq.setHeader('x-user-role', req.user.role)
        
      }
    }
  }
})