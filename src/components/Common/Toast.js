import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onDone }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onDone) {
                    onDone();
                }
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onDone]);

    if (!message) {
        return null;
    }

    return (
        <div className={`toast ${type} ${visible ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Toast;
