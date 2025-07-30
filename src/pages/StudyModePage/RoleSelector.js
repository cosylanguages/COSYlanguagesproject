import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useStudy } from '../../contexts/StudyContext';
import TransliterableText from '../../components/Common/TransliterableText';

const RoleSelector = () => {
  const { t } = useI18n();
  const { selectedRole, setSelectedRole } = useStudy();

  const getButtonClass = (role) => {
    let classes = "role-btn";
    if (role === selectedRole) {
      classes += " active-role-btn";
    }
    if (role === 'student') {
      classes += " student-role-btn";
    } else if (role === 'teacher') {
      classes += " teacher-role-btn";
    }
    return classes;
  };

  return (
    <div className="role-selector-container">
      <div className="role-buttons-wrapper">
        <button
          id="student-role-btn"
          className={getButtonClass('student')}
          onClick={() => setSelectedRole('student')}
          aria-pressed={selectedRole === 'student'}
        >
          <TransliterableText text={t('studyMode.studentRole', '🧑‍🎓 Student')} />
        </button>
        <button
          id="teacher-role-btn"
          className={getButtonClass('teacher')}
          onClick={() => setSelectedRole('teacher')}
          aria-pressed={selectedRole === 'teacher'}
        >
          <TransliterableText text={t('studyMode.teacherRole', '🧑‍🏫 Teacher')} />
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
