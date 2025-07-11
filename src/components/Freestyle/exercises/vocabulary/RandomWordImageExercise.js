import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import './RandomWordImageExercise.css'; // We'll create this CSS file

// Mock data for the exercise
const mockExerciseData = [
  { id: 1, type: 'word', stimulus: 'apple', correctAnswer: 'apple', image_url: null, hint: 'A common fruit, often red or green.' },
  { id: 2, type: 'image', stimulus: 'https://source.unsplash.com/random/200x200?dog', correctAnswer: 'dog', image_url: 'https://source.unsplash.com/random/200x200?dog', hint: 'Man\'s best friend.' },
  { id: 3, type: 'word', stimulus: 'banana', correctAnswer: 'banana', image_url: null, hint: 'A long yellow fruit.' },
  { id: 4, type: 'image', stimulus: 'https://source.unsplash.com/random/200x200?cat', correctAnswer: 'cat', image_url: 'https://source.unsplash.com/random/200x200?cat', hint: 'A feline companion.' },
  { id: 5, type: 'word', stimulus: 'Maison', correctAnswer: 'maison', image_url: null, hint: 'A place where people live (French).' }, // Example with accent/case
];

// Utility to normalize answers (lowercase, strip accents - basic version)
const normalizeAnswer = (answer) => {
  if (typeof answer !== 'string') return '';
  return answer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const RandomWordImageExercise = ({ language }) => { // Assuming language prop might be used later
  const { t } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, or false

  const currentExercise = mockExerciseData[currentExerciseIndex];

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    setFeedback('');
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!userInput.trim()) {
      setFeedback(t('feedback.pleaseEnterAnswer', 'Please enter an answer.'));
      setIsCorrect(false);
      return;
    }

    const normalizedUserInput = normalizeAnswer(userInput);
    const normalizedCorrectAnswer = normalizeAnswer(currentExercise.correctAnswer);

    if (normalizedUserInput === normalizedCorrectAnswer) {
      setFeedback(t('feedback.correct', 'Correct!'));
      setIsCorrect(true);
    } else {
      // Basic hint for case/accent issues if the core word matches
      if (userInput.toLowerCase() === currentExercise.correctAnswer.toLowerCase() && userInput !== currentExercise.correctAnswer) {
         setFeedback(t('feedback.almostCorrectAccentCase', 'Almost! Check accents or capitalization. Accepted.'));
         setIsCorrect(true); // Marking as correct for now as per requirement
      } else {
        setFeedback(t('feedback.incorrect', 'Incorrect, try again.'));
        setIsCorrect(false);
        setShowHint(true); // Show hint on incorrect attempt
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkAnswer();
    }
  };

  const nextExercise = () => {
    setUserInput('');
    setFeedback('');
    setShowHint(false);
    setIsCorrect(null);
    setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % mockExerciseData.length);
  };

  useEffect(() => {
    // Reset state if exercise changes (e.g. due to language change or external trigger)
    setUserInput('');
    setFeedback('');
    setShowHint(false);
    setIsCorrect(null);
    // For this phase, we'll just cycle through mock data.
    // In a real scenario, we might fetch new data based on language/days prop.
  }, [currentExerciseIndex, language]);


  if (!currentExercise) {
    return <div>{t('loadingExercise', 'Loading exercise...')}</div>;
  }

  return (
    <div className="random-word-image-exercise">
      <h3>{t('vocabulary.randomWordImageExerciseTitle', 'Random Word/Image')}</h3>

      <div className="stimulus-area">
        {currentExercise.type === 'word' && (
          <p className="stimulus-word">{currentExercise.stimulus}</p>
        )}
        {currentExercise.type === 'image' && currentExercise.image_url && (
          <img src={currentExercise.image_url} alt={t('vocabulary.stimulusImageAlt', 'Stimulus image')} className="stimulus-image" />
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={t('vocabulary.typeYourAnswer', 'Type your answer here...')}
          className="answer-input"
          aria-label={t('vocabulary.answerInputAriaLabel', 'Answer input')}
        />
        <button onClick={checkAnswer} className="check-button">
          {t('controls.checkAnswer', 'Check Answer')}
        </button>
      </div>

      {feedback && (
        <div className={`feedback-message ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          {feedback}
        </div>
      )}

      {showHint && !isCorrect && currentExercise.hint && (
        <div className="hint-message">
          <strong>{t('vocabulary.hintLabel', 'Hint:')}</strong> {currentExercise.hint}
        </div>
      )}

      {(isCorrect || showHint) && (
         <button onClick={nextExercise} className="next-button">
           {t('controls.nextExercise', 'Next Exercise')}
         </button>
      )}
    </div>
  );
};

export default RandomWordImageExercise;
