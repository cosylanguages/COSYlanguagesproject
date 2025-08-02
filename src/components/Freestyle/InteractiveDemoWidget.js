import React, { useState, useEffect } from 'react';
import Flashcard from '../Common/Flashcard';
import './InteractiveDemoWidget.css';

const InteractiveDemoWidget = () => {
  const [demoCard, setDemoCard] = useState(null);

  useEffect(() => {
    const fetchRandomCard = async () => {
      try {
        const res = await fetch('/data/vocabulary/images/images.json');
        const data = await res.json();

        const allWords = Object.values(data).flat();
        const randomWordData = allWords[Math.floor(Math.random() * allWords.length)];

        const availableLanguages = Object.keys(randomWordData.translations);
        let lang1, lang2;

        do {
          lang1 = availableLanguages[Math.floor(Math.random() * availableLanguages.length)];
          lang2 = availableLanguages[Math.floor(Math.random() * availableLanguages.length)];
        } while (lang1 === lang2);

        setDemoCard({
          id: 'demo-card-' + Math.random(),
          front: randomWordData.translations[lang1],
          back: randomWordData.translations[lang2],
        });
      } catch (error) {
        console.error("Failed to fetch demo card:", error);
        // Fallback card
        setDemoCard({
            id: 'demo-card-fallback',
            front: 'Hello',
            back: 'Bonjour',
        });
      }
    };

    fetchRandomCard();
  }, []);

  if (!demoCard) {
    return <div>Loading a fun flashcard...</div>;
  }

  return (
    <div className="interactive-demo-widget">
      <h3>Try a Flashcard!</h3>
      <Flashcard card={demoCard} onReviewed={() => {}} />
    </div>
  );
};

export default InteractiveDemoWidget;
