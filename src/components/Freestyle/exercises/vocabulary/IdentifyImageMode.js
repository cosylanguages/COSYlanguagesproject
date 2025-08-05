// src/components/Freestyle/exercises/vocabulary/IdentifyImageMode.js
import React, { useState, useEffect } from 'react';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText, unlockAudioPlayback } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { normalizeString } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext';

const IdentifyImageMode = ({ imageObject, language, onDone, exerciseKeyInternal }) => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const correctAnswerText = imageObject?.translations?.[language] || '';
  const latinizedCorrectAnswer = useLatinization(correctAnswerText, language);

  useEffect(() => {
    unlockAudioPlayback();
  }, []);

  // Reset state when imageObject or key changes (new exercise item)
  useEffect(() => {
    setUserInput('');
    setFeedback({ message: '', type: '' });
    setIsRevealed(false);
    setIsAnsweredCorrectly(false);
  }, [imageObject, exerciseKeyInternal]);


  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!imageObject || isRevealed || isAnsweredCorrectly) return;
    
    const isCorrect = normalizeString(userInput) === normalizeString(correctAnswerText);

    if (isCorrect) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setIsAnsweredCorrectly(true);
      setTimeout(() => {
        onDone(true); // Pass true for correct answer
      }, 1500);
    } else {
      setFeedback({ message: t('feedback.incorrectAnswerWas', `Incorrect. The correct answer is: ${latinizedCorrectAnswer || correctAnswerText}`, { answer: latinizedCorrectAnswer || correctAnswerText }), type: 'incorrect' });
      // Do not call onDone here, let user try again or reveal/skip
    }
  };

  const showHint = () => {
    if (!imageObject || isRevealed || isAnsweredCorrectly) return;
    setFeedback({ message: t('feedback.hintStartsWith', `Hint: The word starts with '${getLatinizedText(correctAnswerText[0], language)}'.`, { letter: getLatinizedText(correctAnswerText[0], language) }), type: 'hint' });
  };

  const revealAnswer = () => {
    if (!imageObject || isAnsweredCorrectly) return; // Allow reveal even if already revealed but not yet moved on
    setUserInput(correctAnswerText); // Show the correct answer in the input
    setFeedback({ message: t('feedback.answerIs', `The correct answer is: ${latinizedCorrectAnswer || correctAnswerText}`, { answer: latinizedCorrectAnswer || correctAnswerText }), type: 'info' });
    setIsRevealed(true);
    // Consider calling onDone(false) after a delay if revealing means the attempt was incorrect
    setTimeout(() => {
        onDone(false); // Revealing means the user didn't get it right initially
    }, 2000);
  };
  
  const handleSkip = () => {
    onDone(false); // Skipping is considered an incorrect attempt for this item
  };

  const handlePronounceCorrectAnswer = () => {
    if (correctAnswerText && language) {
      pronounceText(correctAnswerText, language).catch(err => {
          console.error("Pronunciation error:", err);
          setFeedback({message: t('errors.pronunciationError', 'Could not pronounce the word.'), type: 'error'});
      });
    }
  };

  if (!imageObject) {
    return <FeedbackDisplay message={t('exercises.noImageToDisplay', 'No image data provided to IdentifyImageMode.')} type="error" />;
  }
  
  // Ensure imagePath is correctly formed, PUBLIC_URL is for assets bundled with create-react-app
  const imagePath = imageObject.imagePath 
    ? `${process.env.PUBLIC_URL}${imageObject.imagePath.startsWith('/') ? '' : '/'}${imageObject.imagePath}`
    : `/assets/vocabulary_images/placeholder.png`; // Fallback image

  const altText = (imageObject && imageObject.translations && imageObject.translations[language]) || (imageObject && imageObject.altText) || t('altText.identifyImage', "Identify this image");

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3>{t('titles.whatIsThis', 'What is this?')}</h3>
      <img
        src={imagePath}
        alt={altText}
        style={{ maxWidth: '300px', maxHeight: '300px', margin: '15px auto', display: 'block', border: '1px solid #ccc', objectFit: 'contain' }}
        onError={(e) => { e.target.onerror = null; e.target.src=`/assets/vocabulary_images/placeholder.png`; }}
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
      <button onClick={handlePronounceCorrectAnswer} disabled={!correctAnswerText} title={t('tooltips.pronounceCorrectAnswer', "Pronounce correct answer")} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', verticalAlign:'middle', marginLeft:'5px'}}>🔊</button>

      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />

      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAnsweredCorrectly && imageObject ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAnsweredCorrectly && imageObject && correctAnswerText.length > 0 ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAnsweredCorrectly && imageObject ? revealAnswer : undefined}
        onNextExercise={handleSkip} // "Next" button now acts as a "Skip" for this mode
        config={{
            showCheck: !isRevealed && !isAnsweredCorrectly && !!imageObject,
            showHint: !isRevealed && !isAnsweredCorrectly && !!imageObject && correctAnswerText.length > 0,
            showReveal: !isRevealed && !isAnsweredCorrectly && !!imageObject,
            nextButtonText: t('buttons.skip', "Skip"), // Change "Next" button text to "Skip"
            showNext: true, // Always show skip/next
        }}
      />
    </div>
  );
};

export default IdentifyImageMode;
