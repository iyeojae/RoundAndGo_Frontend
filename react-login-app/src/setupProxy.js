const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 정적 파일들은 로컬에서 서빙하고, API 요청만 필요시 프록시
  // 현재는 배포된 서버를 직접 사용하므로 프록시 설정 최소화
  
  console.log('✅ 프록시 설정 로드됨 - 배포된 서버 직접 사용');
};
