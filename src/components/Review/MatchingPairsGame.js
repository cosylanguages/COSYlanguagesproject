import React, { useState, useEffect } from 'react';
import './MatchingPairsGame.css';

function MatchingPairsGame({ pairs }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    const shuffledPairs = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((pair, index) => ({ ...pair, id: index }));
    setCards(shuffledPairs);
  }, [pairs]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || matchedPairs.includes(clickedCard.id)) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.word === secondCard.word) {
        setMatchedPairs([...matchedPairs, firstCard.id, secondCard.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="matching-pairs-game">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${flippedCards.includes(card) || matchedPairs.includes(card.id) ? 'flipped' : ''}`}
          onClick={() => handleCardClick(card)}
        >
          {flippedCards.includes(card) || matchedPairs.includes(card.id) ? card.word : ''}
        </div>
      ))}
    </div>
  );
}

export default MatchingPairsGame;
