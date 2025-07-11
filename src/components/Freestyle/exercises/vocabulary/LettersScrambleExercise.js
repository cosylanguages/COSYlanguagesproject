import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import './LettersScrambleExercise.css'; // To be created

const mockWordData = [
  { id: 1, word: 'apple', hint: 'A fruit' },
  { id: 2, word: 'banana', hint: 'Yellow and long' },
  { id: 3, word: 'orange', hint: 'A citrus fruit, also a color' },
  { id: 4, word: 'grape', hint: 'Grows in bunches' },
];

// Function to shuffle letters of a word
const shuffleLetters = (word) => {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  // Ensure it's not the same as original word if possible (for short words this might be tricky)
  if (letters.join('') === word && word.length > 1) {
    return shuffleLetters(word); // Reshuffle
  }
  return letters;
};

const LettersScrambleExercise = ({ language }) => {
  const { t } = useI18n();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [formedWord, setFormedWord] = useState([]); // Array of {char: string, originalIndex: number}
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const currentExercise = mockWordData[currentWordIndex];
  const correctWord = currentExercise.word;

  useEffect(() => {
    const wordToScramble = mockWordData[currentWordIndex].word;
    setScrambledLetters(shuffleLetters(wordToScramble).map((char, index) => ({ char, id: `${char}-${index}` })));
    setFormedWord([]);
    setFeedback('');
    setIsCorrect(null);
  }, [currentWordIndex]);

  const handleLetterPoolClick = (letterObj) => {
    setFormedWord(prev => [...prev, letterObj]);
    setScrambledLetters(prev => prev.filter(l => l.id !== letterObj.id));
    setFeedback('');
    setIsCorrect(null);
  };

  const handleFormedWordClick = (letterObj, indexInFormed) => {
    setScrambledLetters(prev => [...prev, letterObj]); // Return to pool
    setFormedWord(prev => prev.filter((_, i) => i !== indexInFormed));
    setFeedback('');
    setIsCorrect(null);
  };

  const checkWord = () => {
    const userAnswer = formedWord.map(l => l.char).join('');
    if (userAnswer === correctWord) {
      setFeedback(t('feedback.correct', 'Correct!'));
      setIsCorrect(true);
    } else {
      setFeedback(t('feedback.incorrect', 'Incorrect, try again.'));
      setIsCorrect(false);
    }
  };

  const nextWord = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % mockWordData.length);
  };

  return (
    <div className="letters-scramble-exercise">
      <h3>{t('vocabulary.lettersScrambleExerciseTitle', 'Unscramble the Word')}</h3>
      {currentExercise.hint && <p className="hint-text"><strong>{t('vocabulary.hintLabel', 'Hint:')}</strong> {currentExercise.hint}</p>}

      <div className="formed-word-area">
        {formedWord.map((letterObj, index) => (
          <button
            key={`${letterObj.id}-formed-${index}`}
            className="letter-tile formed"
            onClick={() => handleFormedWordClick(letterObj, index)}
          >
            {letterObj.char}
          </button>
        ))}
        {formedWord.length === 0 && <span className="placeholder-text">{t('vocabulary.dropLettersHint', 'Click letters below to form the word')}</span>}
      </div>

      <div className="letter-pool-area">
        {scrambledLetters.map((letterObj) => (
          <button
            key={letterObj.id}
            className="letter-tile pool"
            onClick={() => handleLetterPoolClick(letterObj)}
          >
            {letterObj.char}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-message ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          {feedback}
        </div>
      )}

      <div className="action-buttons">
        <button onClick={checkWord} disabled={formedWord.length === 0 || isCorrect === true} className="check-button">
          {t('controls.checkAnswer', 'Check Answer')}
        </button>
        {isCorrect === true && (
          <button onClick={nextWord} className="next-button">
            {t('controls.nextExercise', 'Next Word')}
          </button>
        )}
      </div>
    </div>
  );
};

export default LettersScrambleExercise;
