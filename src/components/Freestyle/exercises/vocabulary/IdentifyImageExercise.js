import React, { useState, useEffect, useCallback } from 'react';
import { loadImageData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { normalizeString } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext'; // Assuming you use i18n for texts

const IdentifyImageExercise = ({ language, days, exerciseKey }) => {
  const [currentImageItem, setCurrentImageItem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n(); // For internationalized strings

  const correctAnswerText = currentImageItem ? currentImageItem.translations[language] : '';
  const latinizedCorrectAnswer = useLatinization(correctAnswerText, language);

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
    if (!currentImageItem || isRevealed || isAnsweredCorrectly) return;
    const correctAnswer = currentImageItem.translations[language];
    const itemId = `image_${currentImageItem.id || normalizeString(correctAnswer)}`;
    const isCorrect = normalizeString(userInput) === normalizeString(correctAnswer);

    if (isCorrect) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setIsAnsweredCorrectly(true);
      setTimeout(() => {
        fetchAndSetNewImage();
      }, 1500); // 1.5-second delay
    } else {
      setFeedback({ message: t('feedback.incorrectAnswerWas', `Incorrect. The correct answer is: ${latinizedCorrectAnswer || correctAnswer}`, { answer: latinizedCorrectAnswer || correctAnswer }), type: 'incorrect' });
    }
  };

  const showHint = () => {
    if (!currentImageItem || isRevealed || isAnsweredCorrectly) return;
    const correctAnswer = currentImageItem.translations[language];
    setFeedback({ message: t('feedback.hintStartsWith', `Hint: The word starts with '${getLatinizedText(correctAnswer[0], language)}'.`, { letter: getLatinizedText(correctAnswer[0], language) }), type: 'hint' });
  };

  const revealAnswer = () => {
    if (!currentImageItem || isAnsweredCorrectly) return;
    const correctAnswer = currentImageItem.translations[language];
    const itemId = `image_${currentImageItem.id || normalizeString(correctAnswer)}`;
    setUserInput(correctAnswer);
    setFeedback({ message: t('feedback.answerIs', `The correct answer is: ${latinizedCorrectAnswer || correctAnswer}`, { answer: latinizedCorrectAnswer || correctAnswer }), type: 'info' });
    setIsRevealed(true);
    setTimeout(() => {
        fetchAndSetNewImage();
    }, 2000); // Slightly longer delay for revealed answers
  };

  const handleNext = () => {
    fetchAndSetNewImage();
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
    return <p>{t('loading.imageExercise', 'Loading image exercise...')}</p>;
  }

  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }

  if (!currentImageItem && !isLoading) {
    return <FeedbackDisplay message={t('exercises.noImageToDisplay', 'No image to display. Try different selections.')} type="info" />;
  }

  const imagePath = currentImageItem.src.startsWith('assets/') ? `/${currentImageItem.src}` : currentImageItem.src;

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.whatIsThis', 'What is this?')}</h3>
      <img
        src={imagePath}
        alt={currentImageItem.alt || "Identify this image"}
        style={{ maxWidth: '300px', maxHeight: '300px', margin: '15px auto', display: 'block', border: '1px solid #ccc' }}
      />
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder={t('placeholders.typeTheWord', "Type the word...")}
        disabled={isRevealed || isAnsweredCorrectly}
        style={{ padding: '10px', fontSize: '1rem', width: '250px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        onKeyPress={(event) => {
            if (event.key === 'Enter' && !isRevealed && !isAnsweredCorrectly) {
              checkAnswer();
            }
        }}
      />
      <button onClick={handlePronounceCorrectAnswer} disabled={!currentImageItem} title={t('tooltips.pronounceCorrectAnswer', "Pronounce correct answer")} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', verticalAlign:'middle', marginLeft:'5px'}}>🔊</button>

      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />

      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAnsweredCorrectly && currentImageItem ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAnsweredCorrectly && currentImageItem ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAnsweredCorrectly && currentImageItem ? revealAnswer : undefined}
        onNextExercise={handleNext}
        config={{
            showCheck: !isRevealed && !isAnsweredCorrectly && !!currentImageItem,
            showHint: !isRevealed && !isAnsweredCorrectly && !!currentImageItem,
            showReveal: !isRevealed && !isAnsweredCorrectly && !!currentImageItem,
            showNext: true,
        }}
      />
    </div>
  );
};

export default IdentifyImageExercise;
