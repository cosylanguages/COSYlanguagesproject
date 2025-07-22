import React, { useState, useEffect } from 'react';
import './FlashcardPage.css';

function FlashcardPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    fetch('/data/flashcards.json')
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (ease) => {
    const card = flashcards[currentCardIndex];
    const now = new Date();
    let nextReview;

    switch (ease) {
      case 'again':
        nextReview = new Date(now.getTime() + 1 * 60 * 1000); // 1 minute
        break;
      case 'good':
        nextReview = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
        break;
      case 'easy':
        nextReview = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days
        break;
      default:
        nextReview = now;
    }

    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentCardIndex] = { ...card, nextReview: nextReview.toISOString() };
    setFlashcards(updatedFlashcards);

    handleNextCard();
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  return (
    <div className="flashcard-page">
      {flashcards.length > 0 && (
        <>
          <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
            <div className="flashcard">
              <div className="front">
                {flashcards[currentCardIndex].front}
              </div>
              <div className="back">
                {flashcards[currentCardIndex].back}
              </div>
            </div>
          </div>
          {isFlipped && (
            <div className="answer-buttons">
              <button onClick={() => handleAnswer('again')}>Again</button>
              <button onClick={() => handleAnswer('good')}>Good</button>
              <button onClick={() => handleAnswer('easy')}>Easy</button>
            </div>
          )}
          <button onClick={handleNextCard}>Next Card</button>
        </>
      )}
    </div>
  );
}

export default FlashcardPage;
