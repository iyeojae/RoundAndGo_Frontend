// Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import logo from '../Main/logo.svg'; // logo
import { isLoggedIn, getUserNickname, getProfileImageUrl, logout } from '../authUtils';
import { useNavigate } from 'react-router-dom';
// 로고 -> o, 알림버튼 -> x

function Header() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // 로그인 상태 확인
        if (isLoggedIn()) {
            setUserInfo({
                nickname: getUserNickname(),
                profileImage: getProfileImageUrl()
            });
        } else {
            // 로그인되지 않은 상태라면 홈페이지로 리다이렉트
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = async () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            try {
                await logout();
                navigate('/');
            } catch (error) {
                console.error('로그아웃 처리 에러:', error);
                // 에러가 발생해도 홈페이지로 이동
                navigate('/');
            }
        }
    };

    return (
        <div className="Header" style={{ 
            height: '60px', 
            width: '100%', 
            backgroundImage: 'linear-gradient(#269962 0%, #2C8C7D 100%)', 
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div className="Header_logo" style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                <img src={logo} alt="logo" style={{width: '26px', height: '25px', margin: 'auto 0', paddingLeft: '19px'}}/>
                <p style={{color: 'white', fontSize: '10px', height: '10px', fontWeight: '550', padding: '0', margin: 'auto 0'}}>ROUND & GO</p>
            </div>
            
            {userInfo && (
                <div className="Header_user" style={{
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    gap: '8px',
                    paddingRight: '19px'
                }}>
                    {userInfo.profileImage && (
                        <img 
                            src={userInfo.profileImage} 
                            alt="프로필" 
                            style={{
                                width: '30px', 
                                height: '30px', 
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        />
                    )}
                    <span style={{
                        color: 'white', 
                        fontSize: '12px', 
                        fontWeight: '500'
                    }}>
                        {userInfo.nickname}님
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '10px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                        }}
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
}

export default Header;