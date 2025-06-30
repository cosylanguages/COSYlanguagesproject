import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';

const TeacherDashboard = () => {
  const { t } = useI18n();

  return (
    <div className="teacher-dashboard-container">
      <h2>
        <TransliterableText text={t('studyMode.teacherDashboardHeading', 'Teacher Dashboard')} />
      </h2>
      <p>
        <TransliterableText text={t('studyMode.teacherDashboardComingSoon', 'Create, edit, and add material (Coming Soon).')} />
      </p>
      {/* Future teacher-specific UI will go here */}
    </div>
  );
};

export default TeacherDashboard;
