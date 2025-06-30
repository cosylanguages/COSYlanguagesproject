import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
// import './RoleSelector.css'; // Optional: if specific styling is needed beyond StudyModePage.css

const RoleSelector = ({ onSelectRole, currentRole }) => {
  const { t } = useI18n();

  // Determine class for buttons based on currentRole
  const getButtonClass = (role) => {
    let classes = "role-btn"; // Base class
    if (role === currentRole) {
      classes += " active-role-btn"; // Active class
    }
    // Add specific role class for individual styling if needed
    if (role === 'student') {
      classes += " student-role-btn";
    } else if (role === 'teacher') {
      classes += " teacher-role-btn";
    }
    return classes;
  };

  return (
    <div className="role-selector-container">
      {/* Label is now part of StudyModePage.js structure, can be added here if preferred */}
      {/* <label className="role-selector-label">
        <TransliterableText text={t('studyMode.chooseYourRole', '👤 Choose Your Role:')} />
      </label> */}
      <div className="role-buttons-wrapper"> {/* Inspired by 'practice-types' from old HTML */}
        <button 
          id="student-role-btn" 
          className={getButtonClass('student')}
          onClick={() => onSelectRole('student')}
        >
          <TransliterableText text={t('studyMode.studentRole', '🧑‍🎓 Student')} />
        </button>
        <button 
          id="teacher-role-btn" 
          className={getButtonClass('teacher')}
          onClick={() => onSelectRole('teacher')}
        >
          <TransliterableText text={t('studyMode.teacherRole', '🧑‍🏫 Teacher')} />
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
