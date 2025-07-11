import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';
import './GenericMatchItExercise.css'; // To be created

// Mock Data - Array of pairs
const mockMatchData = [
  {
    id: 'pair1',
    left: { id: 'l1', type: 'word', content: 'Hot' },
    right: { id: 'r1', type: 'word', content: 'Cold' }
  },
  {
    id: 'pair2',
    left: { id: 'l2', type: 'image', content: 'https://source.unsplash.com/random/100x100?sun' },
    right: { id: 'r2', type: 'word', content: 'Sun' }
  },
  {
    id: 'pair3',
    left: { id: 'l3', type: 'word', content: 'Fast' },
    right: { id: 'r3', type: 'word', content: 'Slow' } // Representing 'pronunciation' as word for now
  },
  {
    id: 'pair4',
    left: { id: 'l4', type: 'image', content: 'https://source.unsplash.com/random/100x100?moon' },
    right: { id: 'r4', type: 'word', content: 'Moon' } // Representing 'pronunciation' as word for now
  },
];

// Function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


const GenericMatchItExercise = ({ language }) => {
  const { t } = useI18n();
  const [leftColumnItems, setLeftColumnItems] = useState([]);
  const [rightColumnItems, setRightColumnItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null); // { id, content, type }
  const [selectedRight, setSelectedRight] = useState(null); // { id, content, type }
  const [matchedPairs, setMatchedPairs] = useState([]); // Array of pair IDs that are matched
  const [feedback, setFeedback] = useState('');

  // Initialize and shuffle columns
  useEffect(() => {
    const leftItems = mockMatchData.map(pair => ({ ...pair.left, pairId: pair.id }));
    const rightItems = mockMatchData.map(pair => ({ ...pair.right, pairId: pair.id }));

    setLeftColumnItems(shuffleArray([...leftItems]));
    setRightColumnItems(shuffleArray([...rightItems]));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setFeedback('');
  }, []); // Runs once on mount

  const handleLeftSelect = (item) => {
    if (matchedPairs.includes(item.pairId)) return; // Already matched
    setSelectedLeft(item);
    setFeedback('');
  };

  const handleRightSelect = (item) => {
    if (matchedPairs.includes(item.pairId)) return; // Already matched
    setSelectedRight(item);
    setFeedback('');
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      // Check if the selected items form a correct pair
      // A pair is correct if their original `pairId`s match
      if (selectedLeft.pairId === selectedRight.pairId) {
        setFeedback(t('feedback.correct', 'Correct! Matched.'));
        setMatchedPairs(prev => [...prev, selectedLeft.pairId]);
      } else {
        setFeedback(t('feedback.incorrect', 'Incorrect. Try again.'));
      }
      // Reset selections after a short delay or immediately
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        // Do not clear feedback immediately if it's an incorrect match, so user can see it
        if (selectedLeft.pairId === selectedRight.pairId) {
            setFeedback(''); // Clear correct feedback faster
        }
      }, 1500);
    }
  }, [selectedLeft, selectedRight, t]);

  const renderItemContent = (item) => {
    if (item.type === 'word') {
      return item.content;
    }
    if (item.type === 'image') {
      return <img src={item.content} alt="match item" style={{maxWidth: '80px', maxHeight: '80px'}}/>;
    }
    // Future: Add 'pronunciation' type handling (e.g., audio icon + text)
    return item.content;
  };

  const allMatched = matchedPairs.length === mockMatchData.length;

  if (allMatched && feedback !== t('feedback.allPairsMatched', 'Great! All pairs matched!')) {
    setFeedback(t('feedback.allPairsMatched', 'Great! All pairs matched!'));
  }


  return (
    <div className="generic-match-it-exercise">
      <h3>{t('vocabulary.oppositesMatchExerciseTitle', 'Match the Pairs')}</h3>

      <div className="matching-grid">
        <div className="column left-column">
          {leftColumnItems.map((item) => (
            <button
              key={item.id}
              className={`match-item
                ${selectedLeft?.id === item.id ? 'selected' : ''}
                ${matchedPairs.includes(item.pairId) ? 'matched' : ''}`}
              onClick={() => handleLeftSelect(item)}
              disabled={matchedPairs.includes(item.pairId)}
            >
              {renderItemContent(item)}
            </button>
          ))}
        </div>
        <div className="column right-column">
          {rightColumnItems.map((item) => (
            <button
              key={item.id}
              className={`match-item
                ${selectedRight?.id === item.id ? 'selected' : ''}
                ${matchedPairs.includes(item.pairId) ? 'matched' : ''}`}
              onClick={() => handleRightSelect(item)}
              disabled={matchedPairs.includes(item.pairId)}
            >
              {renderItemContent(item)}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className={`feedback-message ${matchedPairs.includes(selectedLeft?.pairId) && selectedLeft?.pairId === selectedRight?.pairId ? 'correct' : feedback.includes(t('feedback.incorrect','')) ? 'incorrect' : ''}`}>
          {feedback}
        </div>
      )}

      {allMatched && (
        <button onClick={() => { /* TODO: Implement Next Exercise or Reset */
            // For now, re-initialize to allow re-play
            const leftItems = mockMatchData.map(pair => ({ ...pair.left, pairId: pair.id }));
            const rightItems = mockMatchData.map(pair => ({ ...pair.right, pairId: pair.id }));
            setLeftColumnItems(shuffleArray([...leftItems]));
            setRightColumnItems(shuffleArray([...rightItems]));
            setSelectedLeft(null);
            setSelectedRight(null);
            setMatchedPairs([]);
            setFeedback('');
        }} className="next-button">
          {t('controls.playAgain', 'Play Again')}
        </button>
      )}
    </div>
  );
};

export default GenericMatchItExercise;
