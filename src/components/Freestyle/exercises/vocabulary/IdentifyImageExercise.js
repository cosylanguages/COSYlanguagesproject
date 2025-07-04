import React, { useState, useEffect, useCallback } from 'react';
import { loadImageData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { normalizeString } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext';
import TransliterableText from '../../../Common/TransliterableText'; // Import

const IdentifyImageExercise = ({ language, days, exerciseKey }) => {
  const [currentImageItem, setCurrentImageItem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // Will store translated feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Will store translated error
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);

  const { isLatinized: isGlobalLatinized } = useLatinizationContext(); // Renamed to avoid conflict
  const getLatinizedTextForDynamic = useLatinization; // For dynamic content in target language
  const { t, language: i18nLanguage } = useI18n(); // Get UI language
  const getLatinizedUiText = useLatinization; // For UI text in i18nLanguage

  const correctAnswerText = currentImageItem ? currentImageItem.translations[language] : '';
  // latinizedCorrectAnswer is for the dynamic exercise answer in the target learning language
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
  }, [fetchAndSetNewImage, exerciseKey, language, days, t]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!currentImageItem) return;
    const correctAnswer = currentImageItem.translations[language];
    const displayCorrect = isGlobalLatinized ? latinizedCorrectAnswer : correctAnswer;
    const isCorrect = normalizeString(userInput) === normalizeString(correctAnswer);

    if (isCorrect) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setIsAnsweredCorrectly(true);
      setTimeout(() => {
        fetchAndSetNewImage();
      }, 1500); 
    } else {
      setFeedback({ message: t('feedback.incorrectAnswerWas', `Incorrect. The correct answer is: {answer}`, { answer: displayCorrect }), type: 'incorrect' });
    }
  };

  const showHint = () => {
    if (!currentImageItem) return;
    const correctAnswer = currentImageItem.translations[language];
    const firstLetter = getLatinizedTextForDynamic(correctAnswer[0], language);
    setFeedback({ message: t('feedback.hintStartsWith', `Hint: The word starts with '{letter}'.`, { letter: firstLetter }), type: 'hint' });
  };

  const revealAnswer = () => {
    if (!currentImageItem) return;
    const correctAnswer = currentImageItem.translations[language];
    const displayCorrect = isGlobalLatinized ? latinizedCorrectAnswer : correctAnswer;
    setUserInput(correctAnswer);
    setFeedback({ message: t('feedback.answerIs', `The correct answer is: {answer}`, { answer: displayCorrect }), type: 'info' });
    setIsRevealed(true);
    setIsAnsweredCorrectly(true);
    setTimeout(() => {
        fetchAndSetNewImage();
    }, 2000); 
  };

  const handleRandomizeOrNext = fetchAndSetNewImage;

  const handlePronounceCorrectAnswer = () => {
    if (currentImageItem && language) {
      const textToPronounce = currentImageItem.translations[language]; // Original script for pronunciation
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
    return <FeedbackDisplay message={error} type="error" language={i18nLanguage} />;
  }

  if (!currentImageItem && !isLoading) {
    return <FeedbackDisplay message={t('exercises.noImageToDisplay', 'No image to display. Try different selections.')} type="info" language={i18nLanguage} />;
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
      <button onClick={handlePronounceCorrectAnswer} disabled={!currentImageItem} title={latinizedPronounceTooltip} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', verticalAlign:'middle', marginLeft:'5px'}}>🔊</button>

      <FeedbackDisplay message={feedback.message} type={feedback.type} language={i18nLanguage} />

      <ExerciseControls
        onCheckAnswer={checkAnswer}
        onShowHint={showHint}
        onRevealAnswer={revealAnswer}
        onRandomize={handleRandomizeOrNext}
        onNextExercise={handleRandomizeOrNext}
        isAnswerCorrect={isAnsweredCorrectly}
        isRevealed={isRevealed}
        config={{
            showCheck: !!currentImageItem,
            showHint: !!currentImageItem,
            showReveal: !!currentImageItem,
            showRandomize: true,
            showNext: true,
        }}
        // ExerciseControls needs its button texts handled
      />
    </div>
  );
};

export default IdentifyImageExercise;
