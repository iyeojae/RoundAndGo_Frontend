// Footer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

import {
    ActiveAI, NonActiveAI,
    ActiveCal, NonActiveCal,
    ActiveCommunity, NonActiveCommunity,
    ActiveHome, NonActiveHome,
    ActiveMy, NonActiveMy,
} from "../assets/FooterImg";

// 아이콘 클릭 시 푸딩처럼 좌우로 흔들리는 애니메이션 정의
const jellyAnimation = keyframes`
    0% { transform: scale(1, 1); }
    15% { transform: scale(1.25, 0.75); }
    30% { transform: scale(0.75, 1.25); }
    45% { transform: scale(1.15, 0.85); }
    60% { transform: scale(0.95, 1.05); }
    75% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1, 1); }
`;

const FooterWrapper = styled.div`
    position: sticky;
    bottom: 0;
    width: 100%;
    aspect-ratio: 440 / 90;
    background-color: #fff;
    box-shadow: 0 -15px 27.5px -15px rgba(0, 141, 52, 0.25);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    overflow: hidden;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    transition: ease-in 0.3s;

    img {
        margin-bottom: 0.5rem;
        transition: 0.5s;

        // 푸딩 애니메이션
        ${({ active }) => active && css`
            animation: ${jellyAnimation} 1s ease;
        `}
    }

    p {
        font-size: 0.65rem;
        font-weight: ${({ active }) => (active ? '600' : '500')};
        color: ${({ active }) => (active ? '#269962' : '#797979')};
        margin: 0;
    }
`;

const menuItems = [
    { name: 'home', path: '/main', img: NonActiveHome, imgAct: ActiveHome, label: '홈' },
    { name: 'community', path: '/community', img: NonActiveCommunity, imgAct: ActiveCommunity, label: '커뮤니티' },
    { name: 'course', path: '/course', img: NonActiveAI, imgAct: ActiveAI, label: '코스추천' },
    { name: 'calender', path: '/schedule', img: NonActiveCal, imgAct: ActiveCal, label: '일정' },
    { name: 'my', path: '/mypage', img: NonActiveMy, imgAct: ActiveMy, label: '마이페이지' }
];

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeMenu, setActiveMenu] = useState('home');

    useEffect(() => {
        const path = location.pathname;
        const matchedMenu = menuItems.find(item => item.path === path);
        if (matchedMenu) {
            setActiveMenu(matchedMenu.name);
        }
    }, [location.pathname]);

    const handleButtonClick = useCallback((menuName, path) => {
        setActiveMenu(menuName);
        navigate(path);
    }, [navigate]);

    return (
        <FooterWrapper>
            <ButtonContainer>
                {menuItems.map(item => (
                    <MenuButton
                        key={item.name}
                        onClick={() => handleButtonClick(item.name, item.path)}
                        active={activeMenu === item.name}
                    >
                        <img
                            // key 변경을 통해 애니메이션 재실행 트리거
                            key={activeMenu === item.name ? `${item.name}-active` : `${item.name}-inactive`}
                            src={activeMenu === item.name ? item.imgAct : item.img}
                            alt={item.name}
                        />
                        <p>{item.label}</p>
                    </MenuButton>
                ))}
            </ButtonContainer>
        </FooterWrapper>
    );
}

export default Footer;
