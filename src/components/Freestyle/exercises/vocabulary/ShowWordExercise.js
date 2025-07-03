import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText, unlockAudioPlayback } from '../../../../utils/speechUtils';
import ExerciseControls from '../../ExerciseControls'; 
import FeedbackDisplay from '../../FeedbackDisplay';
// import { normalizeString } from '../../../../utils/stringUtils'; // Not used after progress removal
import { useI18n } from '../../../../i18n/I18nContext';


const ShowWordExercise = ({ language, days, exerciseKey }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLatinized } = useLatinizationContext();
  const { t } = useI18n();

  const latinizedWord = useLatinization(currentWord, language);

  useEffect(() => {
    unlockAudioPlayback(); 
  }, []);


  const fetchAndSetNewWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // const oldWord = currentWord; // No longer needed without progress context
    setCurrentWord(''); 

    try {
      const { data: words, error: fetchError } = await loadVocabularyData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load vocabulary words.');
      }
      if (words && words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
      } else {
        setError(t('exercises.noVocabWords', 'No vocabulary words found for the selected criteria.'));
      }
    } catch (err) {
      console.error("ShowWordExercise - Error fetching word:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]); // Removed currentWord from deps

  useEffect(() => {
    if (language && days && days.length > 0) { 
        fetchAndSetNewWord();
    } else {
        setIsLoading(false);
        setError(t('errors.selectLangDay', "Please select a language and day(s)."));
        setCurrentWord('');
    }
  }, [fetchAndSetNewWord, exerciseKey, language, days]); 

  const handlePronounce = async () => {
    if (currentWord && language) {
      try {
        await pronounceText(currentWord, language);
      } catch (speechError) {
        console.error("Error pronouncing word:", speechError);
        // Use FeedbackDisplay for errors if available and appropriate, or keep alert/console
        setError(t('errors.pronunciationError', "Could not pronounce the word. Please ensure your browser supports speech synthesis and audio is enabled."));
      }
    }
  };
  
  const wordStyle = (isLatinized && currentWord !== latinizedWord) ? { fontFamily: 'Arial, sans-serif', fontStyle: 'italic' } : {};

  if (isLoading) {
    return <p>{t('loading.wordExercise', 'Loading word...')}</p>;
  }

  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }

  if (!currentWord && !isLoading) { 
    return <FeedbackDisplay message={t('exercises.noWordToDisplay', "No word to display. Try different selections or check data.")} type="info" />;
  }
  
  // Pronounce button will use the .action-button style from ExerciseControls.css by adding the class
  // Or it can remain custom if preferred, but for unification, using common styles is better.
  // For this refactor, I'll make it use the action-button style.

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.randomWord', 'Random Word')}</h3>
      {currentWord && ( 
        <>
          <div
            style={{ fontSize: '2.5rem', margin: '20px 0', padding: '10px', ...wordStyle }}
            aria-label={`Word to practice: ${currentWord}`}
          >
            {latinizedWord || currentWord}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
            <button onClick={handlePronounce} className="action-button" disabled={!currentWord}>
              🔊 {t('buttons.pronounce', 'Pronounce')}
            </button>
            <ExerciseControls 
              onRandomize={fetchAndSetNewWord} // Randomize shows a new word
              onNextExercise={fetchAndSetNewWord} // Next exercise also shows a new word
              config={{
                showNext: true,
                showCheck: false,
                showHint: false,
                showReveal: false,
                showRandomize: true, 
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ShowWordExercise;
