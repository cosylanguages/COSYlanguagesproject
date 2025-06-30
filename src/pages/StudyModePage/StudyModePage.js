import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import RoleSelector from './RoleSelector'; // Import the actual RoleSelector component
import StudentDashboard from './StudentDashboard'; // Import actual StudentDashboard
import TeacherDashboard from './TeacherDashboard'; // Import actual TeacherDashboard
import TransliterableText from '../../components/Common/TransliterableText'; 

import './StudyModePage.css'; 

const StudyModePage = () => {
  const { t } = useI18n();
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

  // Placeholder for ToggleLatinizationButton until it's fully created in Phase 2
  const ToggleLatinizationButton = () => <button style={{marginLeft: '10px'}}>Toggle Latinization (Placeholder)</button>;

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
        <ToggleLatinizationButton />
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
