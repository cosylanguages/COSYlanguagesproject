import React, { useState, useEffect, useCallback } from 'react';
import ExerciseControls from '../../ExerciseControls';
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';
import { loadWritingPromptsData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';

const WhatHappenedBeforeExercise = ({ language, days, onNext }) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;

  const fetchNewPrompt = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPrompt('');
    setText('');
    setFeedback({ message: '', type: '' });
    try {
      const { data: promptsData, error: fetchError } = await loadWritingPromptsData(language, days);
      if (fetchError) throw new Error(fetchError.message || 'Failed to load writing prompts.');

      const prompts = promptsData?.what_happened_before;
      if (prompts && prompts.length > 0) {
        setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
      } else {
        setError(t('exercises.noWhatHappenedBeforePrompts', 'No "What happened before?" prompts found.'));
      }
    } catch (err) {
      console.error("WhatHappenedBeforeExercise - Error fetching prompt:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
     if (language && days && days.length > 0) {
        fetchNewPrompt();
    } else {
        setIsLoading(false);
        setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchNewPrompt, language, days, t]); // Added t to dependency array
  
  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setFeedback({ message: t('feedback.pleaseWriteMore', 'Please write a bit more for your story.'), type: 'warning' });
    } else {
      setFeedback({ message: t('feedback.prequelSubmitted', 'Great! Prequel submitted.'), type: 'success' });
    }
  };
  
  const handleNextRequest = () => {
      fetchNewPrompt();
      if(onNext) onNext();
  }
  
  const showHint = () => {
      setFeedback({ message: t('feedback.hintWhatHappenedBefore', "Hint: Consider the events or character motivations that could lead to this situation."), type: 'hint' });
  }

  if (isLoading) return <p>{t('loading.writingPrompts', 'Loading writing prompt...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!currentPrompt && !isLoading) return <FeedbackDisplay message={t('exercises.noPromptsToDisplay', 'No prompt to display.')} type="info" />;

  const latinizedPrompt = getLatinizedText(currentPrompt, language);

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
      <h4>{t('titles.whatHappenedBefore', "What Happened Before?")}</h4>
      <p style={{ fontStyle: 'italic', margin: '20px', ...(isLatinized && currentPrompt !== latinizedPrompt && {fontStyle: 'italic'}) }}>
        "{latinizedPrompt}"
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        placeholder={t('placeholders.typeYourPrequelHere', 'Type what led to this...')}
        style={{ width: '95%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
      />
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <ExerciseControls
        onCheckAnswer={handleSubmit}
        checkButtonText={t('buttons.done', 'Done')}
        onShowHint={showHint}
        onNextExercise={handleNextRequest}
        config={{
          showCheck: true,
          showHint: true,
          showReveal: false,
          showNext: true,
        }}
      />
    </div>
  );
};

export default WhatHappenedBeforeExercise;
