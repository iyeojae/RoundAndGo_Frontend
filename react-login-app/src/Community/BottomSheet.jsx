// BottomSheet.jsx

import React from 'react';

function BottomSheet({
                         show,
                         onClose,
                         type, // 'comment' | 'post'
                         isAuthor,
                         onEdit,
                         onDelete,
                         onReport,
                         onShare
                     }) {
    if (!show) return null;

    return (
        <div className="bottom-sheet" onClick={onClose}>
            <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
                {isAuthor ? (
                    <>
                        <button onClick={onEdit}>수정하기</button>
                        <button onClick={onDelete}>삭제하기</button>
                    </>
                ) : (
                    <>
                        <button onClick={onReport}>신고하기</button>
                        <button onClick={onShare}>공유하기</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BottomSheet;
