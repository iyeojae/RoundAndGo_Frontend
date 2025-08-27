// 인증 관련 유틸리티 함수들
import { oauth2KakaoApi } from './oauth2KakaoConfig';

// 로그인 상태 확인 (JWT 토큰 기반)
export const isLoggedIn = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    // JWT 토큰의 payload 디코딩 (만료 시간 확인)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // 토큰이 만료되었는지 확인
    if (payload.exp && payload.exp < now) {
      console.log('JWT 토큰이 만료되었습니다');
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('JWT 토큰 파싱 에러:', error);
    logout();
    return false;
  }
};

// 사용자 정보 가져오기
export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('사용자 정보 파싱 에러:', error);
    return null;
  }
};

// 로그아웃 (OAuth2 방식)
export const logout = async () => {
  try {
    oauth2KakaoApi.logout();
    console.log('로그아웃 완료');
  } catch (error) {
    console.error('로그아웃 에러:', error);
    // 에러가 발생해도 로컬 토큰은 제거됨
  }
};

// 사용자 닉네임 가져오기
export const getUserNickname = () => {
  const userInfo = getUserInfo();
  if (!userInfo) return '사용자';
  
  // 카카오 로그인인 경우
  if (userInfo.type === 'kakao' && userInfo.userInfo) {
    return userInfo.userInfo.properties?.nickname || '카카오 사용자';
  }
  
  // 이메일 로그인인 경우 (추후 확장)
  if (userInfo.type === 'email') {
    return userInfo.email || '이메일 사용자';
  }
  
  return '사용자';
};

// 프로필 이미지 URL 가져오기
export const getProfileImageUrl = () => {
  const userInfo = getUserInfo();
  if (!userInfo) return null;
  
  // 카카오 로그인인 경우
  if (userInfo.type === 'kakao' && userInfo.userInfo) {
    return userInfo.userInfo.properties?.profile_image || userInfo.userInfo.properties?.thumbnail_image;
  }
  
  return null;
};
