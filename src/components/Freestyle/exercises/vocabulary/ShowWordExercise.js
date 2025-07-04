import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText, unlockAudioPlayback } from '../../../../utils/speechUtils';
import ExerciseControls from '../../ExerciseControls'; 
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';
import TransliterableText from '../../../Common/TransliterableText'; // Import TransliterableText


const ShowWordExercise = ({ language, days, exerciseKey }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // This will store translated error messages
  const { isLatinized } = useLatinizationContext(); // For wordStyle
  const { t, language: i18nLanguage } = useI18n(); // Get UI language

  // latinizedWord is for the dynamic content (currentWord) in the target learning language
  const latinizedWord = useLatinization(currentWord, language);

  useEffect(() => {
    unlockAudioPlayback(); 
  }, []);


  const fetchAndSetNewWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
  }, [language, days, t]); 

  useEffect(() => {
    if (language && days && days.length > 0) { 
        fetchAndSetNewWord();
    } else {
        setIsLoading(false);
        setError(t('errors.selectLangDay', "Please select a language and day(s)."));
        setCurrentWord('');
    }
  }, [fetchAndSetNewWord, exerciseKey, language, days, t]); // t added as it's used in setError

  const handlePronounce = async () => {
    if (currentWord && language) {
      try {
        await pronounceText(currentWord, language); // Pronounce the original word in its language
      } catch (speechError) {
        console.error("Error pronouncing word:", speechError);
        setError(t('errors.pronunciationError', "Could not pronounce the word. Please ensure your browser supports speech synthesis and audio is enabled."));
      }
    }
  };
  
  // Style for the dynamic word, based on whether it's latinized (target learning language)
  const wordStyle = (isLatinized && currentWord !== latinizedWord) ? { fontFamily: 'Arial, sans-serif', fontStyle: 'italic' } : {};

  if (isLoading) {
    // UI text, should use i18nLanguage for potential latinization
    return <p><TransliterableText text={t('loading.wordExercise', 'Loading word...')} langOverride={i18nLanguage} /></p>;
  }

  if (error) {
    // Error messages are from t(), so they are in i18nLanguage. Pass this to FeedbackDisplay.
    return <FeedbackDisplay message={error} type="error" language={i18nLanguage} />;
  }

  if (!currentWord && !isLoading) { 
    // UI text, should use i18nLanguage
    return <FeedbackDisplay message={t('exercises.noWordToDisplay', "No word to display. Try different selections or check data.")} type="info" language={i18nLanguage} />;
  }
  
  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3><TransliterableText text={t('titles.randomWord', 'Random Word')} langOverride={i18nLanguage} /></h3>
      {currentWord && ( 
        <>
          <div
            style={{ fontSize: '2.5rem', margin: '20px 0', padding: '10px', ...wordStyle }}
            aria-label={`Word to practice: ${currentWord}`} // Screen readers get the original word
          >
            {latinizedWord || currentWord} {/* Display pre-latinized dynamic content */}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
            <button onClick={handlePronounce} className="action-button" disabled={!currentWord}>
              🔊 <TransliterableText text={t('buttons.pronounce', 'Pronounce')} langOverride={i18nLanguage} />
            </button>
            <ExerciseControls 
              onRandomize={fetchAndSetNewWord}
              onNextExercise={fetchAndSetNewWord}
              config={{
                showNext: true,
                showCheck: false,
                showHint: false,
                showReveal: false,
                showRandomize: true, 
              }}
              // ExerciseControls itself needs to be made TransliterableText-aware for its button texts
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ShowWordExercise;
