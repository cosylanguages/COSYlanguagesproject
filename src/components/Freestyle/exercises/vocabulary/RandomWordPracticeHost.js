// src/components/Freestyle/exercises/vocabulary/RandomWordPracticeHost.js
import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import ShowWordMode from './ShowWordMode'; 
// Future: import MultipleChoiceWordMode from './MultipleChoiceWordMode';

const EXERCISE_MODES = ['show-details']; // Add more modes like 'multiple-choice-translation', 'type-translation'

const RandomWordPracticeHost = ({ language, days, exerciseKey }) => {
  const [allWords, setAllWords] = useState([]);
  const [currentWordObject, setCurrentWordObject] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalKey, setInternalKey] = useState(0); // For re-triggering ShowWordMode if needed

  const selectNextExercise = useCallback(() => {
    if (allWords.length === 0) {
      setError("No words loaded to select from.");
      setCurrentWordObject(null);
      return;
    }

    const randomWordIndex = Math.floor(Math.random() * allWords.length);
    const nextWord = allWords[randomWordIndex];
    setCurrentWordObject(nextWord);

    const randomModeIndex = Math.floor(Math.random() * EXERCISE_MODES.length);
    setCurrentMode(EXERCISE_MODES[randomModeIndex]);
    
    setInternalKey(prevKey => prevKey + 1); // Ensure child component re-renders with new word/mode
    console.log("RandomWordPracticeHost: Next word selected", nextWord, "Mode:", EXERCISE_MODES[randomModeIndex]);
  }, [allWords]);

  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentWordObject(null); // Clear previous word
      try {
        const { data, error: fetchError } = await loadVocabularyData(language, days);
        if (fetchError) {
          throw new Error(fetchError.message || fetchError);
        }
        if (data && data.length > 0) {
          setAllWords(data);
        } else {
          setAllWords([]);
          setError('No word data found for the selected criteria.');
        }
      } catch (err) {
        console.error("Error loading word data:", err);
        setError(err.message || 'Failed to load words.');
        setAllWords([]);
      }
      setIsLoading(false);
    };

    if (language && days && days.length > 0) {
      fetchWords();
    }
  }, [language, days, exerciseKey]); // Main data fetching effect

  useEffect(() => {
    // Once words are loaded (or reloaded due to key change), select the first exercise
    if (!isLoading && allWords.length > 0) {
      selectNextExercise();
    } else if (!isLoading && allWords.length === 0 && !error) {
        // This case handles when data fetching is complete but no words were found
        setError('No word data available for the selected criteria.');
    }
  }, [allWords, isLoading, selectNextExercise, error]); // Effect to select exercise after data load


  const handleExerciseDone = () => {
    console.log("RandomWordPracticeHost: Exercise mode reported done. Selecting next word/mode.");
    selectNextExercise();
  };

  if (isLoading) {
    return <p>Loading random word exercise...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!currentWordObject || !currentMode) {
    return <p>No word exercise available. Try adjusting selections or check data sources.</p>;
  }

  return (
    <div>
      {currentMode === 'show-details' && currentWordObject && (
        <ShowWordMode
          key={internalKey} // Use key to force re-mount if word/mode changes
          wordObject={currentWordObject}
          language={language}
          onNext={handleExerciseDone}
        />
      )}
      {/* Placeholder for other modes */}
      {/* {currentMode === 'multiple-choice-translation' && currentWordObject && (
        <MultipleChoiceWordMode wordObject={currentWordObject} language={language} onDone={handleExerciseDone} />
      )} */}
      {/* Add more modes here */}
    </div>
  );
};

export default RandomWordPracticeHost;
