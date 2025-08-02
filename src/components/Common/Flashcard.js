// Import necessary libraries and components.
import React, { useState } from 'react';
import Button from './Button';
// Import the spaced repetition scheduling utility.
import { getNextReviewInterval } from '../../utils/srs';
// Import the CSS for this component.
import './Flashcard.css';

/**
 * A flashcard component with a front and back.
 * It includes logic for spaced repetition scheduling.
 * @param {object} props - The component's props.
 * @param {object} props.card - The flashcard data.
 * @param {function} props.onReviewed - A callback function to handle the review of a card.
 * @param {function} props.onAnswered - A callback function to handle the answering of a card.
 * @returns {JSX.Element} The Flashcard component.
 */
const Flashcard = ({ card, onReviewed, onAnswered }) => {
  // State for tracking whether the card is flipped, and its review interval and factor.
  const [isFlipped, setIsFlipped] = useState(false);
  const [interval, setInterval] = useState(card.interval || 1);
  const [factor, setFactor] = useState(card.factor || 2.5);

  /**
   * Handles the flipping of the card.
   */
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  /**
   * Handles the review of the card.
   * @param {boolean} isCorrect - Whether the user answered the card correctly.
   */
  const handleReview = (isCorrect) => {
    if (onAnswered) {
      onAnswered(isCorrect);
    } else {
      // Calculate the new review interval and factor using the spaced repetition algorithm.
      const newFactor = isCorrect ? factor + 0.1 : Math.max(1.3, factor - 0.2);
      const newInterval = getNextReviewInterval(interval, newFactor);

      // Update the card's review data.
      setFactor(newFactor);
      setInterval(newInterval);

      // Call the onReviewed callback with the updated review data.
      onReviewed(card.id, {
        interval: newInterval,
        factor: newFactor,
        nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
      });
    }
  };

  // Render the flashcard.
  return (
    <div className={`card flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{card.front}</p>
        </div>
        <div className="flashcard-back">
          <p>{card.back}</p>
          {/* Buttons for marking the card as correct or incorrect. */}
          <div className="review-buttons">
            <Button onClick={() => handleReview(true)}>Correct</Button>
            <Button onClick={() => handleReview(false)}>Incorrect</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
