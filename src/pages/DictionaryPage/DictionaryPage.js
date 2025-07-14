import React, { useState } from 'react';
import './DictionaryPage.css';

const DictionaryPage = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <div className={`dictionary-page-container ${isFullScreen ? 'fullscreen' : ''}`}>
            <button onClick={toggleFullScreen}>
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
            <h1>Dictionary</h1>
        </div>
    );
};

export default DictionaryPage;
