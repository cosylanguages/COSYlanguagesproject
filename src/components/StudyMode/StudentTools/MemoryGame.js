import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MemoryGame.css';

const MemoryGame = ({ studySet }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const createGameCards = useCallback(async (deckId) => {
    if (!studySet || !studySet.items) return;

    const gameItems = studySet.items.slice(0, 8); // Use first 8 items for a 16-card game
    let gameCards = [];
    gameItems.forEach(item => {
      gameCards.push({ type: 'word', value: item.word, id: `${item.id}-word` });
      gameCards.push({ type: 'image', value: item.imageUrl, id: `${item.id}-image` }); // Assuming imageUrl exists
    });

    // Fetch cards from Deck of Cards API to use as backs
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${gameCards.length}`);
      const apiCards = response.data.cards;

      // Combine API cards with game cards
      const combinedCards = gameCards.map((gameCard, index) => ({
        ...gameCard,
        apiCard: apiCards[index],
      }));

      // Shuffle cards
      combinedCards.sort(() => Math.random() - 0.5);
      setCards(combinedCards);

    } catch (error) {
      console.error('Error drawing cards:', error);
    }
  }, [studySet]);

  useEffect(() => {
    const newDeck = async () => {
      try {
        const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        createGameCards(response.data.deck_id);
      } catch (error) {
        console.error('Error creating a new deck:', error);
      }
    };
    newDeck();
  }, [createGameCards]);

  const handleCardClick = (card) => {
    if (isChecking || flippedCards.includes(card) || matchedCards.includes(card.id.split('-')[0])) return;

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.id.split('-')[0] === secondCard.id.split('-')[0]) {
        setMatchedCards([...matchedCards, firstCard.id.split('-')[0]]);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (card) => flippedCards.includes(card) || matchedCards.includes(card.id.split('-')[0]);

  return (
    <div className="memory-game">
      <h2>Memory Game</h2>
      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.apiCard.code}
            className={`card ${isCardFlipped(card) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front">
                {card.type === 'word' ? <p>{card.value}</p> : <img src={card.value} alt="card" />}
              </div>
              <div className="card-back">
                <img src={card.apiCard.image} alt="card back" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
