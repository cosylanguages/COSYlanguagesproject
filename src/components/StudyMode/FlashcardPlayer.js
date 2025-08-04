import React, { useState } from 'react';

const FlashcardPlayer = ({ deck }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % deck.items.length);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (!deck || !deck.items || deck.items.length === 0) {
        return <div>No flashcards in this deck.</div>;
    }

    const currentCard = deck.items[currentCardIndex];

    return (
        <div className="flashcard-player">
            <h2>{deck.title}</h2>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className="front">{currentCard.term1}</div>
                <div className="back">{currentCard.term2}</div>
            </div>
            <button onClick={handleNextCard}>Next Card</button>
        </div>
    );
};

export default FlashcardPlayer;
