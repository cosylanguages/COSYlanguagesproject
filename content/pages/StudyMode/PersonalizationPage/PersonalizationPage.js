import React from 'react';
import CustomLessonPlanner from './components/CustomLessonPlanner';
import AIRecommender from './components/AIRecommender';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../../components/Common/TransliterableText';
import './PersonalizationPage.css';

const PersonalizationPage = () => {
  const { t } = useI18n();

  const handleSavePlan = (plan) => {
    console.log('Saved plan:', plan);
    // Here you would typically save the plan to the user's profile
  };

  const userPerformance = {
    grammar: 65,
    vocabulary: 80,
  };

  return (
    <div className="personalization-page">
      <h1><TransliterableText text={t('personalizationPage.title', 'Personalize Your Learning')} /></h1>
      <CustomLessonPlanner onSavePlan={handleSavePlan} />
      <AIRecommender userPerformance={userPerformance} />
    </div>
  );
};

export default PersonalizationPage;
