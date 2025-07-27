// Footer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Home from './Home.svg'; // 홈, 맵, 커뮤니티, 마이페이지 비활성화/활성화 아이콘
import HomeAct from './HomeAct.svg';
import MapIcon from './MapIcon.svg';
import MapIconAct from './MapIconAct.svg';
import Community from './Community.svg';
import CommunityAct from './CommunityAct.svg';
import Mypage from './Mypage.svg';
import MypageAct from './MypageAct.svg';

const menuItems = [
    { name: 'Home', path: '/main', img: Home, imgAct: HomeAct },
    { name: 'Map', path: '/map', img: MapIcon, imgAct: MapIconAct },
    { name: 'Community', path: '/community', img: Community, imgAct: CommunityAct },
    { name: 'Mypage', path: '/mypage', img: Mypage, imgAct: MypageAct }
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
    }, [location.pathname]); // 경로 변경 시마다

    const handleButtonClick = useCallback((menuName, path) => {
        setActiveMenu(menuName);
        navigate(path);
    }, [navigate]);

    return (
        <div className="Footer"
             style={{
                 height: '60px',
                 minWidth: '330px',
                 maxWidth: '440px',
                 width: '100%',
                 position: 'fixed',
                 bottom: 0,
                 backgroundColor: '#fff',
                 padding: '10px 0',
                 boxShadow: '0 0 27.5px rgba(0, 141, 52, 0.25)',
                 borderTopLeftRadius: '30px',
                 borderTopRightRadius: '30px',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 zIndex: 10,
                 overflow: 'hidden'
             }}>
            <div className="buttons" style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                width: '100%',
                height: '70px',
                alignItems: 'center',
                padding: '0 10px',
                justifyContent: 'space-around'
            }}>
                {menuItems.map(item => (
                    <button
                        key={item.name}
                        className={item.name}
                        onClick={() => handleButtonClick(item.name, item.path)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <img
                            src={activeMenu === item.name ? item.imgAct : item.img}
                            alt={item.name}
                            style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain'
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Footer;