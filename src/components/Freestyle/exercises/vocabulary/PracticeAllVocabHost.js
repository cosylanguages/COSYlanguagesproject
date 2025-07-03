// src/components/Freestyle/exercises/vocabulary/PracticeAllVocabHost.js
import React, { useState, useEffect, useCallback } from 'react';
import RandomWordPracticeHost from './RandomWordPracticeHost';
import RandomImagePracticeHost from './RandomImagePracticeHost';
import ListeningPracticeHost from './ListeningPracticeHost';

const VOCAB_PRACTICE_TYPES = ['word', 'image', 'listening'];

const PracticeAllVocabHost = ({ language, days, exerciseKey }) => {
  const [currentPracticeType, setCurrentPracticeType] = useState(null);
  const [internalKey, setInternalKey] = useState(0); // To force re-render of child host

  const selectRandomPracticeType = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * VOCAB_PRACTICE_TYPES.length);
    setCurrentPracticeType(VOCAB_PRACTICE_TYPES[randomIndex]);
    setInternalKey(prevKey => prevKey + 1); // Change key to re-mount child component
    console.log("PracticeAllVocabHost: New practice type selected:", VOCAB_PRACTICE_TYPES[randomIndex]);
  }, []);

  useEffect(() => {
    selectRandomPracticeType();
  }, [exerciseKey, selectRandomPracticeType]); // Re-select when main exerciseKey changes

  // Could add a button to manually switch to the next random type
  const handleNextExercise = () => {
    selectRandomPracticeType();
  };

  if (!currentPracticeType) {
    return <p>Loading practice session...</p>;
  }

  let ExerciseComponent;
  switch (currentPracticeType) {
    case 'word':
      ExerciseComponent = <RandomWordPracticeHost language={language} days={days} exerciseKey={internalKey} />;
      break;
    case 'image':
      ExerciseComponent = <RandomImagePracticeHost language={language} days={days} exerciseKey={internalKey} />;
      break;
    case 'listening':
      ExerciseComponent = <ListeningPracticeHost language={language} days={days} exerciseKey={internalKey} />;
      break;
    default:
      return <p>Error: Unknown practice type selected.</p>;
  }

  return (
    <div>
      <h3>Practice All Vocabulary</h3>
      {ExerciseComponent}
      <button 
        onClick={handleNextExercise} 
        style={{ marginTop: '20px', padding: '10px 15px', fontSize: '1rem' }}
      >
        Next Random Exercise Type
      </button>
    </div>
  );
};

export default PracticeAllVocabHost;
