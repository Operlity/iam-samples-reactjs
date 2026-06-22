const { createProxyMiddleware } = require('http-proxy-middleware');

// This is a DEVELOPMENT ONLY workaround for CORS issues
// Remove this file once CORS is properly configured on Identity Hub

module.exports = function(app) {
  const target = process.env.REACT_APP_BASE_URL || process.env.REACT_APP_AUTHORITY || 'https://your-identityhub-authority.com';
  console.log('🔧 Proxy middleware active - routing /idp to Identity Hub');
  console.log('⚠️  This is a development workaround only!');
  console.log('📝 Proper fix: Configure CORS on Identity Hub');
  console.log('🎯 Proxy target:', target);

  app.use(
    '/idp',
    createProxyMiddleware({
      target,
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
