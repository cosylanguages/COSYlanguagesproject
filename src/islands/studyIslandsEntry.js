import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { LatinizationProvider } from '../contexts/LatinizationContext';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import RoleSelector from '../pages/StudyModePage/RoleSelector';
import StudentDashboard from '../pages/StudyModePage/StudentDashboard';
import TeacherDashboard from '../pages/StudyModePage/TeacherDashboard';
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

// --- Role Island ---
const RoleIsland = () => {
    const handleRoleSelect = (role) => {
        globalSelectedRole = role;
        window.dispatchEvent(new CustomEvent('roleChange', { detail: { selectedRole: role } }));
    };

    return <RoleSelector onSelectRole={handleRoleSelect} />;
};

// --- Dashboard Island ---
const DashboardIsland = () => {
    const [role, setRole] = useState(globalSelectedRole);

    useEffect(() => {
        const handleRoleChange = (event) => {
            setRole(event.detail.selectedRole);
        };

        window.addEventListener('roleChange', handleRoleChange);

        return () => {
            window.removeEventListener('roleChange', handleRoleChange);
        };
    }, []);

    if (role === 'student') {
        return <StudentDashboard />;
    } else if (role === 'teacher') {
        return <TeacherDashboard />;
    } else {
        return null;
    }
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
    const languageContainer = document.getElementById('language-selector-island');
    const roleContainer = document.getElementById('role-selector-island');
    const dashboardContainer = document.getElementById('dashboard-island');
    const lessonSectionsPanelContainer = document.getElementById('lesson-sections-panel-island');
    const toolsPanelContainer = document.getElementById('tools-panel-island');

    if (languageContainer) {
        ReactDOM.render(<I18nProvider><LatinizationProvider><LanguageIsland /></LatinizationProvider></I18nProvider>, languageContainer);
    }

    if (roleContainer) {
        ReactDOM.render(<I18nProvider><LatinizationProvider><RoleIsland /></LatinizationProvider></I18nProvider>, roleContainer);
    }

    if (dashboardContainer) {
        ReactDOM.render(<I18nProvider><LatinizationProvider><AuthProvider><DashboardIsland /></AuthProvider></LatinizationProvider></I18nProvider>, dashboardContainer);
    }

    if (lessonSectionsPanelContainer) {
        ReactDOM.render(<I18nProvider><LatinizationProvider><AuthProvider><LessonSectionsPanelIsland /></AuthProvider></LatinizationProvider></I18nProvider>, lessonSectionsPanelContainer);
    }

    if (toolsPanelContainer) {
        ReactDOM.render(<I18nProvider><LatinizationProvider><ToolsPanel /></LatinizationProvider></I18nProvider>, toolsPanelContainer);
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
