/**
 * EmailAuth 모듈 - 이메일 로그인 전용
 * 카카오 로그인과 완전히 분리된 독립적인 모듈
 */

// 이메일 인증 유틸리티 함수들
export { 
  isEmailLoggedIn, 
  getEmailUserInfo,
  getEmailUserNickname, 
  logoutEmail
} from './authUtils';

// 이메일 세션 관리
export { syncEmailUserFromSession, autoSyncEmailOnLoad } from './sessionSync';

// 이메일 API 서비스들
export * from './findAccountApi';

// 이메일 인증 컴포넌트들
export { default as EmailLoginPage } from './EmailLoginPage';
export { default as SignupPage } from './SignupPage';
export { default as FindAccountPage } from './FindAccountPage';
