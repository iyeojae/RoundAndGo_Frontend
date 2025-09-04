const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://roundandgo.onrender.com',
      changeOrigin: true,
      secure: false, // HTTPS 인증서 검증 비활성화
      pathRewrite: {
        '^/api': '/api', // 경로 그대로 유지
      },
      onError: (err, req, res) => {
        console.error('프록시 에러:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          error: '프록시 에러', 
          message: err.message,
          details: '백엔드 서버 연결에 실패했습니다.'
        }));
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('프록시 요청:', req.method, req.url, '→', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('프록시 응답:', proxyRes.statusCode, req.url);
      }
    })
  );
  
  console.log('✅ 프록시 설정 로드됨 - Render 백엔드 서버로 프록시');
};
