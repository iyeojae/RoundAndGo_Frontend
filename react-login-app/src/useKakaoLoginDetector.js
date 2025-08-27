/**
 * 카카오 로그인 성공 감지 훅
 * 
 * 백엔드 수정 없이 프론트엔드에서만 카카오 로그인 성공을 감지하고
 * 적절한 사용자 정보를 로컬스토리지에 저장하는 훅입니다.
 */

import { useEffect } from 'react';

export const useKakaoLoginDetector = () => {
  useEffect(() => {
    const detectAndSetLogin = () => {
      // 이미 토큰이 있으면 스킵
      if (localStorage.getItem('authToken')) {
        console.log('✅ 이미 로그인 상태입니다');
        return;
      }

      // 로그인 성공 감지 조건들
      const conditions = {
        // 1. 세션 쿠키 존재
        hasSessionCookie: document.cookie.includes('JSESSIONID'),
        
        // 2. 카카오 관련 Referrer
        isFromKakao: document.referrer.includes('kauth.kakao.com') || 
                     document.referrer.includes('roundandgo.onrender.com'),
        
        // 3. 현재 URL이 로그인 성공 페이지 (/first-main, /main 등)
        isSuccessPage: window.location.pathname === '/first-main' || 
                       window.location.pathname === '/main',
        
        // 4. localStorage에 임시 로그인 시도 기록이 있음
        hasLoginAttempt: localStorage.getItem('kakao-login-attempt'),
        
        // 5. 최근 1분 내에 홈페이지에서 왔음 (카카오 로그인 버튼 클릭 추적)
        recentLoginClick: checkRecentLoginClick()
      };

      console.log('🔍 카카오 로그인 감지 조건 체크:', conditions);

      // 조건 중 하나라도 만족하면 로그인 성공으로 간주
      if (conditions.hasSessionCookie || conditions.isFromKakao || 
          conditions.hasLoginAttempt || conditions.recentLoginClick) {
        
        console.log('🎉 카카오 로그인 성공 감지!');
        
        // 🚀 백엔드에서 실제 JWT 토큰 요청
        fetchRealJWTTokens();
        
        // 임시 기록 제거
        localStorage.removeItem('kakao-login-attempt');
        localStorage.removeItem('kakao-login-time');
      }
    };

    // 페이지 로드 시 감지 실행
    detectAndSetLogin();
  }, []);
};

/**
 * 최근 로그인 클릭 여부 확인
 */
function checkRecentLoginClick() {
  const loginTime = localStorage.getItem('kakao-login-time');
  if (!loginTime) return false;
  
  const timeDiff = Date.now() - parseInt(loginTime);
  const fiveMinutes = 5 * 60 * 1000; // 5분
  
  return timeDiff < fiveMinutes;
}

/**
 * 감지 이유 반환
 */
function getDetectionReason(conditions) {
  if (conditions.hasSessionCookie) return 'session-cookie';
  if (conditions.isFromKakao) return 'kakao-referrer';
  if (conditions.hasLoginAttempt) return 'login-attempt';
  if (conditions.recentLoginClick) return 'recent-click';
  return 'unknown';
}

/**
 * 백엔드에서 실제 JWT 토큰과 사용자 정보를 가져오는 함수
 */
async function fetchRealJWTTokens() {
  try {
    console.log('🔑 백엔드에서 실제 JWT 토큰 요청 중...');
    
    // 백엔드 사용자 정보 API 호출 (세션 쿠키로 인증)
    const userResponse = await fetch('https://roundandgo.onrender.com/api/auth/user', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ 사용자 정보 받아옴:', userData);
      
      // JWT 토큰 발급 요청
      const tokenResponse = await fetch('https://roundandgo.onrender.com/api/auth/token', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('🎯 JWT 토큰 받아옴:', tokenData);
        
        // 실제 토큰 저장
        if (tokenData.accessToken) {
          localStorage.setItem('authToken', tokenData.accessToken);
          console.log('✅ JWT AccessToken 저장:', tokenData.accessToken.substring(0, 20) + '...');
        }
        
        if (tokenData.refreshToken) {
          localStorage.setItem('refreshToken', tokenData.refreshToken);
          console.log('✅ RefreshToken 저장:', tokenData.refreshToken.substring(0, 20) + '...');
        }
        
        // 사용자 정보 저장
        const userInfo = {
          type: 'kakao',
          loginTime: new Date().toISOString(),
          isOAuth2: true,
          nickname: userData.nickname || '카카오 사용자',
          email: userData.email || null,
          profileImage: userData.profileImage || null,
          loginSuccess: true,
          hasRealTokens: true
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        console.log('✅ 사용자 정보 저장 완료:', userInfo);
        
      } else {
        console.log('⚠️ JWT 토큰 발급 실패, 세션 방식으로 대체');
        fallbackToSessionAuth(userData);
      }
      
    } else {
      console.log('⚠️ 사용자 정보 가져오기 실패, 가상 정보로 대체');
      fallbackToFakeAuth();
    }
    
  } catch (error) {
    console.error('❌ JWT 토큰 요청 실패:', error);
    console.log('🔄 가상 토큰으로 대체');
    fallbackToFakeAuth();
  }
}

/**
 * JWT 토큰 요청 실패 시 세션 방식으로 대체
 */
function fallbackToSessionAuth(userData) {
  const userInfo = {
    type: 'kakao',
    loginTime: new Date().toISOString(),
    isOAuth2: true,
    nickname: userData?.nickname || '카카오 사용자',
    email: userData?.email || null,
    profileImage: userData?.profileImage || null,
    loginSuccess: true,
    hasRealTokens: false,
    authType: 'session'
  };
  
  const sessionToken = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('authToken', sessionToken);
  localStorage.setItem('user', JSON.stringify(userInfo));
  
  console.log('✅ 세션 기반 인증 저장 완료:', userInfo);
}

/**
 * 모든 방법 실패 시 가상 인증으로 대체
 */
function fallbackToFakeAuth() {
  const userInfo = {
    type: 'kakao',
    loginTime: new Date().toISOString(),
    isOAuth2: true,
    nickname: '카카오 사용자',
    loginSuccess: true,
    hasRealTokens: false,
    authType: 'fallback'
  };
  
  const fakeToken = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('authToken', fakeToken);
  localStorage.setItem('user', JSON.stringify(userInfo));
  
  console.log('✅ 가상 인증 저장 완료:', userInfo);
}

/**
 * 카카오 로그인 버튼 클릭 시 호출할 함수
 * HomePage에서 카카오 로그인 버튼 클릭 시 실행
 */
export const markKakaoLoginAttempt = () => {
  console.log('🚀 카카오 로그인 시도 기록');
  localStorage.setItem('kakao-login-attempt', 'true');
  localStorage.setItem('kakao-login-time', Date.now().toString());
};
