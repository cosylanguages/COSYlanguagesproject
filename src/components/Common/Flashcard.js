// Import necessary libraries and components.
import React, { useState } from 'react';

/**
 * A flashcard component with a front and back.
 * It includes logic for spaced repetition scheduling.
 * @param {object} props - The component's props.
 * @param {object} props.card - The flashcard data.
 * @param {function} props.onReviewed - A callback function to handle the review of a card.
 * @returns {JSX.Element} The Flashcard component.
 */
const Flashcard = ({ card, onReviewed }) => {
  // State for tracking whether the card is flipped.
  const [isFlipped, setIsFlipped] = useState(false);

  /**
   * Handles the flipping of the card.
   */
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  /**
   * Handles the rating of the card.
   * @param {string} rating - The rating given to the card ('easy', 'hard', 'again').
   */
  const handleRating = (rating) => {
    // Placeholder for SRS logic.
    console.log(`Card rated as: ${rating}`);
    // In a real implementation, you would use the onReviewed prop
    // to update the card's scheduling information.
    if (onReviewed) {
      onReviewed(card.id, rating);
    }
  };

  // Render the flashcard.
  return (
    <div className="flashcard" onClick={handleFlip}>
      <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <p>{card.front}</p>
        </div>
        <div className="flashcard-face flashcard-back">
          <p>{card.back}</p>
        </div>
      </div>
      <div className="flashcard-controls">
        <button onClick={() => handleRating('again')}>Again</button>
        <button onClick={() => handleRating('hard')}>Hard</button>
        <button onClick={() => handleRating('easy')}>Easy</button>
      </div>
    </div>
  );
};

export default Flashcard;
