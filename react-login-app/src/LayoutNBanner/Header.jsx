import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

import Logo from '../assets/logo.svg'; // logo
import GreenLogo from '../assets/greenlogo.svg';
import ArrowBtn from '../assets/WhiteArrow.svg';

import { ScreenSizeContext } from '../Common/ScreenSizeContext';

function Header({
                    NoActLogo = Logo,
                    ActLogo = GreenLogo,
                    TitleText = "ROUND & GO",
                    versionClassName = 'LogoVer', // 'ArrowVer' 가능
                    WhiteArrow = ArrowBtn,
                    showLogo = true,
                    showArrow = false,
                    isScrolled,
                    onArrowClick,
                }) {
    const navigate = useNavigate();
    const { isTablet } = useContext(ScreenSizeContext);

    const goTo = (path) => {
        navigate(path);
    };

    const [animateOnce, setAnimateOnce] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateOnce(false);
        }, 1500); // 애니메이션 종료 후 원래 스타일로 전환

        return () => clearTimeout(timer);
    }, []);

    return (
        <StyledHeader isScrolled={isScrolled} animateOnce={animateOnce}>
            <HeaderLogoWrapper>
                <VersionWrapper className={versionClassName} isTablet={isTablet}>
                    {showArrow && (
                        <ArrowImg
                            isTablet={isTablet}
                            onClick={onArrowClick ? onArrowClick : () => navigate(-1)}
                            src={WhiteArrow}
                            alt='arrow'
                        />
                    )}
                    {showLogo && (
                        <LogoImg
                            isTablet={isTablet}
                            onClick={() => goTo('/main')}
                            src={isScrolled ? ActLogo : NoActLogo}
                            alt="logo"
                        />
                    )}
                    <div className='text'>
                        <p isTablet={isTablet}>{TitleText}</p>
                    </div>
                </VersionWrapper>
            </HeaderLogoWrapper>
        </StyledHeader>
    );
}

export default Header;

const StyledHeader = styled.header`
    position: sticky;
    top: 0;
    z-index: 5;
    width: 100%;
    aspect-ratio: 440 / 63;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${({ isScrolled }) => (isScrolled ? '#2C8C7D' : '#fff')};
    transition: background 0.8s, color 0.8s;

    background: ${({ isScrolled }) =>
            isScrolled
                    ? 'linear-gradient(180deg, rgba(51, 188, 123, 0.79) 3%, rgba(104, 194, 151, 0.490385) 40%, rgba(255, 255, 255, 0) 100%)'
                    : '#269962'};

    ${({ animateOnce }) =>
            animateOnce &&
            css`
                animation: ${shineAnimation} 2.5s ease-in-out forwards;
            `}
`;


const HeaderLogoWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const VersionWrapper = styled.div`
    width: 90%;
    margin: 3% auto -1% auto;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    position: relative;

    &.LogoVer .text {
        position: static;
        text-align: left;
    }

    &.ArrowVer .text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: max-content;
    }

    &.ArrowVer p {
        font-size: ${({ isTablet }) =>
                isTablet ? 'clamp(18px, 3vw, 20px)' : 'clamp(14px, 2.5vw, 16px)'};
        font-weight: 550;
    }

    &.LogoVer p {
        font-size: ${({ isTablet }) =>
                isTablet ? 'clamp(14px, 3vw, 18px)' : 'clamp(10px, 2.5vw, 13px)'};
        font-weight: 500;
    }

    p {
        color: inherit;
        padding: 0;
        margin: 0;
    }
`;

const ArrowImg = styled.img`
    display: block;
    margin: 0;
    padding: 0;
    transform: scaleX(-1);
    width: ${({ isTablet }) =>
            isTablet ? 'clamp(20px, 3vw, 24px)' : 'clamp(16px, 2.5vw, 20px)'};
    height: auto;
    cursor: pointer;
`;

const LogoImg = styled.img`
    display: block;
    margin: 0;
    padding: 0;
    width: ${({ isTablet }) =>
            isTablet ? 'clamp(30px, 3vw, 34px)' : 'clamp(26px, 2.5vw, 30px)'};
    height: auto;
    cursor: pointer;
`;

const shineAnimation = keyframes`
    0% {
        background: linear-gradient(90deg, #0D3321 0%, #269962 100%);
        background-size: 200% 100%;
        background-position: 100% 0;
    }
    50% {
        background: linear-gradient(90deg, #0D3321 0%, #90ffc9 50%, #269962 100%);
        background-size: 200% 100%;
        background-position: 0 0;
    }
    100% {
        background: linear-gradient(90deg, #269962 0%, #269962 100%);
        background-size: 200% 100%;
        background-position: 0 0;
    }
`;
