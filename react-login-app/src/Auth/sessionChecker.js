/**
 * 세션 체크 및 자동 로그인 동기화
 * 
 * 이 스크립트를 콘솔에서 실행하면
 * 현재 Spring Security 세션을 확인하고
 * 로그인 상태를 프론트엔드와 동기화합니다
 */

import { API_ENDPOINTS } from '../config/api';

// 콘솔에서 실행할 함수
window.checkAndSyncSession = async function() {
  // 세션 기반 로그인 상태 확인 및 동기화 시작
  
  try {
    // 1. 현재 쿠키 상태 확인
    // 현재 쿠키 확인
    
    // 2. 백엔드 API로 사용자 정보 요청
    // 백엔드에 사용자 정보 요청
    
    const response = await fetch(API_ENDPOINTS.USER_ME, {
      method: 'GET',
      credentials: 'include', // JSESSIONID 쿠키 포함
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // API 응답 상태 확인
    
    if (response.ok) {
      const userInfo = await response.json();
      // 백엔드에서 사용자 정보 확인
      
      // 3. 로컬스토리지에 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify({
        type: 'email',
        loginTime: new Date().toISOString(),
        userInfo: userInfo
      }));
      
      // 로컬스토리지에 사용자 정보 저장 완료
      
      // 로그인 동기화 완료 - 페이지 새로고침
      window.location.reload();
      
      return true;
    } else if (response.status === 401) {
      // 세션 만료 또는 로그인되지 않음
      alert('❌ 백엔드 세션이 없습니다. 다시 로그인해주세요.');
      return false;
    } else {
      // API 응답 실패
      alert('❌ API 호출 실패: ' + response.status);
      return false;
    }
  } catch (error) {
    // 동기화 에러
    alert('❌ 오류 발생: ' + error.message);
    return false;
  }
};

// 자동 실행
// 세션 체크 함수 준비 완료
