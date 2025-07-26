import React from 'react';
import FlashcardPlayer from '../FlashcardPlayer';

const FlashcardsTool = () => {
  // Mock data for flashcards
  const flashcards = [
    { front: 'Hello', back: 'Hola' },
    { front: 'Goodbye', back: 'Adiós' },
    { front: 'Thank you', back: 'Gracias' },
  ];

  return (
    <div>
      <h3>Flashcards</h3>
      <FlashcardPlayer cards={flashcards} />
    </div>
  );
};

export default FlashcardsTool;
