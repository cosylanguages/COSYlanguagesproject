import React, { useState } from 'react';
import './IrregularVerbsPage.css';

const IrregularVerbsPage = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <div className={`irregular-verbs-page-container ${isFullScreen ? 'fullscreen' : ''}`}>
            <button onClick={toggleFullScreen}>
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
            <h1>Irregular Verbs</h1>
        </div>
    );
};

export default IrregularVerbsPage;
