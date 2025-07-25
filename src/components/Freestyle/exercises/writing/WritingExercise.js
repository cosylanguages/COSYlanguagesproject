import React, { useState, useEffect, useCallback } from 'react';
import ExerciseControls from '../../ExerciseControls';
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';

const WritingExercise = ({
  language,
  days,
  onNext,
  exerciseType,
  title,
  promptLoader,
  hint,
  placeholder,
  submitFeedback
}) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;

  const fetchNewPrompt = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrompts([]);
    setCurrentPromptIndex(0);
    setCurrentPrompt('');
    setText('');
    setFeedback({ message: '', type: '' });
    try {
      const { data: promptsData, error: fetchError } = await promptLoader(language, days);
      if (fetchError) throw new Error(fetchError.message || 'Failed to load prompts.');

      const prompts = promptsData?.[exerciseType] || promptsData;
      if (prompts && prompts.length > 0) {
        setPrompts(prompts);
        setCurrentPromptIndex(0);
        setCurrentPrompt(prompts[0]);
      } else {
        setError(t(`exercises.no${exerciseType}Prompts`, `No "${exerciseType}" prompts found.`));
      }
    } catch (err) {
      console.error(`${exerciseType} - Error fetching prompt:`, err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t, promptLoader, exerciseType]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchNewPrompt();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchNewPrompt, language, days, t]);

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setFeedback({ message: t('feedback.pleaseWriteMore', 'Please write a bit more for your story.'), type: 'warning' });
    } else {
      setFeedback({ message: submitFeedback, type: 'success' });
    }
  };

  const handleNextRequest = () => {
    fetchNewPrompt();
    if (onNext) onNext();
  };

  const showHint = () => {
    setFeedback({ message: hint, type: 'hint' });
  };

  const handleNext = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setCurrentPrompt(prompts[currentPromptIndex + 1]);
      setText('');
      setFeedback({ message: '', type: '' });
    }
  };

  const handlePrevious = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(prev => prev - 1);
      setCurrentPrompt(prompts[currentPromptIndex - 1]);
      setText('');
      setFeedback({ message: '', type: '' });
    }
  };

  if (isLoading) return <p>{t('loading.writingPrompts', 'Loading writing prompt...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!currentPrompt && !isLoading) return <FeedbackDisplay message={t('exercises.noPromptsToDisplay', 'No prompt to display.')} type="info" />;

  const latinizedPrompt = getLatinizedText(currentPrompt, language);

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
      <h4>{title}</h4>
      {prompts.length > 1 && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button onClick={handlePrevious} disabled={currentPromptIndex === 0} style={{ marginRight: '10px' }}>
            &lt; {t('buttons.previous', 'Previous')}
          </button>
          <span>{currentPromptIndex + 1} / {prompts.length}</span>
          <button onClick={handleNext} disabled={currentPromptIndex === prompts.length - 1} style={{ marginLeft: '10px' }}>
            {t('buttons.next', 'Next')} &gt;
          </button>
        </div>
      )}
      <p style={{ fontStyle: 'italic', margin: '20px', ...(isLatinized && currentPrompt !== latinizedPrompt && { fontStyle: 'italic' }) }}>
        "{latinizedPrompt}"
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        placeholder={placeholder}
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

export default WritingExercise;
