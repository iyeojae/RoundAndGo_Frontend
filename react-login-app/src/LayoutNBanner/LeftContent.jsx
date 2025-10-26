// LeftContent.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/greenlogo.svg';
import Icon from '../assets/banner-icon.svg';
import { keyframes } from 'styled-components';
import { getCookie } from '../Login/utils/cookieUtils';

function LeftContent() {

    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(false);

    const handleLinkClick = () => {
        const token = getCookie('accessToken');
        if (token) {
            navigate('/course');
        } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 1500);
        }
    };

    return (
        <LeftWrapper>
            <ContentBox>
                <LogoWrapper>
                    <LogoImage src={Logo} alt="로고" />
                </LogoWrapper>

                <Title>AI가 찾아주는 여행코스</Title>
                <Description>당신의 골프여행이 더욱 특별해집니다!</Description>
                <StyledLink onClick={handleLinkClick}>
                    AI 추천 코스 보러가기 &gt;
                </StyledLink>
                <WarningText show={showWarning}>로그인 먼저 해주세요.</WarningText>

                <IconWrapper>
                    <IconImage src={Icon} alt="아이콘" />
                </IconWrapper>
            </ContentBox>
        </LeftWrapper>
    );
}

export default LeftContent;

const fadeSlideUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

const LeftWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    color: #000;
    z-index: 1;
`;

const ContentBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5%;
    position: absolute;
    left: 5%;
    bottom: 10%;
`;

const LogoWrapper = styled.div`
    position: relative;
    width: 100px;
    aspect-ratio: 10 / 15;
    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(
                120deg,
                rgba(255, 255, 255, 0) 40%,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(255, 255, 255, 0) 60%
        );
        animation: shine 3s linear infinite;
        pointer-events: none;
        mix-blend-mode: screen;
        z-index: 2;
        border-radius: 12px;
    }

    @keyframes shine {
        0% { left: -100%; opacity: 0; }
        50% { left: 100%; opacity: 1; }
        100% { left: 100%; opacity: 0; }
    }
`;

const LogoImage = styled.img`
    width: 7vw;
    aspect-ratio: 10 / 15;
`;

const Title = styled.h1`
    font-size: clamp(1.5rem, 1.67vw, 2.5rem);
    color: #595959;
    font-weight: bold;
    margin: 0;
    opacity: 0;
    animation: ${fadeSlideUp} 0.8s ease-out forwards;
    animation-delay: 0.2s;
`;

const Description = styled.p`
    font-size: clamp(1.125rem, 1.25vw, 2rem);
    color: #595959;
    font-weight: 350;
    margin: 0;
    opacity: 0;
    animation: ${fadeSlideUp} 0.8s ease-out forwards;
    animation-delay: 0.5s;
`;

const StyledLink = styled.span`
    font-size: clamp(0.875rem, 0.83vw, 1.25rem);
    color: #2C8C7D;
    font-weight: bold;
    margin-top: 3%;
    text-decoration: none;
    cursor: pointer;
    opacity: 0;
    animation: ${fadeSlideUp} 0.8s ease-out forwards;
    animation-delay: 1s;
    z-index: 5;
`;

const WarningText = styled.p`
    color: #e74c3c;
    font-size: 0.95rem;
    font-weight: bold;
    margin-top: 0.5rem;
    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 0.3s ease-in-out;
`;

const IconWrapper = styled.div`
    animation: float3D 5s ease-in-out infinite;
    transform-style: preserve-3d;
    @keyframes float3D {
        0% { transform: rotateX(0deg) rotateY(0deg) translateY(0px); }
        50% { transform: rotateX(3deg) rotateY(3deg) translateY(-10px); }
        100% { transform: rotateX(0deg) rotateY(0deg) translateY(0px); }
    }
`;

const IconImage = styled.img`
    margin-top: 10%;
    width: 30vw;
`;