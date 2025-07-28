import React, { useState, useEffect } from 'react';
import { loadSpeakingPromptsData } from '../../../../utils/exerciseDataService';
import { useI18n } from '../../../../i18n/I18nContext';

const WritingQuestionExercise = ({ language, days, onNext, exerciseKey }) => {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const fetchPrompt = async () => {
      const prompts = await loadSpeakingPromptsData(language, days);
      setPrompt(prompts[0].text);
    };
    fetchPrompt();
  }, [language, days]);

  return (
    <div>
      <h3>{t('titles.answerTheQuestionWriting', 'Answer the Question (Writing)')}</h3>
      <p>{prompt}</p>
      <textarea placeholder={t('placeholders.typeYourAnswerHere', 'Type your answer here...')}></textarea>
      <button onClick={onNext}>{t('common.submit', 'Submit')}</button>
    </div>
  );
};

export default WritingQuestionExercise;
