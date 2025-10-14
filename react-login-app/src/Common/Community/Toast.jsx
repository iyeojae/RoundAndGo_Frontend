import React, { useEffect, useState } from 'react';
import '../../Community/Community.css';

function Toast({ style, message, duration = 1000, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose(); // 부모에 알림
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className="toast" style={style}>
            {message}
        </div>
    );
}

export default Toast;
