// Footer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './Layout.css';
import {
    ActiveAI, NonActiveAI,
    ActiveCal, NonActiveCal,
    ActiveCommunity, NonActiveCommunity,
    ActiveHome, NonActiveHome,
    ActiveMy, NonActiveMy,
} from "../Image/Layout/Footer/FooterImg"; // 서비스 푸터 내 비활성화/활성화 아이콘



const menuItems = [
    { name: 'home', path: '/main', img: NonActiveHome, imgAct: ActiveHome, label: '홈' },
    { name: 'community', path: '/community', img: NonActiveCommunity, imgAct: ActiveCommunity, label: '커뮤니티' },
    { name: 'course', path: '/course', img: NonActiveAI, imgAct: ActiveAI, label: '코스추천' },
    { name: 'calender', path: '/schedule', img: NonActiveCal, imgAct: ActiveCal, label: '일정' },
    { name: 'my', path: '/mypage', img: NonActiveMy, imgAct: ActiveMy, label: '마이페이지' }
];

function Footer() {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 경로

    const [activeMenu, setActiveMenu] = useState('Home');

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
        <div id='Footer' className="Footer">
            <div className="buttons">

                {menuItems.map(item => (
                    <button
                        key={item.name}
                        className={item.name}
                        onClick={() => handleButtonClick(item.name, item.path)}>
                        <img src={activeMenu === item.name ? item.imgAct : item.img} alt={item.name}/>
                        <p style={{
                            fontWeight: activeMenu === item.name ? '600' : 'normal',
                            color: activeMenu === item.name ? '#269962' : '#797979',
                        }}>
                            {item.label}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Footer;


