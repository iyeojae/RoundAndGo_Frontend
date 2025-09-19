import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import React from "react";
import { oauth2KakaoApi } from '../Auth/oauth2KakaoConfig.js';
import { markKakaoLoginAttempt } from '../Auth/useKakaoLoginDetector.js';


import bgIcon from './backIcon.svg';
import kakao from './kakao.svg';

// const AppContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   top: 0;
//   left: 0;
//   padding: 0;
// `;
//
// const LoginFrame = styled.div`
//   width: 100%;
//   height: 100vh;
//   position: relative;
//   background: linear-gradient(180deg, #52B788 0%, #B7E4C7 50%, #D8F3DC 100%);
//   overflow: hidden;
//   display: flex;
//   flex-direction: column;
//
//   @media (max-width: 768px) {
//     width: 100vw;
//     height: 100vh;
//   }
// `;
//
// // 큰 로고 섹션 컨테이너
// const LogoSection = styled.div`
//   position: relative;
//   width: 100%;
//   height: 500px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//
//   @media (max-width: 1024px) {
//     height: 450px;
//   }
//
//   @media (max-width: 768px) {
//     height: 400px;
//   }
//
//   @media (max-width: 640px) {
//     height: 370px;
//   }
//
//   @media (max-width: 480px) {
//     height: 320px;
//   }
//
//   @media (max-width: 360px) {
//     height: 280px;
//   }
// `;
//
// // 도형 3을 위한 하단 컨테이너
// const BottomShapeContainer = styled.div`
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 100%;
//   height: 450px;
//   overflow: visible;
//
//   @media (max-width: 768px) {
//     height: 380px;
//   }
//
//   @media (max-width: 480px) {
//     height: 320px;
//   }
// `;
//
// // 로고와 텍스트를 묶는 컨테이너
// const LogoContent = styled.div`
//   position: relative;
//   z-index: 10;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: -50px;
//
//   @media (max-width: 768px) {
//     margin-top: -40px;
//   }
//
//   @media (max-width: 480px) {
//     margin-top: -30px;
//   }
// `;
//
// const BackgroundShapes = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   pointer-events: none;
//   overflow: hidden;
// `;
//
// // 첫번째 도형 - Union (그라데이션) - 지연 도형 모양
// const Shape1 = styled.div`
//     position: absolute;
//     width: 90%;
//     height: 380px;
//     left: 10%;
//     top: 15%;
//     background: linear-gradient(90deg, #FFFFFF 0%, #9BC9B3 100%);
//     border-radius: 190px 0 0 190px;
//     z-index: 1;
//
//     @media (max-width: 768px) {
//         width: 90%;
//         height: 320px;
//         left: 10%;
//         border-radius: 160px 0 0 160px;
//     }
//
//     @media (max-width: 480px) {
//         width: 90%;
//         height: 260px;
//         left: 10%;
//         border-radius: 130px 0 0 130px;
//     }
// `;
//
// // 나머지 도형들 완전히 제거
// const Shape2 = styled.div`
//     position: absolute;
//     width: 90%;
//     height: 380px;
//     right: 10%;
//     top: 400px;
//     background: linear-gradient(270deg, #2A8258 0%, #A0CBB6 100%);
//     border-radius: 0 190px 190px 0;
//     z-index: 1;
//
//     @media (max-width: 768px) {
//         width: 90%;
//         height: 320px;
//         right: 10%;
//         top: 335px;
//         border-radius: 0 160px 160px 0;
//     }
//
//     @media (max-width: 480px) {
//         width: 90%;
//         height: 260px;
//         right: 10%;
//         top: 280px;
//         border-radius: 0 130px 130px 0;
//     }
// `;
//
// const Shape3 = styled.div`
//     position: absolute;
//     width: 450px;
//     height: 100%;
//     right: 0;
//     bottom: 0%;
//     background: linear-gradient(180deg, #FFFFFF 0%, #9BC9B3 100%);
//     border-radius: 225px 225px 0 0;
//     z-index: 1;
//
//     @media (max-width: 768px) {
//         width: 380px;
//         border-radius: 190px 190px 0 0;
//     }
//
//     @media (max-width: 480px) {
//         width: 310px;
//         border-radius: 155px 155px 0 0;
//     }
// `;
//
// const Shape4 = styled.div`
//     display: none;
// `;
//
// const LogoContainer = styled.div`
//     position: relative;
//     width: 300px;
//     height: 315px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     margin-bottom: 8px;
//
//     @media (max-width: 1024px) {
//         width: 280px;
//         height: 295px;
//     }
//
//     @media (max-width: 768px) {
//         width: 255px;
//         height: 270px;
//         margin-bottom: 6px;
//     }
//
//     @media (max-width: 640px) {
//         width: 230px;
//         height: 245px;
//     }
//
//     @media (max-width: 480px) {
//         width: 200px;
//         height: 210px;
//         margin-bottom: 4px;
//     }
//
//     @media (max-width: 360px) {
//         width: 170px;
//         height: 180px;
//     }
// `;
//
// const Logo = styled.img`
//     width: 100%;
//     height: 100%;
//     object-fit: contain;
//     filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
// `;
//
// const Title = styled.h1`
//     font-family: 'Julius Sans One', sans-serif;
//     font-weight: 700;
//     font-size: 30px;
//     line-height: 1.09;
//     color: #2C8C7D;
//     text-align: center;
//     margin: 0;
//     margin-top: -40px;
//     text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//
//     @media (max-width: 1024px) {
//         font-size: 28px;
//         margin-top: -38px;
//     }
//
//     @media (max-width: 768px) {
//         font-size: 26px;
//         margin-top: -35px;
//     }
//
//     @media (max-width: 640px) {
//         font-size: 24px;
//         margin-top: -32px;
//     }
//
//     @media (max-width: 480px) {
//         font-size: 22px;
//         margin-top: -30px;
//     }
//
//     @media (max-width: 360px) {
//         font-size: 20px;
//         margin-top: -25px;
//     }
// `;
//
// const ButtonContainer = styled.div`
//     position: absolute;
//     bottom: 156px;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 328px;
//     display: flex;
//     flex-direction: column;
//     gap: 15px;
//     z-index: 2;
//
//     @media (max-width: 768px) {
//         width: 90%;
//         max-width: 320px;
//         bottom: 80px;
//         gap: 12px;
//     }
//
//     @media (max-width: 480px) {
//         width: 95%;
//         max-width: 280px;
//         bottom: 40px;
//         gap: 10px;
//     }
// `;
//
const BaseButton = styled.button`
    width: 100%;
    height: 54px;
    border: none;
    border-radius: 27px;
    cursor: pointer;
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.25;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
        transition: all 0.1s ease;
    }

    @media (max-width: 768px) {
        height: 50px;
        font-size: 13px;
    }

    @media (max-width: 480px) {
        height: 48px;
        font-size: 12px;
        border-radius: 24px;
    }
`;
//
const EmailButton = styled(BaseButton)`
    background: linear-gradient(135deg, #2D8779 0%, #1f6b5f 100%);
    color: #FFFFFF;
    border: 1px solid #2D8779;

    &:hover {
        background: linear-gradient(135deg, #1f6b5f 0%, #145249 100%);
        box-shadow: 0 6px 20px rgba(45, 135, 121, 0.3);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }
`;

const KakaoButton = styled(BaseButton)`
    background: linear-gradient(135deg, #FEE500 0%, #f4d800 100%);

    &:hover {
        background: linear-gradient(135deg, #f4d800 0%, #e6c200 100%);
        box-shadow: 0 6px 20px rgba(254, 229, 0, 0.4);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }
`;

const KakaoText = styled.img`
    width: 125px;
    height: 32px;
    object-fit: contain;

    @media (max-width: 768px) {
        width: 115px;
        height: 28px;
    }

    @media (max-width: 480px) {
        width: 105px;
        height: 25px;
    }
`;

function HomePage() {
    const navigate = useNavigate();

    const handleEmailLogin = () => {
        navigate('/email-login');
    };
//
//     /**
//      * OAuth2 카카오 로그인 버튼 클릭 이벤트 핸들러
//      *
//      * Spring Security OAuth2를 통한 간단한 카카오 로그인 프로세스:
//      * 1. 백엔드의 OAuth2 엔드포인트로 팝업 리다이렉트
//      * 2. 카카오 로그인 후 백엔드에서 JWT 토큰 생성
//      * 3. 콜백 페이지에서 토큰 수신 및 저장
//      * 4. 메인 페이지로 이동
//      */
//     const handleKakaoLogin = () => {
//         console.log('OAuth2 카카오로 시작하기 클릭됨');
//         console.log('🔄 현재 창에서 카카오 로그인 페이지로 이동');
//
//         // 🎯 카카오 로그인 시도 기록 (성공 감지용)
//         markKakaoLoginAttempt();
//
//         // 현재 창에서 직접 카카오 로그인으로 이동
//         // 로그인 완료 후 백엔드에서 /oauth/kakao 콜백으로 리다이렉트됨
//         oauth2KakaoApi.startLogin();
//     };

    return (
        // <AppContainer>
        //     <LoginFrame>
        //         <LogoSection>
        //             <BackgroundShapes>
        //                 <Shape1 />
        //                 <Shape4 />
        //             </BackgroundShapes>
        //
        //             <LogoContent>
        //                 <LogoContainer>
        //                     <Logo src={process.env.PUBLIC_URL + "/images/logo-280a0a.png"} alt="ROUND & GO Logo" />
        //                 </LogoContainer>
        //                 <Title>ROUND & GO</Title>
        //             </LogoContent>
        //         </LogoSection>
        //
        //         <Shape2 />
        //
        //         <ButtonContainer>
        //             <EmailButton onClick={handleEmailLogin}>
        //                 이메일로 시작하기
        //             </EmailButton>
        //
        //             <KakaoButton onClick={handleKakaoLogin}>
        //                 <KakaoText src={process.env.PUBLIC_URL + "/images/kakao-text-57a9c7.png"} alt="카카오로 시작하기" />
        //             </KakaoButton>
        //         </ButtonContainer>
        //
        //         <BottomShapeContainer>
        //             <Shape3 />
        //         </BottomShapeContainer>
        //     </LoginFrame>
        // </AppContainer> linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);

        <>
            <div style={{background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)'}}>
                <div style={{
                    overflowY: 'hidden',
                    backgroundImage: `url(${bgIcon})`,
                    position: 'relative',
                    width: '100%',
                    minHeight: '100vh',
                    objectFit: 'cover',
                    backgroundRepeat: 'no-repeat, no-repeat',
                    backgroundPosition: 'left top, left bottom',
                }}>
                    <div className='buttons' style={{position: 'absolute', bottom: '10%', zIndexs: 3, width: '100%'}}>
                        <div style={{
                            width: '90%',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            <button style={{
                                width: '100%',
                                maxWidth: '380px',
                                border: 'none',
                                borderRadius: '27px',
                                backgroundColor: '#2d8779',
                                padding: '12px',
                                fontSize: '14px',
                                color: '#fff'
                            }} onClick={handleEmailLogin}>로그인
                            </button>
                            <button style={{
                                width: '100%',
                                maxWidth: '380px',
                                border: 'none',
                                borderRadius: '27px',
                                backgroundColor: '#fee500',
                                padding: '0 12px',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                fontSize: '14px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <img src={kakao} alt='카카오 로고'/>
                                <p>카카오로 시작하기</p>
                            </button>
                            <p style={{
                                width: '90%',
                                maxWidth: '380px',
                                color: '#2d8779',
                                fontSize: '14px',
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