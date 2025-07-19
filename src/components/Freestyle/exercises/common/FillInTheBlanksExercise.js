import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import { adjustDifficulty } from '../../../../utils/adaptiveLearning';
import './FillInTheBlanksExercise.css'; // To be created

const FillInTheBlanksExercise = ({ exerciseData, onCorrect, onIncorrect, onAttempt }) => {
  const { t } = useI18n();
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, false
  const [showAnswers, setShowAnswers] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  useEffect(() => {
    if (exerciseData && exerciseData.answers) {
      setUserAnswers(Array(exerciseData.answers.length).fill(''));
      setIsCorrect(null);
      setShowAnswers(false);
    }
  }, [exerciseData]);

  const handleInputChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
    setIsCorrect(null); // Reset correctness on input change
    if (showAnswers) setShowAnswers(false); // Hide answers if user starts typing again
  };

  const checkAnswers = () => {
    if (!exerciseData || !exerciseData.answers) return;
    if (onAttempt) onAttempt();

    // Simple case-insensitive check, also trimming user input
    const correct = exerciseData.answers.every(
      (answer, index) => answer.toLowerCase() === (userAnswers[index] || '').trim().toLowerCase()
    );

    setIsCorrect(correct);
    if (correct) {
      setDifficulty(adjustDifficulty(difficulty, 1));
      if (onCorrect) onCorrect();
    } else {
      setDifficulty(adjustDifficulty(difficulty, 0));
      if (onIncorrect) onIncorrect();
    }
  };

  const revealAnswers = () => {
    setShowAnswers(true);
    setIsCorrect(null); // No longer "correct" or "incorrect" in the same way once revealed
    // Optionally, pre-fill userAnswers with correct answers or disable inputs
  };

  const resetExercise = () => {
    if (exerciseData && exerciseData.answers) {
      setUserAnswers(Array(exerciseData.answers.length).fill(''));
    }
    setIsCorrect(null);
    setShowAnswers(false);
  };


  if (!exerciseData || !exerciseData.sentenceParts || !exerciseData.answers) {
    return <div>{t('loadingExercise', 'Loading exercise...')}</div>;
  }

  let blankCounter = 0;

  return (
    <div className="fill-in-the-blanks-exercise">
      <h4>{t('fillInTheBlanks.title', 'Fill in the Blanks')}</h4>

      {exerciseData.translation && (
        <p className="translation-hint">
          <em>{t('fillInTheBlanks.translationLabel', 'Meaning: ')} {exerciseData.translation}</em>
        </p>
      )}
      {exerciseData.hint && !showAnswers && (
        <p className="hint">
          <em>{t('fillInTheBlanks.hintLabel', 'Hint: ')} {exerciseData.hint}</em>
        </p>
      )}

      <div className="sentence-display">
        {exerciseData.sentenceParts.map((part, index) => {
          if (part === null) {
            const currentBlankIndex = blankCounter;
            blankCounter++;
            return (
              <input
                key={`blank-${currentBlankIndex}`}
                type="text"
                className="blank-input"
                value={showAnswers ? (exerciseData.answers[currentBlankIndex] || '') : (userAnswers[currentBlankIndex] || '')}
                onChange={(e) => handleInputChange(currentBlankIndex, e.target.value)}
                disabled={showAnswers || isCorrect === true}
                aria-label={t('fillInTheBlanks.ariaLabelBlank', `Blank number ${currentBlankIndex + 1}`)}
              />
            );
          }
          return <span key={`part-${index}`} className="sentence-part">{part}</span>;
        })}
      </div>

      <div className="exercise-controls fitb-controls">
        <button onClick={checkAnswers} disabled={isCorrect === true || showAnswers}>
          {t('controls.checkAnswer', 'Check Answer')}
        </button>
        <button onClick={revealAnswers} disabled={showAnswers || isCorrect === true} className="secondary-button">
          {t('controls.revealAnswer', 'Reveal Answers')}
        </button>
         <button onClick={resetExercise} className="secondary-button">
          {t('controls.tryAgain', 'Try Again')}
        </button>
      </div>

      {isCorrect === true && !showAnswers && (
        <p className="feedback correct">{t('feedback.correct', 'Correct!')}</p>
      )}
      {isCorrect === false && !showAnswers && (
        <p className="feedback incorrect">{t('feedback.incorrect', 'Incorrect, try again.')}</p>
      )}
      {showAnswers && (
         <p className="feedback info">{t('fillInTheBlanks.answersShown', 'Answers are shown above.')}</p>
      )}
    </div>
  );
};

export default FillInTheBlanksExercise;
