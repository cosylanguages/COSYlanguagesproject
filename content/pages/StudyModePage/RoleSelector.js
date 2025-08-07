import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useStudy } from '../../contexts/StudyContext';
import TransliterableText from '../../components/Common/TransliterableText';
import Button from '../../components/Common/Button';
import HelpModal from '../../components/Common/HelpModal';

const RoleSelector = () => {
  const { t } = useI18n();
  const { selectedRole, setSelectedRole } = useStudy();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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
        <Button
          id="student-role-btn"
          className={getButtonClass('student')}
          onClick={() => setSelectedRole('student')}
          aria-pressed={selectedRole === 'student'}
        >
          <TransliterableText text={t('studyMode.studentRole', '🧑‍🎓 Student')} />
        </Button>
        <Button
          id="teacher-role-btn"
          className={getButtonClass('teacher')}
          onClick={() => setSelectedRole('teacher')}
          aria-pressed={selectedRole === 'teacher'}
        >
          <TransliterableText text={t('studyMode.teacherRole', '🧑‍🏫 Teacher')} />
        </Button>
        <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
      </div>
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="roleSelector.help.title"
        content="roleSelector.help.content"
      />
    </div>
  );
};

export default RoleSelector;
