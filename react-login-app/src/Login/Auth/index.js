/**
 * Auth 모듈 - 카카오 로그인 전용
 * 이메일 로그인과 완전히 분리된 독립적인 모듈
 */

// 카카오 OAuth2 설정 및 API
export { oauth2KakaoApi, handleOAuth2Callback } from './oauth2KakaoConfig';

// 카카오 로그인 감지 Hook
export { useKakaoLoginDetector, markKakaoLoginAttempt } from './useKakaoLoginDetector';

// 인증 유틸리티 함수들 (카카오 로그인용)
export { 
  isLoggedIn, 
  getUserInfo,
  getUserNickname, 
  getProfileImageUrl, 
  logout
} from './authUtils';

// 세션 관리 (카카오 로그인용)
export { syncUserFromSession, autoSyncOnLoad } from './sessionSync';
