import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackBtn from './BackArrowGR.svg';

function DetailNavbar({ onTabChange, activeTab }) {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="DetailNavbar" style={{
            height: '60px',
            width: '100%',
            background: "#FFFFFF",
            boxShadow: "0px 0px 6px rgba(45, 135, 121, 0.5)",
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 20px',
            boxSizing: 'border-box',
        }}>
            <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={handleBackClick}
            >
                <img src={BackBtn} alt="뒤로가기" style={{ width: '30px', height: '30px' }} />
            </div>

            <div>
                <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    gap: '15px',
                    margin: 0,
                    padding: 0,
                    marginLeft: '30px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                }}>
                    <li onClick={() => onTabChange('accommodation')} style={{
                        borderBottom: activeTab === 'accommodation' ? '4px solid #2C8C7D' : 'none',
                    }}>
                        숙소
                    </li>
                    <li onClick={() => onTabChange('restaurant')} style={{
                        borderBottom: activeTab === 'restaurant' ? '4px solid #2C8C7D' : 'none',
                    }}>
                        음식점
                    </li>
                    <li onClick={() => onTabChange('tourism')} style={{
                        borderBottom: activeTab === 'tourism' ? '4px solid #2C8C7D' : 'none',
                    }}>
                        놀거리
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default DetailNavbar;
