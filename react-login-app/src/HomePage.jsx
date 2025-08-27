import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import React from "react";
import { oauth2KakaoApi } from "./oauth2KakaoConfig";

const AppContainer = styled.div`
  min-width: 375px;
  max-width: 440px;
  //min-height: 100vh;
  height: 100vh;
  //background: linear-gradient(180deg, #269962 0%, #FFFFFF 100%);
  display: flex;
  flex-direction: column;
  //justify-content: center;
  //align-items: center;
  position: relative;
  overflow: auto;
  padding: 0;
    margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const LoginFrame = styled.div`
  width: 440px;
  min-height: 956px;
  position: relative;
  background: linear-gradient(180deg, #269962 0%, #FFFFFF 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: auto;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Shape1 = styled.div`
  position: absolute;
  top: 67px;
  left: 51px;
  width: 678.48px;
  height: 274px;
  background: linear-gradient(180deg, #F1FFF8 21.63%, #227D51 100%);
  border-radius: 50% 50% 0 0;
  transform: translateX(-50%);
`;

const Shape2 = styled.div`
  position: absolute;
  top: 299px;
  left: -368px;
  width: 678.48px;
  height: 274px;
  background: linear-gradient(180deg, #227D51 0%, #F1FFF8 71.15%);
  border-radius: 0 0 50% 50%;
  transform: translateX(50%);
`;

const Shape3 = styled.div`
  position: absolute;
  top: 519px;
  left: 166px;
  width: 274px;
  height: 678.48px;
  background: linear-gradient(180deg, #F1FFF8 0%, #269962 100%);
  border-radius: 50% 0 0 50%;
  transform: translateY(-50%);
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 124px;
  left: 50%;
  transform: translateX(-50%);
  width: 117px;
  height: 121px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Title = styled.h1`
  position: absolute;
  top: 255px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Julius Sans One', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.09;
  color: #2C8C7D;
  text-align: center;
  margin: 0;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 156px;
  left: 50%;
  transform: translateX(-50%);
  width: 328px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 2;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
    bottom: 120px;
  }
`;

const EmailButton = styled.button`
  width: 328px;
  height: 54px;
  background: #2D8779;
  border: 1px solid #2D8779;
  border-radius: 27px;
  color: #FFFFFF;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1f6b5f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 135, 121, 0.3);
  }
`;

const KakaoButton = styled.button`
  width: 328px;
  height: 54px;
  background: #FEE500;
  border: none;
  border-radius: 27px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f4d800;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(254, 229, 0, 0.3);
  }
`;

const ScheduleButton = styled.button`
  width: 328px;
  height: 54px;
  background: #FFE009;
  border: none;
  border-radius: 27px;
  cursor: pointer;
  color: #2C8C7D;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  transition: all 0.3s ease;

  &:hover {
    background: #f4d800;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 224, 9, 0.3);
  }
`;

const KakaoIcon = styled.img`
  width: 49px;
  height: 38px;
  object-fit: contain;
`;

const KakaoText = styled.img`
  width: 125px;
  height: 32px;
  object-fit: contain;
`;

function HomePage() {
    const navigate = useNavigate();

    const handleEmailLogin = () => {
        navigate('/email-login');
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
        console.log('OAuth2 카카오로 시작하기 클릭됨');
        console.log('🔄 현재 창에서 카카오 로그인 페이지로 이동');
        
        // 현재 창에서 직접 카카오 로그인으로 이동
        // 로그인 완료 후 백엔드에서 /oauth/kakao 콜백으로 리다이렉트됨
        oauth2KakaoApi.startLogin();
    };

    const handleSchedule = () => {
        navigate('/schedule');
    };

    return (
        <AppContainer>
            <LoginFrame>
                <BackgroundShapes>
                    <Shape1 />
                    <Shape2 />
                    <Shape3 />
                </BackgroundShapes>

                <LogoContainer>
                    <Logo src="/images/logo-280a0a.png" alt="ROUND & GO Logo" />
                </LogoContainer>

                <Title style={{fontWeight: 'bolder'}}>ROUND & GO</Title>

                <ButtonContainer>
                    <EmailButton onClick={handleEmailLogin}>
                        이메일로 시작하기
                    </EmailButton>

                    <KakaoButton onClick={handleKakaoLogin}>
                        <KakaoText src="/images/kakao-text-57a9c7.png" alt="카카오로 시작하기" />
                    </KakaoButton>

                    <ScheduleButton onClick={handleSchedule}>
                        일정관리 바로가기
                    </ScheduleButton>
                </ButtonContainer>
            </LoginFrame>
        </AppContainer>
    );
} export default HomePage;