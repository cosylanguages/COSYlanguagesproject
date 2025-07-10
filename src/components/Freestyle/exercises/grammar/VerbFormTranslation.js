import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import { normalizeString } from '../../../../utils/stringUtils';
import useLatinization from '../../../../hooks/useLatinization';

const VerbFormTranslation = ({
  verb, // The full verb object from processConjugationData
  tenseName, // e.g., "présent"
  pronoun, // e.g., "je"
  conjugatedForm, // e.g., "vais" (the correct answer if translating from English, or part of prompt if to English)
  translationDirection, // 'toEnglish' or 'fromEnglish'
  language,
  onCheckAnswer, // Callback to be triggered by parent's ExerciseControls
  onSetFeedback, // Callback to set feedback in parent
  isRevealedExternally, // If parent initiated reveal
  onSetCorrect // Callback to inform parent if answer is correct
}) => {
  const { t } = useI18n();
  const getLatinizedText = useLatinization();
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const infinitiveTranslation = verb.translation_en; // e.g., "to go"
  const targetLanguageForm = conjugatedForm; // e.g., "vais"

  let questionPrompt = '';
  // let correctAnswerNormalized = ''; // Removed as per no-unused-vars

  if (translationDirection === 'toEnglish') {
    // User sees "je vais" (for example), needs to type "to go"
    questionPrompt = t('translate.formToEnglishPrompt', `Translate "{pronoun} {form}" to English (infinitive):`, {
      pronoun: getLatinizedText(pronoun, language),
      form: getLatinizedText(conjugatedForm, language),
    });
    // correctAnswerNormalized = normalizeString(infinitiveTranslation); // Removed
  } else { // fromEnglish
    // User sees "to go", "je", "présent", needs to type "vais"
    questionPrompt = t('translate.englishToFormPrompt', `What is the form of "{translation}" for "{pronoun}" in the {tenseName} tense?`, {
      translation: infinitiveTranslation,
      pronoun: getLatinizedText(pronoun, language),
      tenseName: getLatinizedText(tenseName, language),
    });
    // correctAnswerNormalized = normalizeString(targetLanguageForm); // Removed
  }

  useEffect(() => {
    setUserInput('');
    setIsAnswered(false);
    if (onSetFeedback) onSetFeedback({message: '', type: ''});
  }, [verb, tenseName, pronoun, translationDirection, onSetFeedback]);

  useEffect(() => {
    if (isRevealedExternally && !isAnswered) {
      const answerToShow = translationDirection === 'toEnglish' ? infinitiveTranslation : targetLanguageForm.split('/')[0];
      setUserInput(answerToShow);
      setIsAnswered(true);
      if (onSetCorrect) onSetCorrect(true); // Consider revealed as correct for control flow
      if (onSetFeedback) {
        onSetFeedback({
          message: t('feedback.answerIs', 'The answer is: {answer}', { answer: answerToShow }),
          type: 'info',
        });
      }
    }
  }, [isRevealedExternally, isAnswered, translationDirection, infinitiveTranslation, targetLanguageForm, onSetCorrect, onSetFeedback, t]);


  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (isAnswered) setIsAnswered(false); // Allow re-checking if user changes input after an attempt
    if (onSetFeedback) onSetFeedback({message: '', type: ''});
    if (onSetCorrect) onSetCorrect(false);
  };

  const checkSingleAnswer = React.useCallback(() => {
    if (isAnswered && userInput !== '') return; // Don't re-check if already answered correctly, unless input is cleared

    const normalizedInput = normalizeString(userInput);
    let isCorrect = false;

    if (translationDirection === 'toEnglish') {
        // infinitiveTranslation might have multiple possibilities separated by "/"
        isCorrect = infinitiveTranslation.split('/').map(s => normalizeString(s)).includes(normalizedInput);
    } else { // fromEnglish
        // targetLanguageForm might have multiple possibilities separated by "/"
        isCorrect = targetLanguageForm.split('/').map(s => normalizeString(s)).includes(normalizedInput);
    }

    if (isCorrect) {
      if (onSetFeedback) onSetFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      if (onSetCorrect) onSetCorrect(true);
      setIsAnswered(true);
    } else {
      const actualCorrectAnswer = translationDirection === 'toEnglish'
        ? infinitiveTranslation.split('/')[0] // Show the first option
        : targetLanguageForm.split('/')[0];  // Show the first option
      if (onSetFeedback) onSetFeedback({
        message: t('feedback.incorrectAnswerIs', `Incorrect. The correct answer is: {correctAnswer}`, {correctAnswer: actualCorrectAnswer}),
        type: 'incorrect'
      });
      if (onSetCorrect) onSetCorrect(false);
      setIsAnswered(false); // Allow user to try again
    }
    return isCorrect;
  }, [
    isAnswered, userInput, translationDirection, infinitiveTranslation,
    targetLanguageForm, onSetFeedback, t, onSetCorrect, setIsAnswered
  ]);

  // Expose checkSingleAnswer to parent via onCheckAnswer ref
  useEffect(() => {
    if (onCheckAnswer) {
      onCheckAnswer.current = checkSingleAnswer;
    }
  }, [onCheckAnswer, checkSingleAnswer]);


  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{getLatinizedText(verb.infinitive, language)}</p>
      <p style={{ marginBottom: '15px' }}>{questionPrompt}</p>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isAnswered && userInput !== '' && !isRevealedExternally} // Disable if correctly answered, unless revealed
        placeholder={t('placeholders.typeTranslation', "Type your answer")}
        style={{
          padding: '10px',
          fontSize: '1rem',
          width: 'clamp(200px, 80%, 300px)', // Responsive width
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
        aria-label={t('ariaLabels.translationInput', "Translation input")}
      />
    </div>
  );
};

export default VerbFormTranslation;
