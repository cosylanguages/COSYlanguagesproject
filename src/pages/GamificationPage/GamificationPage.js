import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import ProgressDashboard from '../../components/Gamification/ProgressDashboard';
import './GamificationPage.css';

const GamificationPage = () => {
  const { t } = useI18n();

  return (
    <div className="gamification-page">
      <h1><TransliterableText text={t('gamificationPage.title', 'Your Progress')} /></h1>
      <ProgressDashboard />
    </div>
  );
};

export default GamificationPage;
