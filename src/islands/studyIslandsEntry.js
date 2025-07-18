import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { LatinizationProvider } from '../contexts/LatinizationContext';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import PinEntry from '../components/StudyMode/PinEntry';
import LessonSectionsPanel from '../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../components/StudyMode/ToolsPanel';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// --- Global state for islands ---
let globalSelectedLanguage = null;
let globalSelectedRole = null;
let globalSelectedDayId = null;
let globalSelectedSectionId = null;

// --- Language Island ---
const LanguageIsland = () => {
    const { changeLanguage } = useI18n();

    const handleLanguageChange = (newLanguage) => {
        globalSelectedLanguage = newLanguage;
        changeLanguage(newLanguage);
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { selectedLanguage: newLanguage } }));
    };

    return <LanguageSelector onLanguageChange={handleLanguageChange} />;
};

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

// --- Lesson Sections Panel Island ---
const LessonSectionsPanelIsland = () => {
    const [selectedDayId, setSelectedDayId] = useState(globalSelectedDayId);

    useEffect(() => {
        const handleDayChange = (event) => {
            setSelectedDayId(event.detail.selectedDayId);
        };

        window.addEventListener('dayChange', handleDayChange);

        return () => {
            window.removeEventListener('dayChange', handleDayChange);
        };
    }, []);

    const handleSectionSelect = (sectionId) => {
        globalSelectedSectionId = sectionId;
        window.dispatchEvent(new CustomEvent('sectionChange', { detail: { selectedSectionId: sectionId } }));
    };

    return <LessonSectionsPanel selectedDayId={selectedDayId} onSectionSelect={handleSectionSelect} />;
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
