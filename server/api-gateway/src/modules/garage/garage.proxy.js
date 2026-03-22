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
    }
  }
})