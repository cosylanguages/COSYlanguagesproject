import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';

const StudentDashboard = () => {
  const { t } = useI18n();

  return (
    <div className="student-dashboard-container">
      <h2>
        <TransliterableText text={t('studyMode.studentDashboardHeading', 'Student Dashboard')} />
      </h2>
      <p>
        <TransliterableText text={t('studyMode.studentDashboardComingSoon', 'Create your own flashcard sets for further practice (Coming Soon).')} />
      </p>
      {/* Future student-specific UI will go here */}
    </div>
  );
};

export default StudentDashboard;
