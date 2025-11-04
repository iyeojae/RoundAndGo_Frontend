import styled, { keyframes } from 'styled-components';
import { useNavigate } from "react-router-dom";
import React from "react";

import bgIcon from '../assets/backIcon.svg';
import kakao from '../assets/kakao.svg';

const bounce = keyframes`
    0%, 100% {
        transform: scale(1.01);
    }
    50% {
        transform: scale(1.02);
    }
`;

const ButtonWithBounce = styled.button`
    transition: transform 0.5s ease, box-shadow 0.5s ease;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            animation: ${bounce} 0.6s ease forwards;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
    }
`;

const GradientContainer = styled.div`
    background: linear-gradient(180deg, #269962 0%, #FFFFFF 100%);
`;

const BackgroundWrapper = styled.div`
    overflow-y: hidden;
    background-image: url(${props => props.$bgIcon});
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: left top, left bottom;
`;

const ButtonsArea = styled.div`
    position: absolute;
    bottom: 10%;
    z-index: 3;
    width: 100%;
`;

const ButtonGroup = styled.div`
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const BaseButton = styled.button`
    width: 80%;
    margin: 0 auto;
    border: none;
    border-radius: clamp(27px, 5vw, 54px);
    font-size: clamp(14px, 2vw, 18px);
    cursor: pointer;
`;

const EmailLoginButton = styled(BaseButton)`
    background-color: #2d8779;
    padding: 3.5%;
    color: #fff;

    transition: transform 0.3s ease, box-shadow 0.3s ease;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            animation: ${bounce} 0.6s ease forwards;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
    }
`;

const KakaoLoginButton = styled(BaseButton)`
    background-color: #fee500;
    padding: 2% 3.75%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #000;

    transition: transform 0.3s ease, box-shadow 0.3s ease;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            animation: ${bounce} 0.6s ease forwards;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
    }
`;

const KakaoLogo = styled.img`
    margin-right: auto;
    width: auto;
`;

const KakaoText = styled.p`
    padding-right: 7%;
    margin: 0 auto 0 0;
`;

const SignUpText = styled.p`
    width: 85%;
    color: #2d8779;
    font-size: clamp(14px, 2vw, 18px);
    text-align: right;
    margin: 0 0 0 3%;
    cursor: pointer;
`;


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
     * 현재 카카오 로그인 점검 중이므로 점검 메시지를 표시합니다.
     */
    const handleKakaoLogin = () => {
        alert('⛳️ 현재 카카오 로그인 점검 중이에요. 빠르게 다시 돌아올게요! 그동안은 이메일 로그인으로 라운드앤고를 이용해 주세요 😊');
    };

    return (

        <>
            <GradientContainer>
                <BackgroundWrapper $bgIcon={bgIcon}>
                    <ButtonsArea className='buttons'>
                        <ButtonGroup>
                            <EmailLoginButton onClick={handleEmailLogin}>
                                로그인
                            </EmailLoginButton>

                            <KakaoLoginButton onClick={handleKakaoLogin}>
                                <KakaoLogo src={kakao} alt='카카오 로고'/>
                                <KakaoText>카카오로 시작하기</KakaoText>
                            </KakaoLoginButton>

                            <SignUpText onClick={handleSignUp}>회원가입</SignUpText>
                        </ButtonGroup>
                    </ButtonsArea>
                </BackgroundWrapper>
            </GradientContainer>
        </>
    );
}

export default HomePage;
