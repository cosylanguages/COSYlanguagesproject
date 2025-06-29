import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText, unlockAudioPlayback } from '../../../../utils/speechUtils';
import ExerciseControls from '../../ExerciseControls'; 
import FeedbackDisplay from '../../FeedbackDisplay';
import { useProgress } from '../../../../contexts/ProgressContext'; // Import useProgress
import { normalizeString } from '../../../../utils/stringUtils';


const ShowWordExercise = ({ language, days, exerciseKey }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLatinized } = useLatinizationContext();
  const progress = useProgress();

  const latinizedWord = useLatinization(currentWord, language);

  useEffect(() => {
    unlockAudioPlayback(); 
  }, []);


  const fetchAndSetNewWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const oldWord = currentWord; // Keep track of the word being replaced
    setCurrentWord(''); 

    // If there was a word, consider it "seen" or "passed" for SRS purposes
    // This is a simple way; more complex logic might depend on user interaction (e.g., if they pronounced it)
    if (oldWord) {
        const itemId = `showword_${normalizeString(oldWord)}`;
        // For ShowWord, "correct" might mean the user acknowledged/studied it.
        // Since there's no direct input, we might assume "correct" when they move to the next.
        // Or, this could be a place for a "I knew this" / "I didn't know this" button in future.
        // For now, let's log it as a generic interaction.
        progress.scheduleReview(itemId, 'vocab-show-word', true); // Assume "true" as they moved on
    }

    try {
      const { data: words, error: fetchError } = await loadVocabularyData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load vocabulary words.');
      }
      if (words && words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
      } else {
        setError('No vocabulary words found for the selected criteria.');
      }
    } catch (err) {
      console.error("ShowWordExercise - Error fetching word:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [language, days, progress, currentWord]); // Added currentWord to useCallback deps for oldWord tracking

  useEffect(() => {
    if (language && days && days.length > 0) { 
        fetchAndSetNewWord();
    } else {
        setIsLoading(false);
        setError("Please select a language and day(s).");
        setCurrentWord('');
    }
  }, [fetchAndSetNewWord, exerciseKey, language, days]); // fetchAndSetNewWord is already memoized

  const handleNextWord = () => {
    fetchAndSetNewWord(); // This will also trigger the progress tracking for the "oldWord" inside fetchAndSetNewWord
  };

  const handlePronounce = async () => {
    if (currentWord && language) {
      try {
        await pronounceText(currentWord, language);
      } catch (speechError) {
        console.error("Error pronouncing word:", speechError);
        setError("Could not pronounce the word. Please ensure your browser supports speech synthesis and audio is enabled.");
      }
    }
  };
  
  const wordStyle = (isLatinized && currentWord !== latinizedWord) ? { fontFamily: 'Arial, sans-serif', fontStyle: 'italic' } : {};

  if (isLoading) {
    return <p>Loading word...</p>;
  }

  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }

  if (!currentWord && !isLoading) { 
    return <FeedbackDisplay message="No word to display. Try different selections or check data." type="info" />;
  }
  
  const pronounceButtonStyle = {
    padding: '10px 15px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px', 
  };


  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Random Word</h3>
      {currentWord && ( 
        <>
          <div
            style={{ fontSize: '2.5rem', margin: '20px 0', padding: '10px', ...wordStyle }}
            aria-label={`Word to practice: ${currentWord}`}
          >
            {latinizedWord || currentWord}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <button onClick={handlePronounce} style={pronounceButtonStyle} disabled={!currentWord}>
              🔊 Pronounce
            </button>
            <ExerciseControls 
              onNextExercise={handleNextWord}
              config={{
                showNext: true,
                showCheck: false,
                showHint: false,
                showReveal: false,
                showRandomize: false, 
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ShowWordExercise;
