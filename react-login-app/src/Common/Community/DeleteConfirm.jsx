// DeleteConfirm.js
import React from 'react';
import '../../Community/CommunityDetail.css';

import waste from '../../assets/wasteicon.svg';

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">
                    <img src={waste} alt='쓰레기통'/>
                </div>
                <h2>해당 글을 삭제하시겠습니까?</h2>
                <p className="warning">삭제된 게시글은 복구할 수 없습니다</p>
                <button className="confirm-btn" onClick={onConfirm}>확인</button>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
