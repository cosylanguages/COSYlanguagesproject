import React, { useState } from 'react';
import Flashcard from '../../../components/Common/Flashcard';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../../components/Common/TransliterableText';
import './StudyToolsPage.css';

const StudyToolsPage = () => {
  const { t } = useI18n();
  const [cards, setCards] = useState([
    { id: 1, front: 'Bonjour', back: 'Hello', interval: 1, factor: 2.5 },
    { id: 2, front: 'Au revoir', back: 'Goodbye', interval: 1, factor: 2.5 },
  ]);

  const handleReviewed = (cardId, reviewData) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, ...reviewData } : card
    ));
  };

  return (
    <div className="study-tools-page">
      <h1><TransliterableText text={t('studyToolsPage.title', 'Study Tools')} /></h1>
      {cards.map(card => (
        <Flashcard key={card.id} card={card} onReviewed={handleReviewed} />
      ))}
    </div>
  );
};

export default StudyToolsPage;
