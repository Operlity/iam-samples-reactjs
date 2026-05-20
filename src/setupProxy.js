const { createProxyMiddleware } = require('http-proxy-middleware');

// This is a DEVELOPMENT ONLY workaround for CORS issues
// Remove this file once CORS is properly configured on Identity Hub

module.exports = function(app) {
  console.log('🔧 Proxy middleware active - routing /idp to Identity Hub');
  console.log('⚠️  This is a development workaround only!');
  console.log('📝 Proper fix: Configure CORS on Identity Hub');

  app.use(
    '/idp',
    createProxyMiddleware({
      target: 'https://id.demo.operlity.com',
      changeOrigin: true,
      secure: false, // Allow self-signed certificates in development
      pathRewrite: {
        '^/idp': '', // Remove /idp prefix when forwarding
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('→ Proxying:', req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('← Response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('✗ Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error', details: err.message });
      },
      logLevel: 'debug',
    })
  );
};
