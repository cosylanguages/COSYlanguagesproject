import React, { useState, useEffect, useCallback } from 'react';
import { loadImageData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { normalizeString } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext';
import TransliterableText from '../../../Common/TransliterableText';

const IdentifyImageExercise = ({ language, days, exerciseKey, onComplete }) => { // Added onComplete
  const [currentImageItem, setCurrentImageItem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);

  const { isLatinized: isGlobalLatinized } = useLatinizationContext();
  const getLatinizedTextForDynamic = useLatinization;
  const { t, language: i18nLanguage } = useI18n();
  const getLatinizedUiText = useLatinization;

  const correctAnswerText = currentImageItem ? currentImageItem.translations[language] : '';
  const latinizedCorrectAnswer = getLatinizedTextForDynamic(correctAnswerText, language);

  const fetchAndSetNewImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setUserInput('');
    setIsRevealed(false);
    setCurrentImageItem(null);
    setIsAnsweredCorrectly(false);
    try {
      const { data: images, error: fetchError } = await loadImageData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load image data.');
      }
      if (images && images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        setCurrentImageItem(images[randomIndex]);
      } else {
        setError(t('exercises.noImagesFound', 'No images found for the selected criteria.'));
      }
    } catch (err) {
      console.error("IdentifyImageExercise - Error fetching image:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchAndSetNewImage();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
      setCurrentImageItem(null);
    }
  }, [fetchAndSetNewImage, exerciseKey, language, days, t]); // exerciseKey triggers fetch

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!currentImageItem || isRevealed || isAnsweredCorrectly) return; // Prevent re-check
    const correctAnswer = currentImageItem.translations[language];
    const displayCorrect = isGlobalLatinized ? latinizedCorrectAnswer : correctAnswer;
    const isCorrect = normalizeString(userInput) === normalizeString(correctAnswer);

    if (isCorrect) {
      setIsAnsweredCorrectly(true); // Mark as answered
      // Check if userInput exactly matches correctAnswer for more nuanced feedback
      if (userInput.trim() === correctAnswer) {
        setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      } else {
        setFeedback({ 
          message: t('feedback.correctAnswerIs', `Correct! The answer is: ${displayCorrect}`, { correctAnswer: displayCorrect }), 
          type: 'correct' 
        });
      }
      if (onComplete) {
        setTimeout(() => onComplete(), 1500); 
      }
      // Removed: setTimeout(() => { fetchAndSetNewImage(); }, 1500); 
    } else {
      setIsAnsweredCorrectly(true); // Also mark as answered on incorrect to allow host to proceed
      setFeedback({ message: t('feedback.incorrectAnswerWas', `Incorrect. The correct answer is: {answer}`, { answer: displayCorrect }), type: 'incorrect' });
      if (onComplete) { // Call onComplete even if incorrect, host decides next step
        setTimeout(() => onComplete(), 1800); // Longer delay for incorrect
      }
    }
  };

  const showHint = () => {
    if (!currentImageItem || isRevealed || isAnsweredCorrectly) return;
    const correctAnswer = currentImageItem.translations[language];
    const firstLetter = getLatinizedTextForDynamic(correctAnswer[0], language);
    setFeedback({ message: t('feedback.hintStartsWith', `Hint: The word starts with '{letter}'.`, { letter: firstLetter }), type: 'hint' });
  };

  const revealAnswer = () => {
    if (!currentImageItem || isRevealed) return; // Prevent multiple reveals
    const correctAnswer = currentImageItem.translations[language];
    const displayCorrect = isGlobalLatinized ? latinizedCorrectAnswer : correctAnswer;
    setUserInput(correctAnswer);
    setFeedback({ message: t('feedback.answerIs', `The correct answer is: {answer}`, { answer: displayCorrect }), type: 'info' });
    setIsRevealed(true);
    setIsAnsweredCorrectly(true); // Mark as answered
    if (onComplete) {
      setTimeout(() => onComplete(), 2000); 
    }
    // Removed: setTimeout(() => { fetchAndSetNewImage(); }, 2000); 
  };

  const handleNextRequestByControl = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Fallback if no onComplete (e.g. standalone use)
      fetchAndSetNewImage();
    }
  };

  const handlePronounceCorrectAnswer = () => {
    if (currentImageItem && language) {
      const textToPronounce = currentImageItem.translations[language];
      pronounceText(textToPronounce, language).catch(err => {
          console.error("Pronunciation error:", err);
          setFeedback({message: t('errors.pronunciationError', 'Could not pronounce the word.'), type: 'error'});
      });
    }
  };

  if (isLoading) {
    return <p><TransliterableText text={t('loading.imageExercise', 'Loading image exercise...')} langOverride={i18nLanguage} /></p>;
  }

  if (error) {
    return (
        <>
            <FeedbackDisplay message={error} type="error" language={i18nLanguage} />
            <ExerciseControls onNextExercise={handleNextRequestByControl} onRandomize={handleNextRequestByControl} config={{showNext: true, showRandomize: true}} />
        </>
    );
  }

  if (!currentImageItem && !isLoading) {
    return (
        <>
            <FeedbackDisplay message={t('exercises.noImageToDisplay', 'No image to display. Try different selections.')} type="info" language={i18nLanguage} />
            <ExerciseControls onNextExercise={handleNextRequestByControl} onRandomize={handleNextRequestByControl} config={{showNext: true, showRandomize: true}} />
        </>
    );
  }

  const imagePath = currentImageItem.src.startsWith('assets/') ? `/${currentImageItem.src}` : currentImageItem.src;
  const altText = currentImageItem.alt || t('altText.identifyImage', "Identify this image");
  const latinizedAltText = getLatinizedUiText(altText, i18nLanguage);

  const placeholderText = t('placeholders.typeTheWord', "Type the word...");
  const latinizedPlaceholder = getLatinizedUiText(placeholderText, i18nLanguage);
  
  const pronounceTooltipText = t('tooltips.pronounceCorrectAnswer', "Pronounce correct answer");
  const latinizedPronounceTooltip = getLatinizedUiText(pronounceTooltipText, i18nLanguage);

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3><TransliterableText text={t('titles.whatIsThis', 'What is this?')} langOverride={i18nLanguage} /></h3>
      <img
        src={imagePath}
        alt={latinizedAltText}
        style={{ maxWidth: '300px', maxHeight: '300px', margin: '15px auto', display: 'block', border: '1px solid #ccc' }}
      />
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder={latinizedPlaceholder}
        disabled={isRevealed || isAnsweredCorrectly}
        style={{ padding: '10px', fontSize: '1rem', width: '250px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        onKeyPress={(event) => {
            if (event.key === 'Enter' && !isRevealed && !isAnsweredCorrectly) {
              checkAnswer();
            }
        }}
      />
      {/* Show pronounce button only after answer is revealed or correct, to pronounce the *correct* answer */}
      {(isRevealed || isAnsweredCorrectly) && currentImageItem && (
        <button onClick={handlePronounceCorrectAnswer} title={latinizedPronounceTooltip} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', verticalAlign:'middle', marginLeft:'5px'}}>🔊</button>
      )}

      <FeedbackDisplay message={feedback.message} type={feedback.type} language={i18nLanguage} />

      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAnsweredCorrectly && currentImageItem ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAnsweredCorrectly && currentImageItem ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAnsweredCorrectly && currentImageItem ? revealAnswer : undefined}
        onRandomize={handleNextRequestByControl} // Changed from fetchAndSetNewImage
        onNextExercise={handleNextRequestByControl} // Changed from fetchAndSetNewImage
        isAnswerCorrect={isAnsweredCorrectly && feedback.type === 'correct'} // Ensure it was actually a correct answer
        isRevealed={isRevealed}
        config={{
            showCheck: !!currentImageItem && !isAnsweredCorrectly && !isRevealed,
            showHint: !!currentImageItem && !isAnsweredCorrectly && !isRevealed,
            showReveal: !!currentImageItem && !isAnsweredCorrectly && !isRevealed,
            showRandomize: true,
            showNext: true,
        }}
      />
    </div>
  );
};

export default IdentifyImageExercise;
