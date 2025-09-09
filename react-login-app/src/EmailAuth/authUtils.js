/**
 * 이메일 인증 관련 유틸리티 함수들
 * 카카오 로그인과 완전히 분리된 독립적인 모듈
 * 
 * 지원하는 인증 방식:
 * 1. JWT 토큰 (로컬스토리지)
 * 2. JWT 토큰 (쿠키)
 * 3. 세션 기반 인증 (JSESSIONID)
 * 
 * @author RoundAndGo Team
 * @version 2.0.0
 */

/**
 * 브라우저 쿠키에서 특정 값을 가져오는 헬퍼 함수
 * 
 * @param {string} name - 가져올 쿠키의 이름
 * @returns {string|null} 쿠키 값 또는 null (없는 경우)
 * 
 * @example
 * const token = getCookie('emailAuthToken');
 * const sessionId = getCookie('JSESSIONID');
 */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * 이메일 로그인 사용자의 로그인 상태를 확인하는 함수
 * 
 * 다음 순서로 인증 정보를 확인합니다:
 * 1. 로컬스토리지의 이메일 JWT 토큰
 * 2. 쿠키의 이메일 JWT 토큰 (emailAuthToken, emailAccessToken)
 * 3. 세션 기반 인증 (JSESSIONID)
 * 
 * JWT 토큰이 있는 경우 만료 시간도 검증합니다.
 * 
 * @returns {boolean} 로그인 상태 (true: 로그인됨, false: 로그인안됨)
 * 
 * @example
 * if (isEmailLoggedIn()) {
 *   // 이메일 사용자가 로그인된 상태
 *   showEmailUserProfile();
 * } else {
 *   // 이메일 사용자가 로그아웃된 상태
 *   showEmailLoginButton();
 * }
 */
export const isEmailLoggedIn = () => {
  // 🏠 1단계: 로컬스토리지에서 이메일 JWT 토큰 확인
  let token = localStorage.getItem('emailAuthToken') || localStorage.getItem('emailAccessToken');
  
  // 🍪 2단계: 로컬스토리지에 없으면 쿠키에서 이메일 JWT 토큰 확인
  if (!token) {
    token = getCookie('emailAuthToken') || getCookie('emailAccessToken');
  }
  
  // 🔍 3단계: JWT 토큰이 없으면 세션 기반 인증 확인
  if (!token) {
    const sessionId = getCookie('JSESSIONID');
    if (sessionId) {
      console.log('🎯 이메일 세션 기반 인증 감지:', sessionId.substring(0, 10) + '...');
      return true; // 세션이 있으면 로그인 상태로 간주
    }
    
    console.log('🔍 이메일 토큰 없음: 로컬스토리지, 쿠키, 세션 모두 확인했으나 인증 정보가 없습니다');
    return false;
  }
  
  console.log('✅ 이메일 토큰 발견:', token.substring(0, 20) + '...');
  
  try {
    // 🔐 JWT 토큰의 payload 부분을 디코딩하여 만료 시간 확인
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
    
    // ⏰ 토큰 만료 시간 검증
    if (payload.exp && payload.exp < now) {
      console.log('⚠️ 이메일 JWT 토큰이 만료되었습니다. 자동 로그아웃 처리합니다.');
      logoutEmail();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ 이메일 JWT 토큰 파싱 에러:', error);
    logoutEmail(); // 잘못된 토큰이므로 로그아웃 처리
    return false;
  }
};

/**
 * 저장된 이메일 사용자 정보를 가져오는 함수
 * 
 * 다음 순서로 사용자 정보를 찾습니다:
 * 1. 로컬스토리지의 emailUser 정보
 * 2. 쿠키의 emailUser 또는 emailUserInfo 정보
 * 
 * @returns {Object|null} 이메일 사용자 정보 객체 또는 null (없는 경우)
 * 
 * @example
 * const emailUserInfo = getEmailUserInfo();
 * if (emailUserInfo) {
 *   console.log('사용자 타입:', emailUserInfo.type); // 'email'
 *   console.log('로그인 시간:', emailUserInfo.loginTime);
 * }
 */
export const getEmailUserInfo = () => {
  // 🏠 1단계: 로컬스토리지에서 이메일 사용자 정보 확인
  let user = localStorage.getItem('emailUser');
  
  // 🍪 2단계: 로컬스토리지에 없으면 쿠키에서 확인
  if (!user) {
    user = getCookie('emailUser') || getCookie('emailUserInfo');
  }
  
  if (!user) {
    console.log('🔍 이메일 사용자 정보 없음: 로컬스토리지와 쿠키 모두 확인했으나 사용자 정보가 없습니다');
    return null;
  }
  
  try {
    // 📋 JSON 문자열을 객체로 파싱
    return JSON.parse(user);
  } catch (error) {
    console.error('❌ 이메일 사용자 정보 파싱 에러:', error);
    return null;
  }
};

/**
 * 이메일 사용자 로그아웃을 처리하는 함수
 * 
 * 저장된 모든 이메일 인증 정보를 삭제합니다.
 * 
 * @returns {Promise<void>} 로그아웃 처리 완료
 * 
 * @example
 * await logoutEmail();
 * // 이메일 사용자가 로그아웃되고 로그인 페이지로 리다이렉트
 */
export const logoutEmail = async () => {
  try {
    // 🚪 로컬스토리지와 쿠키에서 모든 이메일 인증 정보 제거
    localStorage.removeItem('emailAuthToken');
    localStorage.removeItem('emailAccessToken');
    localStorage.removeItem('emailRefreshToken');
    localStorage.removeItem('emailUser');
    localStorage.removeItem('emailIsLoggedIn');
    localStorage.removeItem('email');
    
    // 쿠키에서도 이메일 인증 정보 제거
    document.cookie = 'emailAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'emailAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'emailUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('✅ 이메일 로그아웃 완료');
  } catch (error) {
    console.error('❌ 이메일 로그아웃 에러:', error);
  }
};

/**
 * 이메일 사용자의 닉네임을 가져오는 함수
 * 
 * 이메일 로그인 사용자의 닉네임을 반환합니다:
 * - 이메일 주소 또는 사용자 ID
 * - 기본값: '이메일 사용자'
 * 
 * @returns {string} 사용자 닉네임
 * 
 * @example
 * const nickname = getEmailUserNickname();
 * document.getElementById('welcome').textContent = `안녕하세요, ${nickname}님!`;
 */
export const getEmailUserNickname = () => {
  const userInfo = getEmailUserInfo();
  if (!userInfo) return '이메일 사용자';
  
  // 📧 이메일 로그인인 경우
  if (userInfo.type === 'email') {
    return userInfo.email || userInfo.userId || '이메일 사용자';
  }
  
  return '이메일 사용자';
};

