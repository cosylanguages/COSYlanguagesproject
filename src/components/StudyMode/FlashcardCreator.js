import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import toast from 'react-hot-toast';
import './FlashcardCreator.css';

const FlashcardCreator = () => {
    const { t } = useI18n();
    const [deck, setDeck] = useState(() => {
        const savedDeck = localStorage.getItem('flashcardDeck');
        return savedDeck ? JSON.parse(savedDeck) : { title: '', cards: [] };
    });

    useEffect(() => {
        localStorage.setItem('flashcardDeck', JSON.stringify(deck));
    }, [deck]);

    const handleAddCard = () => {
        const newCard = { front: '', back: '' };
        setDeck({ ...deck, cards: [...deck.cards, newCard] });
    };

    const handleCardChange = (index, side, value) => {
        const newCards = [...deck.cards];
        newCards[index][side] = value;
        setDeck({ ...deck, cards: newCards });
    };

    const handleSaveDeck = () => {
        // In a real app, this would save to a backend.
        // For now, we just show a success message.
        toast.success(t('studyMode.deckSaved', 'Deck saved successfully!'));
    };

    return (
        <div className="flashcard-creator">
            <h2>{t('studyMode.flashcardCreatorTitle', 'Flashcard Creator')}</h2>
            <input
                type="text"
                placeholder={t('studyMode.deckTitlePlaceholder', 'Deck Title')}
                value={deck.title}
                onChange={(e) => setDeck({ ...deck, title: e.target.value })}
            />
            {deck.cards.map((card, index) => (
                <div key={index} className="card-creator">
                    <input
                        type="text"
                        placeholder={t('studyMode.frontPlaceholder', 'Front')}
                        value={card.front}
                        onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder={t('studyMode.backPlaceholder', 'Back')}
                        value={card.back}
                        onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                    />
                </div>
            ))}
            <button className="button" onClick={handleAddCard}>{t('studyMode.addCardButton', 'Add Card')}</button>
            <button className="button button--success" onClick={handleSaveDeck}>{t('studyMode.saveDeckButton', 'Save Deck')}</button>
        </div>
    );
};

export default FlashcardCreator;
