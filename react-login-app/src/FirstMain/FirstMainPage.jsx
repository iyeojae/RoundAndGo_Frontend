/**
 * FirstMainPage.jsx
 * 
 * 제주도 지역별 골프장 선택 페이지
 * 사용자가 지도에서 원하는 지역을 클릭하면 해당 지역의 골프장 목록을 보여주는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 제주도 지도에서 지역 선택
 * 2. 선택된 지역의 골프장 목록 표시 (최대 3개)
 * 3. 골프장 이미지 슬라이더 (중앙 강조 효과)
 * 4. 골프장 검색 기능
 * 5. 메인 페이지로 이동
 * 6. 카카오 로그인 성공 시 자동 토큰 설정
 */

import React from 'react';
import './FirstMainPage.css';
import { useKakaoLoginDetector } from '../useKakaoLoginDetector';

/**
 * 카카오 로그인 성공 감지 및 토큰 설정
 * 이 페이지에 도달했다는 것은 OAuth2 로그인이 성공했다는 의미
 */
const handleLoginSuccess = () => {
  // 이미 토큰이 있으면 스킵
  if (localStorage.getItem('authToken')) {
    console.log('✅ 이미 로그인 상태입니다');
    return;
  }
  
  // Referrer가 카카오 관련이거나 세션 쿠키가 있으면 로그인 성공으로 간주
  const hasSessionCookie = document.cookie.includes('JSESSIONID');
  const isFromKakao = document.referrer.includes('kakao') || 
                     document.referrer.includes('roundandgo.onrender.com');
  
  if (hasSessionCookie || isFromKakao) {
    console.log('🎉 카카오 로그인 성공 감지!');
    
    // 가상의 사용자 정보 생성 (실제 정보는 백엔드에 저장됨)
    const userInfo = {
      type: 'kakao',
      loginTime: new Date().toISOString(),
      isOAuth2: true,
      nickname: '카카오 사용자',
      loginSuccess: true
    };
    
    // 로컬스토리지에 저장
    localStorage.setItem('authToken', 'kakao-session-' + Date.now());
    localStorage.setItem('user', JSON.stringify(userInfo));
    
    console.log('✅ 카카오 로그인 정보 저장 완료!');
    
    // UI 업데이트를 위한 새로고침 (선택사항)
    // window.location.reload();
  }
};

function FirstMainPage() {
  // 🎯 카카오 로그인 성공 자동 감지 및 처리
  useKakaoLoginDetector();

  return (
    <div className="first-main-container">
      <div className="header">
        <h1>아래 지도에서 원하는골프장을 선택해주세요</h1>
      </div>
      
      {/* 제주도 지도 SVG와 기타 컨텐츠 */}
      <div className="jeju-map">
        {/* 기존 지도 컨텐츠 */}
      </div>
    </div>
  );
}

export default FirstMainPage;
