import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import React from "react";
import { oauth2KakaoApi } from '../Auth/oauth2KakaoConfig.js';
import { markKakaoLoginAttempt } from '../Auth/useKakaoLoginDetector.js';


import bgIcon from './backIcon.svg';
import kakao from './kakao.svg';

function HomePage() {
    const navigate = useNavigate();

    const handleEmailLogin = () => {
        navigate('/email-login');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    /**
     * OAuth2 카카오 로그인 버튼 클릭 이벤트 핸들러
     *
     * Spring Security OAuth2를 통한 간단한 카카오 로그인 프로세스:
     * 1. 백엔드의 OAuth2 엔드포인트로 팝업 리다이렉트
     * 2. 카카오 로그인 후 백엔드에서 JWT 토큰 생성
     * 3. 콜백 페이지에서 토큰 수신 및 저장
     * 4. 메인 페이지로 이동
     */
    const handleKakaoLogin = () => {
        // console.log('OAuth2 카카오로 시작하기 클릭됨');
        // console.log('🔄 현재 창에서 카카오 로그인 페이지로 이동');
        markKakaoLoginAttempt(); // 🎯 카카오 로그인 시도 기록 (성공 감지용)

        // 현재 창에서 직접 카카오 로그인으로 이동
        // 로그인 완료 후 백엔드에서 /oauth/kakao 콜백으로 리다이렉트됨
        oauth2KakaoApi.startLogin();
    };

    return (

        <>
            <div style={{background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)'}}>
                <div style={{
                    overflowY: 'hidden',
                    backgroundImage: `url(${bgIcon})`,
                    position: 'relative',
                    width: '100%',
                    minHeight: '100vh',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat, no-repeat',
                    backgroundPosition: 'left top, left bottom',
                }}>
                    <div className='buttons' style={{position: 'absolute', bottom: '10%', zIndex: 3, width: '100%'}}>
                        <div style={{
                            width: '90%',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            <button style={{
                                width: '80%',
                                margin: '0 auto',
                                border: 'none',
                                borderRadius: '27px',
                                backgroundColor: '#2d8779',
                                padding: '15px',
                                fontSize: 'clamp(14px, 2vw, 18px)',
                                color: '#fff'
                            }} onClick={handleEmailLogin}>로그인
                            </button>
                            <button onClick={handleKakaoLogin} style={{
                                width: '80%',
                                margin: '0 auto',
                                border: 'none',
                                borderRadius: '27px',
                                backgroundColor: '#fee500',
                                padding: '8.75px 15px',
                                display: 'flex',
                                flexDirection: 'row',
                                fontSize: 'clamp(14px, 2vw, 18px)',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <img style={{marginRight: 'auto', width: ''}} src={kakao} alt='카카오 로고'/>
                                <p style={{paddingRight: '7%', margin: '0 auto 0 0'}}>카카오로 시작하기</p>
                            </button>
                            <p onClick={handleSignUp} style={{
                                width: '85%',
                                color: '#2d8779',
                                fontSize: 'clamp(14px, 2vw, 18px)',
                                textAlign: 'right',
                                margin: '0 0 0 3%'
                            }}>회원가입</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;