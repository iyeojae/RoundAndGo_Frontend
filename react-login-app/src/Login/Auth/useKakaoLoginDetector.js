/**
 * 카카오 로그인 감지 및 처리 Hook
 * 
 * 이 Hook은 카카오 로그인 시도와 성공을 감지하고
 * 적절한 처리를 수행합니다.
 * 
 * 주요 기능:
 * 1. 카카오 로그인 시도 감지
 * 2. 로그인 성공 후 사용자 정보 동기화
 * 3. 자동 로그인 처리
 * 
 * @author RoundAndGo Team
 * @version 2.0.0
 */

import { useEffect, useState } from 'react';

/**
 * 카카오 로그인 시도 표시
 * 
 * @param {string} attemptType - 시도 타입 ('popup', 'redirect')
 */
export const markKakaoLoginAttempt = (attemptType = 'redirect') => {
  const timestamp = Date.now();
  localStorage.setItem('kakao-login-attempt', attemptType);
  localStorage.setItem('kakao-login-time', timestamp.toString());
  
  // console.log(`🎯 카카오 로그인 시도 감지: ${attemptType} (${new Date(timestamp).toLocaleString()})`);
};

/**
 * 카카오 로그인 감지 Hook
 * 
 * @returns {Object} 카카오 로그인 상태 정보
 */
export const useKakaoLoginDetector = () => {
  const [isKakaoLoginDetected, setIsKakaoLoginDetected] = useState(false);
  const [kakaoUserInfo, setKakaoUserInfo] = useState(null);

  useEffect(() => {
    const checkKakaoLogin = async () => {
      // 🎯 카카오 로그인 감지 조건들
      const conditions = {
        hasSessionCookie: document.cookie.includes('JSESSIONID'),
        isFromKakao: document.referrer.includes('kauth.kakao.com') ||
                    document.referrer.includes('accounts.kakao.com'),
        hasLoginAttempt: localStorage.getItem('kakao-login-attempt'),
        hasUserInfo: localStorage.getItem('user'),
        hasAuthToken: localStorage.getItem('authToken')
      };

      // console.log('🔍 카카오 로그인 감지 조건 확인:', conditions);

      // 🎯 카카오 로그인 감지된 경우
      if (conditions.hasSessionCookie || conditions.isFromKakao ||
          conditions.hasLoginAttempt || conditions.hasUserInfo ||
          conditions.hasAuthToken) {
        
        // console.log('✅ 카카오 로그인 감지됨!');
        setIsKakaoLoginDetected(true);

        // 🧹 로그인 시도 기록 정리
        localStorage.removeItem('kakao-login-attempt');
        localStorage.removeItem('kakao-login-time');

        // 🎯 사용자 정보 동기화
        try {
          const userInfo = await syncKakaoUserInfo();
          setKakaoUserInfo(userInfo);
          // console.log('✅ 카카오 사용자 정보 동기화 완료:', userInfo);
        } catch (error) {
          // console.error('❌ 카카오 사용자 정보 동기화 실패:', error);
        }
      }
    };

    // 🚀 페이지 로드 시 카카오 로그인 감지
    checkKakaoLogin();

    // 🎯 주기적으로 카카오 로그인 상태 확인 (5초마다)
    const interval = setInterval(checkKakaoLogin, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    isKakaoLoginDetected,
    kakaoUserInfo,
    markKakaoLoginAttempt
  };
};

/**
 * 카카오 사용자 정보 동기화
 * 
 * @returns {Promise<Object>} 동기화된 사용자 정보
 */
const syncKakaoUserInfo = async () => {
  try {
    // 🎯 1단계: 로컬스토리지에서 기존 사용자 정보 확인
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.type === 'kakao') {
        // console.log('✅ 기존 카카오 사용자 정보 발견');
        return userData;
      }
    }

    // 🎯 2단계: 백엔드 API로 사용자 정보 요청
    // console.log('📡 백엔드에 카카오 사용자 정보 요청 중...');
    
    // localStorage에서 토큰 가져오기 (이메일 로그인과 카카오 로그인 모두 지원)
    let accessToken = localStorage.getItem('accessToken');        // 카카오 로그인용
    let refreshToken = localStorage.getItem('refreshToken');      // 카카오 로그인용
    
    // 이메일 로그인 토큰이 있는지 확인
    if (!accessToken) {
      accessToken = localStorage.getItem('emailAccessToken');     // 이메일 로그인용
      refreshToken = localStorage.getItem('emailRefreshToken');   // 이메일 로그인용
    }
    
                console.log('🔑 localStorage에서 토큰 확인:', {
              accessToken: !!accessToken,
              refreshToken: !!refreshToken,
              source: accessToken ? (localStorage.getItem('emailAccessToken') ? 'email' : 'kakao') : 'none',
              accessTokenValue: accessToken ? accessToken.substring(0, 20) + '...' : 'undefined',
              emailAccessToken: !!localStorage.getItem('emailAccessToken'),
              emailAccessTokenValue: localStorage.getItem('emailAccessToken') ? localStorage.getItem('emailAccessToken').substring(0, 20) + '...' : 'undefined'
            });
    
    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다. 다시 로그인해주세요.');
    }
    
    const response = await fetch('https://api.roundandgo.com/api/auth/user', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`  // 토큰을 헤더에 포함
      }
    });

    if (response.ok) {
      const userData = await response.json();
      // console.log('✅ 백엔드에서 카카오 사용자 정보 확인:', userData);
      
      // 🎯 3단계: 로컬스토리지에 사용자 정보 저장
      const kakaoUserInfo = {
        type: 'kakao',
        loginTime: new Date().toISOString(),
        isOAuth2: true,
        userInfo: userData
      };
      
      localStorage.setItem('user', JSON.stringify(kakaoUserInfo));
      localStorage.setItem('isLoggedIn', 'true');
      
      return kakaoUserInfo;
    } else {
      throw new Error(`백엔드 API 오류: ${response.status}`);
    }
  } catch (error) {
    // console.error('❌ 카카오 사용자 정보 동기화 실패:', error);
    
    // 🎯 4단계: 에러 발생 시 기본 사용자 정보 생성
    const fallbackUserInfo = {
      type: 'kakao',
      loginTime: new Date().toISOString(),
      isOAuth2: true,
      error: error.message
    };
    
    localStorage.setItem('user', JSON.stringify(fallbackUserInfo));
    localStorage.setItem('isLoggedIn', 'true');
    
    return fallbackUserInfo;
  }
};
