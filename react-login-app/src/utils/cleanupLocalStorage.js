/**
 * 로컬스토리지 정리 유틸리티
 * 쿠키 기반 인증으로 전환하면서 로컬스토리지의 인증 관련 데이터를 정리합니다.
 */

export const cleanupLocalStorage = () => {
  const keysToRemove = [
    'authToken',
    'accessToken', 
    'refreshToken',
    'user',
    'emailUser',
    'isLoggedIn',
    'email',
    'emailAccessToken',
    'emailRefreshToken'
  ];

  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ 로컬스토리지에서 ${key} 제거됨`);
    }
  });

  console.log('🧹 로컬스토리지 정리 완료 - 쿠키 기반 인증으로 전환됨');
};

// 자동 실행 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  // 페이지 로드 시 자동으로 로컬스토리지 정리
  if (typeof window !== 'undefined') {
    cleanupLocalStorage();
  }
}
