import { createProxyMiddleware} from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.GARAGE_SERVICE,
  changeOrigin: true,
  logLevel: 'debug',

  pathRewrite: (path) => {
    return '/api/v1/garage' + path
  },

  onProxyReq: (proxyReq, req, res) => {
    console.log(" PROXY HIT");
    console.log("Forwarding to:", proxyReq.path);
  },

  onProxyRes: (proxyRes, req, res) => {
    console.log(" RESPONSE RECEIVED");
  },

  onError: (err, req, res) => {
    console.error(" Proxy error:", err.message);
    res.status(500).json({
      success: false,
      message: "Proxy failed",
      error: err.message
    });
  }
})