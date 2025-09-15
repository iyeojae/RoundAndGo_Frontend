/**
 * API 설정 파일
 * 환경에 따라 다른 API 엔드포인트를 사용합니다.
 */

// 환경 감지 (로컬 백엔드 서버가 실행되지 않을 때는 프로덕션 사용)
const isLocal = false; // 임시로 프로덕션 API 사용
// const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API 기본 URL 설정
export const API_BASE_URL = isLocal 
  ? 'http://localhost:8080/api'
  : 'https://roundandgo.shop/api';

// 백엔드 기본 URL 설정 (OAuth2 콜백용)
export const BACKEND_BASE_URL = isLocal 
  ? 'http://localhost:8080'
  : 'https://roundandgo.shop';

// API 엔드포인트들
export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  USER_ME: `${API_BASE_URL}/user/me`,
  USER_INFO: `${API_BASE_URL}/auth/user`,
  TOKEN: `${API_BASE_URL}/auth/token`,
  
  // 계정 찾기
  FIND_ID_REQUEST: `${API_BASE_URL}/auth/find-id/request`,
  FIND_ID_CONFIRM: `${API_BASE_URL}/auth/find-id/confirm`,
  
  // 골프장 검색
  GOLF_COURSES_SEARCH: `${API_BASE_URL}/golf-courses/search-by-address`,
  
  // 관광 정보
  TOUR_INFOS_RESTAURANTS: `${API_BASE_URL}/tour-infos/restaurants`,
  
  // 스케줄 관련
  SCHEDULES: `${API_BASE_URL}/schedules`,
  SCHEDULE_BY_ID: (id) => `${API_BASE_URL}/schedules/${id}`,
};

// 환경 정보 로깅
console.log(`🌍 API 환경: ${isLocal ? '로컬 개발' : '프로덕션'}`);
console.log(`🔗 API Base URL: ${API_BASE_URL}`);
