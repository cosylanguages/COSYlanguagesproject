import React, { useState } from 'react';

const Flashcard = ({ front, back, onAnswered }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
            <div className="front">
                <p>{front}</p>
            </div>
            <div className="back">
                <p>{back}</p>
                <div className="answer-buttons">
                    <button onClick={() => onAnswered(true)}>Correct</button>
                    <button onClick={() => onAnswered(false)}>Incorrect</button>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
