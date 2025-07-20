import React, { useState } from 'react';
import { getNextReviewInterval } from '../../utils/srs';
import './Flashcard.css';

const Flashcard = ({ card, onReviewed, onAnswered }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [interval, setInterval] = useState(card.interval || 1);
  const [factor, setFactor] = useState(card.factor || 2.5);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (isCorrect) => {
    if (onAnswered) {
      onAnswered(isCorrect);
    } else {
      const newFactor = isCorrect ? factor + 0.1 : Math.max(1.3, factor - 0.2);
      const newInterval = getNextReviewInterval(interval, newFactor);

      setFactor(newFactor);
      setInterval(newInterval);

      onReviewed(card.id, {
        interval: newInterval,
        factor: newFactor,
        nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
      });
    }
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{card.front}</p>
        </div>
        <div className="flashcard-back">
          <p>{card.back}</p>
          <div className="review-buttons">
            <button onClick={() => handleReview(true)}>Correct</button>
            <button onClick={() => handleReview(false)}>Incorrect</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
