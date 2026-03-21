import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.GARAGE_AUTH_SERVICE,
  changeOrigin: true,

  pathRewrite: (path, req) => {
    return '/api/v1/garageAuth' + path
  },

  onProxyReq: (proxyReq, req, res) => {
    console.log('Forwarding to:', proxyReq.path)
    
    if (req.user) {
      console.log("USER:", req.user);
      proxyReq.setHeader("x-user-id", req.user.id);
      proxyReq.setHeader("x-user-role", req.user.role);
    }
  }
})