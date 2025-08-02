import React, { useState } from 'react';
import './CopyCodeCTA.css';

const CopyCodeCTA = () => {
    const [copied, setCopied] = useState(false);
    const accessCode = "COSY-FRIEND-2024";

    const handleCopy = () => {
        navigator.clipboard.writeText(accessCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <div className="copy-code-cta">
            <h3>Share the Love of Languages!</h3>
            <p>Share this code with a teacher or a friend to give them a discount on their first month!</p>
            <div className="code-container">
                <span className="access-code">{accessCode}</span>
                <button onClick={handleCopy} className="copy-button">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

export default CopyCodeCTA;
