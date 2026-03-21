import { createProxyMiddleware } from 'http-proxy-middleware'
import { SERVICES } from '../../config/services.config.js'

export default createProxyMiddleware({
  target: SERVICES.GARAGE_SERVICE,
  changeOrigin: true,

  pathRewrite: (path, req) => {
    console.log("Original path:", path);
    return '/api/v1/garage' + path;
  },

onProxyReq: (proxyReq, req, res) => {
  console.log("🔥 PROXY HIT");
  console.log('Forwarding to:', proxyReq.path);

  if (req.body) {
    const bodyData = JSON.stringify(req.body);

    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

    proxyReq.write(bodyData);
  }
},

  onError: (err, req, res) => {
    console.error("❌ Proxy error:", err.message);
  }
})