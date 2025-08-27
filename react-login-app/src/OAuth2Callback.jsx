/**
 * OAuth2 카카오 로그인 콜백 페이지
 * 
 * Spring Security OAuth2에서 리다이렉트된 후 JWT 토큰을 처리하는 페이지입니다.
 * URL 파라미터에서 토큰을 추출하여 저장하고 적절한 페이지로 이동시킵니다.
 * 
 * 처리 과정:
 * 1. URL 파라미터에서 accessToken, refreshToken 추출
 * 2. 로컬 스토리지에 토큰 저장
 * 3. 팝업 모드인 경우 부모 창에 메시지 전송 후 창 닫기
 * 4. 일반 모드인 경우 메인 페이지로 이동
 */
import React, { useEffect } from 'react';
import { handleOAuth2Callback } from './oauth2KakaoConfig';

function OAuth2Callback() {
    useEffect(() => {
        // OAuth2 콜백 처리 실행
        handleOAuth2Callback();
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)'
        }}>
            <div style={{ 
                textAlign: 'center',
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #269962',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px auto'
                }} />
                
                <h3 style={{ 
                    color: '#269962', 
                    marginBottom: '10px',
                    fontSize: '18px' 
                }}>
                    로그인 처리 중...
                </h3>
                
                <p style={{ 
                    color: '#666', 
                    fontSize: '14px',
                    margin: '0' 
                }}>
                    잠시만 기다려주세요.
                </p>
                
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default OAuth2Callback;
