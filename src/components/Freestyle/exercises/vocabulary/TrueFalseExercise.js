import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import './TrueFalseExercise.css'; // To be created

const mockTrueFalseData = [
  {
    id: 1,
    stimulus: { type: 'word', content: 'Apple' },
    responseOption: { type: 'image', content: 'https://source.unsplash.com/random/150x150?apple' },
    isCorrectMatch: true,
    explanation: 'The image shows an apple.'
  },
  {
    id: 2,
    stimulus: { type: 'word', content: 'Dog' },
    responseOption: { type: 'word', content: 'Cat' }, // Representing "Meaning: Cat"
    isCorrectMatch: false,
    explanation: 'A dog is not a cat.'
  },
  {
    id: 3,
    stimulus: { type: 'image', content: 'https://source.unsplash.com/random/150x150?tree' },
    responseOption: { type: 'word', content: 'Tree' },
    isCorrectMatch: true,
    explanation: 'The image shows a tree.'
  },
  {
    id: 4,
    stimulus: { type: 'word', content: 'Sun' }, // Representing "Audio: Sun"
    responseOption: { type: 'image', content: 'https://source.unsplash.com/random/150x150?moon' },
    isCorrectMatch: false,
    explanation: 'The image shows a moon, not the sun.'
  },
];

const TrueFalseExercise = ({ language }) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [userChoiceIsCorrect, setUserChoiceIsCorrect] = useState(null);

  const currentExercise = mockTrueFalseData[currentIndex];

  useEffect(() => {
    setFeedback('');
    setIsAnswered(false);
    setUserChoiceIsCorrect(null);
  }, [currentIndex]);

  const handleAnswer = (userSelection) => { // userSelection is true or false
    if (isAnswered) return;

    setIsAnswered(true);
    const correct = userSelection === currentExercise.isCorrectMatch;
    setUserChoiceIsCorrect(correct);

    if (correct) {
      setFeedback(t('feedback.correct', 'Correct!'));
    } else {
      setFeedback(t('feedback.incorrect', 'Incorrect.') + ` ${currentExercise.explanation || ''}`);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockTrueFalseData.length);
  };

  const renderContent = (item) => {
    if (!item) return null;
    switch (item.type) {
      case 'word':
        return <p className="tf-content-word">{item.content}</p>;
      case 'image':
        return <img src={item.content} alt={t('vocabulary.tfContentImageAlt', 'Exercise content')} className="tf-content-image" />;
      // Future: case 'audio': return <button>Play Audio: {item.content}</button>;
      default:
        return <p>{String(item.content)}</p>;
    }
  };

  if (!currentExercise) {
    return <div>{t('loadingExercise', 'Loading exercise...')}</div>;
  }

  return (
    <div className="true-false-exercise">
      <h3>{t('vocabulary.trueFalseExerciseTitle', 'True or False?')}</h3>
      <p className="instruction">{t('vocabulary.tfInstruction', 'Do the items below match?')}</p>

      <div className="stimulus-response-container">
        <div className="item-container stimulus-container">
          <strong className="item-label">{t('vocabulary.tfStimulusLabel', 'Item 1:')}</strong>
          {renderContent(currentExercise.stimulus)}
        </div>
        <div className="item-container response-option-container">
          <strong className="item-label">{t('vocabulary.tfResponseLabel', 'Item 2:')}</strong>
          {renderContent(currentExercise.responseOption)}
        </div>
      </div>

      <div className="tf-buttons">
        <button onClick={() => handleAnswer(true)} disabled={isAnswered} className="true-button">
          {t('controls.true', 'True')}
        </button>
        <button onClick={() => handleAnswer(false)} disabled={isAnswered} className="false-button">
          {t('controls.false', 'False')}
        </button>
      </div>

      {feedback && (
        <div className={`feedback-message ${userChoiceIsCorrect === true ? 'correct' : userChoiceIsCorrect === false ? 'incorrect' : ''}`}>
          {feedback}
        </div>
      )}

      {isAnswered && (
         <button onClick={nextQuestion} className="next-button">
           {t('controls.nextExercise', 'Next Question')}
         </button>
      )}
    </div>
  );
};

export default TrueFalseExercise;
