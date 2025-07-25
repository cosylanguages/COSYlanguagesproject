import React from 'react';
import WritingExercise from './WritingExercise';
import { loadSpeakingPromptsData } from '../../../../utils/exerciseDataService';
import { useI18n } from '../../../../i18n/I18nContext';

const WritingQuestionExercise = ({ language, days, onNext, exerciseKey }) => {
  const { t } = useI18n();

  return (
    <WritingExercise
      language={language}
      days={days}
      onNext={onNext}
      exerciseKey={exerciseKey}
      exerciseType="questions"
      title={t('titles.answerTheQuestionWriting', 'Answer the Question (Writing)')}
      promptLoader={loadSpeakingPromptsData}
      hint={t('feedback.hintWritingQuestion', "Hint: Address all parts of the question. Structure your answer with an introduction, body, and conclusion if applicable.")}
      placeholder={t('placeholders.typeYourAnswerHere', 'Type your answer here...')}
      submitFeedback={t('feedback.answerSubmittedWriting', 'Answer submitted. Remember to check for grammar and clarity.')}
    />
  );
};

export default WritingQuestionExercise;
