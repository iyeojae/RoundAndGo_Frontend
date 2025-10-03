// Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '../assets/logo.svg'; // logo
import GreenLogo from '../assets/greenlogo.svg';
import ArrowBtn from '../assets/WhiteArrow.svg';

// 헤더 스타일링
const StyledHeader = styled.header`
    position: sticky;
    top: 0;
    z-index: 5;
    width: 100%;
    aspect-ratio: 440 / 63;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: ${({ isScrolled }) =>
            isScrolled
                    ? 'linear-gradient(180deg, rgba(51, 188, 123, 0.79) 3%, rgba(104, 194, 151, 0.490385) 40%, rgba(255, 255, 255, 0) 100%)'
                    : '#269962'};
    color: ${({ isScrolled }) => (isScrolled ? '#2C8C7D' : '#fff')};
    transition: background 0.5s, color 0.5s;
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
        font-size: 14px;
        font-weight: 550;
    }

    &.LogoVer p {
        font-size: 10px;
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
    width: 16px;
    height: auto;
    cursor: pointer;
`;

const LogoImg = styled.img`
    display: block;
    margin: 0;
    padding: 0;
    width: 26px;
    height: auto;
    cursor: pointer;
`;

function Header({
                    NoActLogo = Logo,
                    ActLogo = GreenLogo,
                    TitleText = "ROUND & GO",
                    versionClassName = 'LogoVer', // 'ArrowVer' 가능
                    WhiteArrow = ArrowBtn,
                    showLogo = true,
                    showArrow = false,
                }) {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const goTo = (path) => {
        navigate(path);
    };

    return (
        <StyledHeader isScrolled={isScrolled}>
            <HeaderLogoWrapper>
                <VersionWrapper className={versionClassName}>
                    {showArrow && (
                        <ArrowImg onClick={() => navigate(-1)} src={WhiteArrow} alt='arrow' />
                    )}
                    {showLogo && (
                        <LogoImg onClick={() => goTo('/main')} src={isScrolled ? ActLogo : NoActLogo} alt="logo" />
                    )}
                    <div className='text'>
                        <p>{TitleText}</p>
                    </div>
                </VersionWrapper>
            </HeaderLogoWrapper>
        </StyledHeader>
    );
}

export default Header;
