import React, { useState } from 'react';
import Popular from '../../Common/Community/Popular.jsx';

function TabButtons() {
    const [activeTab, setActiveTab] = useState('written');

    const commonStyle = {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#aaa',
        transition: 'all 0.2s ease',
        flex: 1,
    };

    const activeStyle = {
        color: '#fff',
        backgroundColor: '#269962',
    };

    const leftRounded = {
        borderRadius: '10px 0 0 10px',
    };

    const rightRounded = {
        borderRadius: '0 10px 10px 0',
    };

    return (
        <div
            style={{
                display: 'flex',
                backgroundColor: '#dfdfdf',
                borderRadius: '10px',
                overflow: 'hidden',
                width: '90%',
                margin: '8% 5% 5% 5%'
            }}
        >
            <button
                onClick={() => setActiveTab('written')}
                style={{
                    ...commonStyle,
                    ...(activeTab === 'written' ? activeStyle : {}),
                    ...(activeTab === 'written' ? leftRounded : {}),
                }}
            >
                내가 쓴 글
            </button>
            <button
                onClick={() => setActiveTab('commented')}
                style={{
                    ...commonStyle,
                    ...(activeTab === 'commented' ? activeStyle : {}),
                    ...(activeTab === 'commented' ? rightRounded : {}),
                }}
            >
                댓글 단 글
            </button>
        </div>
)
    ;
}

export default TabButtons;
