import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import RoleSelector from './RoleSelector'; // Import the actual RoleSelector component
import StudentDashboard from './StudentDashboard'; // Import actual StudentDashboard
import TeacherDashboard from './TeacherDashboard'; // Import actual TeacherDashboard
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
        <label htmlFor="language-select" id="study-choose-language-label"> {/* Reinstated label, ensure 'language-select' is the id of the actual select input in LanguageSelector.js */}
          <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
        </label>
        <LanguageSelector /> 
        <ToggleLatinizationButton 
          currentDisplayLanguage={currentLangKey || language}
          style={{
            padding: '8px 18px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            marginLeft: '16px',
            boxShadow: '0 2px 8px rgba(78,84,200,0.15)',
            transition: 'background 0.3s, box-shadow 0.3s',
            fontWeight: 600
          }}
        />
      </div>

      <div className="study-menu-section">
        <label htmlFor="role-selector-buttons" id="study-choose-role-label"> 
            <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
        </label>
        <RoleSelector onSelectRole={handleRoleSelect} currentRole={selectedRole} />
      </div>
      
      <div className="study-content-area">
        {!selectedRole && (
          <p id="study-welcome-message"> {/* Added ID from old HTML for consistency if needed by CSS/tests */}
            <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
          </p>
        )}
        {selectedRole === 'student' && <StudentDashboard />}
        {selectedRole === 'teacher' && <TeacherDashboard />}
      </div>
    </div>
  );
};

export default StudyModePage;
