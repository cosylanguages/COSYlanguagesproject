import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import './SentenceUnscrambleExercise.css'; // To be created

// Helper to shuffle array (Fisher-Yates)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Clone to avoid mutating original
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

const SentenceUnscrambleExercise = ({ exerciseData, onCorrect, onIncorrect }) => {
  const { t, language } = useI18n();
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userOrderedWords, setUserOrderedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, false

  const initializeExercise = useCallback(() => {
    if (exerciseData) {
      let initialScramble;
      if (exerciseData.scrambledWords && exerciseData.scrambledWords.length > 0) {
        initialScramble = [...exerciseData.scrambledWords]; // Use a copy
      } else if (exerciseData.correctSentence) {
        const words = exerciseData.correctSentence.split(' ');
        initialScramble = shuffleArray(words);
        // Ensure it's not accidentally correct after one shuffle, and list has more than one word
        if (words.length > 1) {
          while (initialScramble.join(' ') === exerciseData.correctSentence) {
            initialScramble = shuffleArray(words);
          }
        }
      } else {
        initialScramble = [];
      }
      setScrambledWords(initialScramble);
      setUserOrderedWords([]);
      setIsCorrect(null);
    }
  }, [exerciseData]);

  useEffect(() => {
    initializeExercise();
  }, [initializeExercise]);

  const handleWordClick = (word, index) => {
    // Add word to userOrderedWords and remove from scrambledWords
    setUserOrderedWords(prev => [...prev, word]);
    setScrambledWords(prev => prev.filter((_, i) => i !== index));
    setIsCorrect(null); // Reset correctness on interaction
  };

  const handleUserWordClick = (word, index) => {
    // Add word back to scrambledWords and remove from userOrderedWords
    setScrambledWords(prev => [...prev, word]); // Could implement smarter re-insertion if order matters
    setUserOrderedWords(prev => prev.filter((_, i) => i !== index));
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!exerciseData || !exerciseData.correctSentence) return;
    const userAnswer = userOrderedWords.join(' ');
    if (userAnswer === exerciseData.correctSentence) {
      setIsCorrect(true);
      if (onCorrect) onCorrect();
    } else {
      setIsCorrect(false);
      if (onIncorrect) onIncorrect();
    }
  };

  const resetAttempt = () => {
    initializeExercise();
  }

  if (!exerciseData) {
    return <div>{t('loadingExercise', 'Loading exercise...')}</div>;
  }

  return (
    <div className="sentence-unscramble-exercise">
      <h4>{t('sentenceUnscramble.title', 'Unscramble the Sentence')}</h4>
      {exerciseData.translation && (
        <p className="translation-hint">
          <em>{t('sentenceUnscramble.translationLabel', 'Meaning: ')} {exerciseData.translation}</em>
        </p>
      )}
      {exerciseData.hint && (
        <p className="hint">
          <em>{t('sentenceUnscramble.hintLabel', 'Hint: ')} {exerciseData.hint}</em>
        </p>
      )}

      <div className="user-sentence-area drop-target">
        {userOrderedWords.length > 0 ? (
          userOrderedWords.map((word, index) => (
            <button
              key={`${word}-${index}-user`}
              className="word-button user-word"
              onClick={() => handleUserWordClick(word, index)}
              title={t('sentenceUnscramble.clickToRemoveWord', 'Click to remove word')}
            >
              {word}
            </button>
          ))
        ) : (
          <span className="placeholder-text">{t('sentenceUnscramble.dropWordsHere', 'Click words below to build the sentence here...')}</span>
        )}
      </div>

      <div className="scrambled-words-area">
        {scrambledWords.map((word, index) => (
          <button
            key={`${word}-${index}-scrambled`}
            className="word-button scrambled-word"
            onClick={() => handleWordClick(word, index)}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="exercise-controls">
        <button onClick={checkAnswer} disabled={userOrderedWords.length === 0 || isCorrect === true}>
          {t('controls.checkAnswer', 'Check Answer')}
        </button>
        <button onClick={resetAttempt} className="secondary-button">
            {t('controls.tryAgain', 'Try Again')}
        </button>
      </div>

      {isCorrect === true && (
        <p className="feedback correct">{t('feedback.correct', 'Correct!')}</p>
      )}
      {isCorrect === false && (
        <p className="feedback incorrect">{t('feedback.incorrect', 'Incorrect, try again.')}</p>
      )}
    </div>
  );
};

export default SentenceUnscrambleExercise;
