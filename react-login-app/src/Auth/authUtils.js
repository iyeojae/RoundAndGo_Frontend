/**
 * 인증 관련 유틸리티 함수들
 *
 * 이 파일은 사용자 인증 상태 확인, 사용자 정보 관리, 로그아웃 처리 등
 * 인증과 관련된 모든 유틸리티 함수들을 제공합니다.
 *
 * 지원하는 인증 방식:
 * 1. JWT 토큰 (로컬스토리지)
 * 3. 세션 기반 인증 (JSESSIONID)
 *
 * @author RoundAndGo Team
 * @version 2.0.0
 */

import { API_ENDPOINTS } from '../config/api';
import { setAuthToken, getAuthToken, removeAuthToken, setCookie, getCookie, deleteCookie } from '../utils/cookieUtils';

// 쿠키 유틸리티는 cookieUtils.js에서 import

/**
 * 사용자의 로그인 상태를 확인하는 함수
 *
 * 다음 순서로 인증 정보를 확인합니다:
 * 1. 로컬스토리지의 JWT 토큰
 * 2. 쿠키의 JWT 토큰 (authToken, accessToken, JWT)
 * 3. 세션 기반 인증 (JSESSIONID)
 *
 * JWT 토큰이 있는 경우 만료 시간도 검증합니다.
 *
 * @returns {boolean} 로그인 상태 (true: 로그인됨, false: 로그인안됨)
 */
export const isLoggedIn = () => {
  // 🍪 쿠키에서 JWT 토큰 확인
  let token = getAuthToken();

  // 🔍 JWT 토큰이 없으면 세션 기반 인증 확인
  if (!token) {
    const sessionId = getCookie('JSESSIONID');
    if (sessionId) {
      console.log('🎯 세션 기반 인증 감지:', sessionId.substring(0, 10) + '...');
      return true; // 세션이 있으면 로그인 상태로 간주
    }

    console.log('🔍 토큰 없음: 쿠키, 세션 모두 확인했으나 인증 정보가 없습니다');
    return false;
  }

  console.log('✅ 토큰 발견:', token.substring(0, 20) + '...');

  try {
    // 🔐 JWT 토큰의 payload 부분을 디코딩하여 만료 시간 확인
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

    // ⏰ 토큰 만료 시간 검증
    if (payload.exp && payload.exp < now) {
      console.log('⚠️ JWT 토큰이 만료되었습니다. 자동 로그아웃 처리합니다.');
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ JWT 토큰 파싱 에러:', error);
    logout(); // 잘못된 토큰이므로 로그아웃 처리
    return false;
  }
};

/**
 * 저장된 사용자 정보를 가져오는 함수
 *
 * 다음 순서로 사용자 정보를 찾습니다:
 * 1. 로컬스토리지의 user 정보
 * 2. 쿠키의 user 또는 userInfo 정보
 *
 * @returns {Object|null} 사용자 정보 객체 또는 null (없는 경우)
 */
export const getUserInfo = () => {
  // 🍪 쿠키에서 사용자 정보 확인
  const user = getCookie('userInfo');

  if (!user) {
    console.log('🔍 사용자 정보 없음: 쿠키에서 사용자 정보가 없습니다');
    return null;
  }

  try {
    // 📋 JSON 문자열을 객체로 파싱
    return JSON.parse(user);
  } catch (error) {
    console.error('❌ 사용자 정보 파싱 에러:', error);
    return null;
  }
};

/**
 * 사용자 로그아웃을 처리하는 함수
 *
 * 저장된 모든 인증 정보를 삭제합니다.
 *
 * @returns {Promise<void>} 로그아웃 처리 완료
 */
export const logout = async () => {
  try {
    // 🚪 쿠키에서 모든 인증 정보 제거
    removeAuthToken();
    deleteCookie('refreshToken');
    deleteCookie('user');
    deleteCookie('userInfo');
    deleteCookie('JSESSIONID');

    console.log('✅ 로그아웃 완료');
  } catch (error) {
    console.error('❌ 로그아웃 에러:', error);
  }
};

/**
 * 사용자의 닉네임을 가져오는 함수
 *
 * 로그인 방식에 따라 적절한 닉네임을 반환합니다
 */
export const getUserNickname = () => {
  const userInfo = getUserInfo();
  if (!userInfo) return '사용자';

  // 📧 이메일 로그인인 경우
  if (userInfo.type === 'email') {
    return userInfo.userInfo?.email || userInfo.userInfo?.userId || '이메일 사용자';
  }

  return '사용자';
};

/**
 * 사용자의 프로필 이미지 URL을 가져오는 함수
 *
 * 현재는 기본 이미지만 지원합니다.
 */
export const getProfileImageUrl = () => {
  // 현재는 기본 이미지만 지원
  return null;
};

/**
 * 이메일 로그인 처리 함수
 */
const callLoginAPI = async (email, password) => {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({ email, password }),
  });

  return response;
};

/**
 * 로그인 응답 데이터 처리
 */
const processLoginResponse = (data, email) => {
  const accessToken = data.accessToken || data.data?.accessToken;
  const refreshToken = data.refreshToken || data.data?.refreshToken;

  if (!accessToken) {
    throw new Error('토큰 정보를 받지 못했습니다.');
  }

  // 토큰을 쿠키에 저장
  setAuthToken(accessToken, 7); // 7일간 유효
  if (refreshToken) {
    setCookie('refreshToken', refreshToken, { expires: 30 }); // 30일간 유효
  }

  // 사용자 정보를 쿠키에 저장
  setCookie('userInfo', JSON.stringify({
    type: 'email',
    loginTime: new Date().toISOString(),
    isOAuth2: false,
    userInfo: data.user || { email }
  }), { expires: 7 });

  return data;
};

/**
 * 이메일 로그인 메인 함수
 */
export const loginWithEmail = async (email, password) => {
  try {
    console.log('이메일 로그인 시도:', email);

    const response = await callLoginAPI(email, password);
    console.log('백엔드 응답:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ 이메일 로그인 성공');

      const processedData = processLoginResponse(data, email);
      return { success: true, data: processedData };
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `로그인 실패: ${response.status}`;
      return { success: false, error: errorMessage };
    }

  } catch (error) {
    console.error('이메일 로그인 오류:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 회원가입 API 호출
 */
const callSignupAPI = async (signupData) => {
  console.log('🌐 회원가입 API 호출:', API_ENDPOINTS.SIGNUP);
  console.log('📤 요청 데이터:', {
    email: signupData.email,
    password: '[HIDDEN]',
    nickname: signupData.userId
  });

  const response = await fetch(API_ENDPOINTS.SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: signupData.email,
      password: signupData.password,
      nickname: signupData.userId
    })
  });

  console.log('📡 HTTP 응답 상태:', response.status, response.statusText);
  return response;
};

/**
 * 회원가입 메인 함수
 */
export const signupWithEmail = async (signupData) => {
  try {
    console.log('🚀 회원가입 프로세스 시작');
    console.log('👤 회원가입 시도 사용자:', signupData.email);

    const response = await callSignupAPI(signupData);

    if (response.ok) {
      const data = await response.json();
      console.log('📥 회원가입 성공 응답 데이터:', data);
      console.log('✅ 회원가입 완료');

      return { success: true, data };
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `회원가입 실패: ${response.status}`;
      console.log(`❌ 회원가입 실패 - 상태: ${response.status}`);
      console.log(`❌ 에러 메시지: ${errorMessage}`);
      console.log(`❌ 에러 데이터:`, errorData);

      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('💥 회원가입 API 호출 오류:', error);
    console.error('💥 오류 타입:', error.name);
    console.error('💥 오류 메시지:', error.message);
    return { success: false, error: error.message };
  }
};
