import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import RoleSelector from './RoleSelector'; // Import the actual RoleSelector component
import StudentDashboard from './StudentDashboard'; // Import actual StudentDashboard
import TeacherDashboard from './TeacherDashboard'; // Import actual TeacherDashboard
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel'; // Added
import ToolsPanel from '../../components/StudyMode/ToolsPanel'; // Added
import TransliterableText from '../../components/Common/TransliterableText'; 
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';

import './StudyModePage.css'; 

const StudyModePage = () => {
  const { t, language, currentLangKey } = useI18n();
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('selectedRole') || null; 
  });

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    } else {
      localStorage.removeItem('selectedRole'); 
    }
  }, [selectedRole]);

  const handleRoleSelect = (role) => {
    // Toggle role off if the same role is clicked again
    setSelectedRole(prevRole => prevRole === role ? null : role);
  };

  return (
    <div className="study-mode-page-container">
      <h1>
        <TransliterableText text={t('studyMode.mainHeading', 'COSYlanguages - Study Mode')} />
      </h1>
      
      <div className="study-menu-section">
        <label htmlFor="language-select" id="study-choose-language-label">
          <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
        </label>
        <LanguageSelector /> 
        <ToggleLatinizationButton 
          currentDisplayLanguage={currentLangKey || language}
        />
      </div>

      <div className="study-menu-section">
        <label htmlFor="role-selector-buttons" id="study-choose-role-label"> 
            <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
        </label>
        <RoleSelector onSelectRole={handleRoleSelect} currentRole={selectedRole} />
      </div>
      
      <div className="study-content-area">
        {!selectedRole ? (
          <p id="study-welcome-message">
            <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
          </p>
        ) : (
          <div className="dashboard-layout">
            <div className="layout-left-panel">
              <LessonSectionsPanel />
            </div>
            <div className="layout-center-panel">
              {selectedRole === 'student' && <StudentDashboard />}
              {selectedRole === 'teacher' && <TeacherDashboard />}
            </div>
            <div className="layout-right-panel">
              <ToolsPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModePage;
