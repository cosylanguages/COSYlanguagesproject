import React, { useState } from 'react';

const FlashcardCreator = () => {
    const [deck, setDeck] = useState({ title: '', cards: [] });

    const handleAddCard = () => {
        const newCard = { front: '', back: '' };
        setDeck({ ...deck, cards: [...deck.cards, newCard] });
    };

    const handleCardChange = (index, side, value) => {
        const newCards = [...deck.cards];
        newCards[index][side] = value;
        setDeck({ ...deck, cards: newCards });
    };

    return (
        <div className="flashcard-creator">
            <h2>Flashcard Creator</h2>
            <input
                type="text"
                placeholder="Deck Title"
                value={deck.title}
                onChange={(e) => setDeck({ ...deck, title: e.target.value })}
            />
            {deck.cards.map((card, index) => (
                <div key={index} className="card-creator">
                    <input
                        type="text"
                        placeholder="Front"
                        value={card.front}
                        onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Back"
                        value={card.back}
                        onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleAddCard}>Add Card</button>
            <button>Save Deck</button>
        </div>
    );
};

export default FlashcardCreator;
