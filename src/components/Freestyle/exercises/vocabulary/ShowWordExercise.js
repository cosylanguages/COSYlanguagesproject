import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText, unlockAudioPlayback } from '../../../../utils/speechUtils';
import ExerciseControls from '../../ExerciseControls'; 
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';
import TransliterableText from '../../../Common/TransliterableText';


const ShowWordExercise = ({ language, days, exerciseKey, onComplete }) => { // Added onComplete prop
  const [currentWord, setCurrentWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLatinized } = useLatinizationContext();
  const { t, language: i18nLanguage } = useI18n();

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
  }, [fetchAndSetNewWord, exerciseKey, language, days, t]);

  const handlePronounce = async () => {
    if (currentWord && language) {
      try {
        await pronounceText(currentWord, language);
      } catch (speechError) {
        console.error("Error pronouncing word:", speechError);
        setError(t('errors.pronunciationError', "Could not pronounce the word. Please ensure your browser supports speech synthesis and audio is enabled."));
      }
    }
  };
  
  const handleNext = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Fallback if onComplete is not provided (e.g. when used standalone, though not intended for hosts)
      fetchAndSetNewWord(); 
    }
  };

  const wordStyle = (isLatinized && currentWord !== latinizedWord) ? { fontFamily: 'Arial, sans-serif', fontStyle: 'italic' } : {};

  if (isLoading) {
    return <p><TransliterableText text={t('loading.wordExercise', 'Loading word...')} langOverride={i18nLanguage} /></p>;
  }

  if (error) {
    return (
        <>
            <FeedbackDisplay message={error} type="error" language={i18nLanguage} />
            {/* Still provide controls to try fetching a new word or allow host to move on */}
            <ExerciseControls 
              onRandomize={handleNext} // Or fetchAndSetNewWord if preferred for standalone randomize
              onNextExercise={handleNext}
              config={{
                showNext: true,
                showCheck: false,
                showHint: false,
                showReveal: false,
                showRandomize: true, 
              }}
            />
        </>
    );
  }

  if (!currentWord && !isLoading) { 
    return (
        <>
            <FeedbackDisplay message={t('exercises.noWordToDisplay', "No word to display. Try different selections or check data.")} type="info" language={i18nLanguage} />
             <ExerciseControls 
              onRandomize={handleNext}
              onNextExercise={handleNext}
              config={{
                showNext: true,
                showCheck: false,
                showHint: false,
                showReveal: false,
                showRandomize: true, 
              }}
            />
        </>
    );
  }
  
  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3><TransliterableText text={t('titles.randomWord', 'Random Word')} langOverride={i18nLanguage} /></h3>
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
              🔊 <TransliterableText text={t('buttons.pronounce', 'Pronounce')} langOverride={i18nLanguage} />
            </button>
            <ExerciseControls 
              onRandomize={handleNext} // Changed from fetchAndSetNewWord to handleNext
              onNextExercise={handleNext} // Changed from fetchAndSetNewWord to handleNext
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
