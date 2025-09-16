// LeftPanel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Image/Layout/Header/greenlogo.svg';

function LeftContent() {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: '2rem',
            color: '#000',
            zIndex: 1,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5%' }}>
                <img style={{ width: '100px', aspectRatio: '10 / 15' }} src={Logo} alt='로고' />
                <h1 style={{ fontSize: '2rem', color: '#595959', fontWeight: 'bold', margin: 0 }}>
                    AI가 찾아주는 여행코스
                </h1>
                <p style={{ fontSize: '1.5rem', color: '#595959', fontWeight: '350', margin: 0 }}>
                    당신의 골프여행이 더욱 특별해집니다!
                </p>
                <Link to="/course/recommendation" style={{
                    fontSize: '1rem',
                    color: '#2C8C7D',
                    fontWeight: 'bold',
                    marginTop: '3%',
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}>
                    AI 추천 코스 보러가기 &gt;
                </Link>
            </div>
        </div>
    );
}

export default LeftContent;
