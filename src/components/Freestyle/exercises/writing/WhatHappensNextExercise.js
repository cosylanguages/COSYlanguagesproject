import React from 'react';
import WritingExercise from './WritingExercise';
import { loadWritingPromptsData } from '../../../../utils/exerciseDataService';
import { useI18n } from '../../../../i18n/I18nContext';

const WhatHappensNextExercise = ({ language, days, onNext }) => {
  const { t } = useI18n();

  return (
    <WritingExercise
      language={language}
      days={days}
      onNext={onNext}
      exerciseType="what_happens_next"
      title={t('titles.whatHappensNext', "What Happens Next?")}
      promptLoader={loadWritingPromptsData}
      hint={t('feedback.hintWhatHappensNext', "Hint: Think about potential consequences or new character introductions.")}
      placeholder={t('placeholders.typeYourContinuationHere', 'Type your continuation here...')}
      submitFeedback={t('feedback.continuationSubmitted', 'Great! Continuation submitted.')}
    />
  );
};

export default WhatHappensNextExercise;
