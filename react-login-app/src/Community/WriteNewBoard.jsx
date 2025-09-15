import React from 'react';
import { useNavigate } from 'react-router-dom';
import'./CommunityWrite.css';


function WriteNewBoard() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    return (
        <main>
            {/* 새 글 작성 버튼 */}
            <div className='WriteBtn'>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <button onClick={() => goTo('/community/write')} className="write-button">
                        <span>+</span>
                        <p>새 글 쓰기</p>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default WriteNewBoard;