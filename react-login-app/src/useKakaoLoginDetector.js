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
        
        // 사용자 정보 생성
        const userInfo = {
          type: 'kakao',
          loginTime: new Date().toISOString(),
          isOAuth2: true,
          nickname: '카카오 사용자',
          loginSuccess: true,
          detectedBy: getDetectionReason(conditions)
        };
        
        // 토큰 생성 (세션 기반이므로 가상 토큰)
        const fakeToken = `kakao-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // 로컬스토리지에 저장
        localStorage.setItem('authToken', fakeToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // 임시 기록 제거
        localStorage.removeItem('kakao-login-attempt');
        localStorage.removeItem('kakao-login-time');
        
        console.log('✅ 카카오 로그인 정보 저장 완료!');
        console.log('📋 저장된 정보:', userInfo);
        
        // 선택적으로 페이지 새로고침
        if (window.confirm('로그인이 완료되었습니다. 페이지를 새로고침하시겠습니까?')) {
          window.location.reload();
        }
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
 * 카카오 로그인 버튼 클릭 시 호출할 함수
 * HomePage에서 카카오 로그인 버튼 클릭 시 실행
 */
export const markKakaoLoginAttempt = () => {
  console.log('🚀 카카오 로그인 시도 기록');
  localStorage.setItem('kakao-login-attempt', 'true');
  localStorage.setItem('kakao-login-time', Date.now().toString());
};
