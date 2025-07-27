// Footer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 홈, 맵, 커뮤니티, 마이페이지의 비활성화/활성화 아이콘
import HomeIcon from './HomeIcon.svg';
import HomeIconAct from './HomeIconAct.svg';
import MapIcon from './MapIcon.svg';
import MapIconAct from './MapIconAct.svg';
import CommunityIcon from './CommunityIcon.svg';
import CommunityIconAct from './CommunityIconAct.svg';
import MypageIcon from './MypageIcon.svg';
import MypageIconAct from './MypageIconAct.svg';


const menuItems = [
    { name: 'Home', path: '/main', img: HomeIcon, imgAct: HomeIconAct, label: '홈' },
    { name: 'Map', path: '/map', img: MapIcon, imgAct: MapIconAct, label: '코스추천' },
    { name: 'Community', path: '/community', img: CommunityIcon, imgAct: CommunityIconAct, label: '커뮤니티' },
    { name: 'Mypage', path: '/mypage', img: MypageIcon, imgAct: MypageIconAct, label: '마이페이지' }
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
        <div className="Footer"
             style={{
                 height: '80px',
                 minWidth: '330px',
                 maxWidth: '440px',
                 width: '100%',
                 position: 'fixed',
                 bottom: 0,
                 backgroundColor: '#fff',
                 boxShadow: '0 0px 27.5px rgba(0,141,52,0.25)',
                 borderTopLeftRadius: '40px',
                 borderTopRightRadius: '40px',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 zIndex: 10,
                 overflow: 'hidden'
             }}>
            <div className="buttons" style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                maxWidth: '440px',
                padding: '0 10px'
            }}>

                {menuItems.map(item => (
                    <button
                        key={item.name}
                        className={item.name}
                        onClick={() => handleButtonClick(item.name, item.path)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '5px',
                            width: 'auto',
                            height: '100%',
                        }}
                    >
                        <img
                            style={{
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain',
                                marginBottom: '4px'
                            }}
                            src={activeMenu === item.name ? item.imgAct : item.img}
                            alt={item.name}
                        />
                        <p style={{
                            fontSize: '12px',
                            fontWeight: activeMenu === item.name ? '600' : 'normal',
                            color: activeMenu === item.name ? '#269962' : '#797979',
                            margin: '0'
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


