// ./Community/WriteNewBoard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function WriteNewBoard() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path);
    };

    return (
        // 불필요한 중첩 div 제거 및 스타일 단순화
        <div className='WriteBtnContainer' style={{ position: 'absolute', bottom: '3%', left: '50%' }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}> {/* 새롭게 추가된 클래스 */}
                <button onClick={() => goTo('/community/write')} className="write-button">
                    <span>+</span>
                    <p>새 글 쓰기</p>
                </button>
            </div>
        </div>
    );
}

export default WriteNewBoard;