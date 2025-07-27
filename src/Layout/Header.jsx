// Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import logo from '../Main/logo.svg'; // logo
// 로고 -> o, 알림버튼 -> x

function Header() {
    return (
        <div className="Header" style={{ height: '60px', width: '100%', backgroundImage : 'linear-gradient(#269962 0%, #2C8C7D 100%)', display: 'flex', flexDirection : 'row'}}>
            <div className="Header_logo" style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                <img src={logo} alt="logo" style={{width: '26px', height: '25px', margin: 'auto 0', paddingLeft: '19px'}}/>
                <p style={{color: 'white', fontSize: '10px', height: '10px', fontWeight: '550', padding: '0', margin: 'auto 0'}}>ROUND & GO</p>
            </div>
        </div>
    );
}

export default Header;