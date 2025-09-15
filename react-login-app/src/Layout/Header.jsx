// Header.jsx
import React, { useState, useEffect } from 'react';
import Logo from '../Main/logo.svg'; // logo
import GreenLogo from '../Image/Layout/Header/greenlogo.svg';
import ArrowBtn from '../Common/WhiteArrow.svg';
import { useNavigate } from 'react-router-dom';

import './Layout.css';

function Header({
                    NoActLogo = Logo,
                    ActLogo= GreenLogo,
                    TitleText = "ROUND & GO",
                    versionClassName = 'LogoVer',
                    WhiteArrow= ArrowBtn,
                    showLogo = true,
                    showArrow = false,
                }) {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 0); // 스크롤이 0 이상일 때 true
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // 클린업
    }, []);

    const goTo = (path) => {
        navigate(path);
    };


    return (
        <div className="Header" style={{
            background: isScrolled
                ? 'linear-gradient(180deg, rgba(51, 188, 123, 0.79) 3%, rgba(104, 194, 151, 0.490385) 40%, rgba(255, 255, 255, 0) 100%)'
                : '#269962',
            color: isScrolled ? '#2C8C7D' : '#fff',
            transition: 'background 0.5s, color 0.5s'
        }}>
            <div className="Header_logo">
                <div className={versionClassName}> {/* ArrowVer, LogoVer */}
                    {showArrow && (<img className='ArrowImg' onClick={() => navigate(-1)} src={WhiteArrow} alt='arrow'/>)}
                    {showLogo && (<img className='LogoImg' onClick={() => goTo('/main')} src={isScrolled ? ActLogo : NoActLogo} alt="logo"/>)}

                    <div className='text'>
                        <p>{TitleText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
