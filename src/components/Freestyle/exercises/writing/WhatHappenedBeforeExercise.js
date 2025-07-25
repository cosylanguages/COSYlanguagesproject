import React from 'react';
import WritingExercise from './WritingExercise';
import { loadWritingPromptsData } from '../../../../utils/exerciseDataService';
import { useI18n } from '../../../../i18n/I18nContext';

const WhatHappenedBeforeExercise = ({ language, days, onNext }) => {
  const { t } = useI18n();

  return (
    <WritingExercise
      language={language}
      days={days}
      onNext={onNext}
      exerciseType="what_happened_before"
      title={t('titles.whatHappenedBefore', "What Happened Before?")}
      promptLoader={loadWritingPromptsData}
      hint={t('feedback.hintWhatHappenedBefore', "Hint: Consider the events or character motivations that could lead to this situation.")}
      placeholder={t('placeholders.typeYourPrequelHere', 'Type what led to this...')}
      submitFeedback={t('feedback.prequelSubmitted', 'Great! Prequel submitted.')}
    />
  );
};

export default WhatHappenedBeforeExercise;
