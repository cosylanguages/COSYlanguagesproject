import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { I18nProvider } from '../i18n/I18nContext';
import { LatinizationProvider } from '../contexts/LatinizationContext';
import PinEntry from '../components/StudyMode/PinEntry';
import { AuthProvider } from '../contexts/AuthContext';

// --- Study Mode App ---
const StudyModeApp = () => {
    const [pinVerified, setPinVerified] = useState(false);

    const handlePinVerified = () => {
        setPinVerified(true);
    };

    if (!pinVerified) {
        return <PinEntry onPinVerified={handlePinVerified} />;
    }

    return (
        <div>
            {/* The rest of the study mode components will be rendered here */}
            <h2>Study Mode</h2>
        </div>
    );
};

// --- Main Mounting & Event Handling Logic ---
function mountStudyIslands() {
    const studyContainer = document.getElementById('study-mode-container');
    if (studyContainer) {
        ReactDOM.render(<I18nProvider><LatinizationProvider><AuthProvider><StudyModeApp /></AuthProvider></LatinizationProvider></I18nProvider>, studyContainer);
    }
}

// Wait for the DOM to be fully loaded before trying to mount the islands
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') { // Document is still loading
        document.addEventListener('DOMContentLoaded', mountStudyIslands);
    } else { // Document has already loaded
        mountStudyIslands();
    }
}
