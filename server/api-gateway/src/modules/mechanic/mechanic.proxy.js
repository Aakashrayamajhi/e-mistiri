import { createProxyMiddleware} from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.MECHANIC_SERVICE,
  changeOrigin: true,

  pathRewrite: (path) => {
    return '/api/v1/mechanic' + path
  },

  on: {
    proxyReq: (proxyReq, req, res) => {
      const target = SERVICES.MECHANIC_SERVICE
      const fullurl = target + proxyReq.path
      console.log('Forwarding to:', fullurl)

      console.log("Proxy req.user OF mechanic:", req.user);
      if (req.user && req.user.id) {
        proxyReq.setHeader('x-user-id', req.user.id)
        proxyReq.setHeader('x-user-role', req.user.role)
        
      }
    }
  }
})