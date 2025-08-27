/**
 * OAuth2 카카오 로그인 콜백 페이지
 * 
 * Spring Security OAuth2에서 리다이렉트된 후 JWT 토큰을 처리하는 페이지입니다.
 * 다양한 인증 방식을 지원하며 디버깅 정보를 상세히 로깅합니다.
 * 
 * 지원하는 인증 방식:
 * 1. URL 파라미터 기반 JWT 토큰 (accessToken, refreshToken)
 * 2. 쿠키 기반 JWT 토큰 (authToken, accessToken, JWT)
 * 3. 세션 기반 인증 (JSESSIONID)
 * 
 * 처리 과정:
 * 1. URL 파라미터와 쿠키에서 토큰 추출 시도
 * 2. 로컬 스토리지에 토큰 저장 (JWT 토큰인 경우)
 * 3. 세션 기반인 경우 사용자 정보만 저장
 * 4. 팝업 모드인 경우 부모 창에 메시지 전송 후 창 닫기
 * 5. 일반 모드인 경우 메인 페이지로 이동
 * 
 * 디버깅 기능:
 * - URL 파라미터 분석
 * - 쿠키 상태 확인
 * - 로컬스토리지 상태 확인
 * - 인증 방식 감지 및 로깅
 * 
 * @author RoundAndGo Team
 * @version 2.0.0
 */
import React, { useEffect } from 'react';
import { handleOAuth2Callback } from './oauth2KakaoConfig';

// 🍪 쿠키에서 특정 값 가져오기 (디버깅용)
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

/**
 * OAuth2Callback 리액트 컴포넌트
 * 
 * 카카오 OAuth2 인증 완료 후 사용자가 리다이렉트되는 페이지입니다.
 * 컴포넌트가 마운트되면 즉시 인증 정보를 처리하고 적절한 페이지로 이동시킵니다.
 * 
 * @returns {JSX.Element} 로딩 UI를 포함한 콜백 페이지
 */
function OAuth2Callback() {
    useEffect(() => {
        // 🎯 컴포넌트 마운트 시 디버깅 정보 출력
        console.log('🎯 OAuth2Callback 컴포넌트 마운트됨');
        console.log('📍 현재 URL:', window.location.href);
        console.log('🔍 URL 파라미터:', window.location.search);
        
        // 🍪 브라우저 쿠키 상세 분석
        console.log('🍪 전체 쿠키:', document.cookie);
        console.log('🍪 개별 쿠키 분석:');
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            console.log(`  ${name}: ${value ? value.substring(0, 20) + '...' : '(비어있음)'}`);
        });

        // 🔍 OAuth2 세션 관련 쿠키 특별 확인
        const sessionCookie = getCookie('JSESSIONID');
        const oauthCookie = getCookie('oauth2_auth_request');
        const springSecurityCookie = getCookie('SPRING_SECURITY_CONTEXT');
        
        console.log('🔐 OAuth2 세션 쿠키 상태 (authorization_request_not_found 디버깅):');
        console.log(`  JSESSIONID: ${sessionCookie ? '존재 (' + sessionCookie.substring(0, 8) + '...)' : '❌ 없음 - 핵심 문제!'}`);
        console.log(`  oauth2_auth_request: ${oauthCookie ? '존재' : '❌ 없음 - OAuth2 상태 손실!'}`);
        console.log(`  SPRING_SECURITY_CONTEXT: ${springSecurityCookie ? '존재' : '없음'}`);
        
        // 🌐 환경 정보 상세 확인
        console.log('🌐 브라우저 환경 분석:');
        console.log(`  현재 도메인: ${window.location.hostname}`);
        console.log(`  현재 프로토콜: ${window.location.protocol}`);
        console.log(`  현재 포트: ${window.location.port || '기본 포트'}`);
        console.log(`  전체 Origin: ${window.location.origin}`);
        console.log(`  User Agent: ${navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}`);
        
        // 🍪 SameSite/Secure 쿠키 문제 진단
        console.log('🍪 쿠키 정책 진단:');
        console.log(`  HTTPS 사용: ${window.location.protocol === 'https:' ? '✅ Yes' : '❌ No - Secure 쿠키 차단'}`);
        console.log(`  크로스 도메인: ${window.location.hostname !== 'roundandgo.onrender.com' ? '⚠️ Yes - SameSite 문제 가능' : '✅ No'}`);
        
        // 🔄 리다이렉트 체인 분석
        console.log('🔄 OAuth2 리다이렉트 체인 분석:');
        console.log(`  현재 URL: ${window.location.href}`);
        console.log(`  Referrer: ${document.referrer || '없음'}`);
        
        // 📊 쿠키 속성 분석 (가능한 경우)
        if (document.cookie) {
            console.log('📊 모든 쿠키 상세 분석:');
            const allCookies = document.cookie.split(';');
            allCookies.forEach((cookie, index) => {
                const [name, value] = cookie.trim().split('=');
                console.log(`  ${index + 1}. ${name}: ${value ? value.substring(0, 20) + '...' : '(empty)'}`);
            });
        } else {
            console.log('📊 ❌ 쿠키 완전 없음 - 심각한 세션 문제!');
        }
        
        // 💾 현재 로컬스토리지 상태 확인
        console.log('💾 로컬스토리지 현재 상태:', {
            authToken: localStorage.getItem('authToken') ? '존재' : '없음',
            refreshToken: localStorage.getItem('refreshToken') ? '존재' : '없음',
            user: localStorage.getItem('user') ? '존재' : '없음'
        });
        
        // 🚀 OAuth2 콜백 처리 함수 실행
        // 실제 토큰 추출, 저장, 리다이렉트 로직이 수행됩니다
        handleOAuth2Callback();
    }, []); // 빈 dependency array로 컴포넌트 마운트 시 한 번만 실행

    // 🎨 OAuth2 콜백 처리 중 사용자에게 보여줄 로딩 UI
    // 사용자가 인증 처리 과정을 기다리는 동안 표시되는 스피너와 메시지
    return (
        <div style={{
            display: 'flex',                    // Flexbox 레이아웃 사용
            justifyContent: 'center',           // 가로 중앙 정렬
            alignItems: 'center',               // 세로 중앙 정렬
            height: '100vh',                    // 화면 전체 높이 사용
            fontFamily: 'Arial, sans-serif',    // 기본 폰트 설정
            background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)' // 브랜드 그라데이션 배경
        }}>
            {/* 🎯 중앙 로딩 카드 컨테이너 */}
            <div style={{ 
                textAlign: 'center',            // 텍스트 중앙 정렬
                background: 'white',            // 흰색 배경으로 가독성 확보
                padding: '40px',               // 내부 여백
                borderRadius: '20px',          // 둥근 모서리
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' // 부드러운 그림자 효과
            }}>
                {/* 🌀 회전하는 로딩 스피너 */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f3f3f3',      // 기본 테두리 (연한 회색)
                    borderTop: '4px solid #269962',   // 상단 테두리 (브랜드 컬러)
                    borderRadius: '50%',              // 원형으로 만들기
                    animation: 'spin 1s linear infinite', // 무한 회전 애니메이션
                    margin: '0 auto 20px auto'        // 중앙 정렬 및 하단 마진
                }} />
                
                {/* 📝 로딩 상태 메시지 */}
                <h3 style={{ 
                    color: '#269962',              // 브랜드 컬러
                    marginBottom: '10px',         // 하단 마진
                    fontSize: '18px'              // 글자 크기
                }}>
                    로그인 처리 중...
                </h3>
                
                {/* 📄 사용자 안내 서브 메시지 */}
                <p style={{ 
                    color: '#666',                // 부드러운 회색
                    fontSize: '14px',             // 작은 글자 크기
                    margin: '0'                   // 마진 제거
                }}>
                    잠시만 기다려주세요.
                </p>
                
                {/* 🎨 CSS 애니메이션 정의 */}
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }    /* 시작: 0도 */
                        100% { transform: rotate(360deg); } /* 끝: 360도 (1바퀴) */
                    }
                `}</style>
            </div>
        </div>
    );
}

export default OAuth2Callback;
