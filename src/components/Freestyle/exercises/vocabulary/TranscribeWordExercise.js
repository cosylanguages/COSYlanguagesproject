import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { normalizeString as normalizeStringUtil } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext';

const TranscribeWordExercise = ({ language, days, exerciseKey }) => {
  const [correctWord, setCorrectWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const fetchAndSetNewWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setUserInput('');
    setIsRevealed(false);
    setCorrectWord('');
    setIsAnsweredCorrectly(false);
    try {
      const { data: words, error: fetchError } = await loadVocabularyData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load vocabulary words.');
      }
      if (words && words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const wordToTranscribe = words[randomIndex];
        setCorrectWord(wordToTranscribe);
        
        if (wordToTranscribe && language) {
            pronounceText(wordToTranscribe, language).catch(err => {
                console.error("Autoplay pronunciation error:", err);
            });
        }
      } else {
        setError(t('exercises.noWordsFound', 'No vocabulary words found for the selected criteria.'));
      }
    } catch (err) {
      console.error("TranscribeWordExercise - Error fetching word:", err);
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
      setCorrectWord('');
    }
  }, [fetchAndSetNewWord, exerciseKey, language, days, t]);

  const handlePlaySound = () => {
    if (correctWord && language) {
      pronounceText(correctWord, language).catch(err => {
        console.error("Pronunciation error on button click:", err);
        setFeedback({ message: t('errors.soundPlayError', 'Could not play sound.'), type: 'error'});
      });
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!correctWord || isRevealed || isAnsweredCorrectly) return;
    
    const normalizedUserInput = normalizeStringUtil(userInput);
    const normalizedCorrectWord = normalizeStringUtil(correctWord);
    // const itemId = `transcribe_${normalizedCorrectWord}`; // Not currently used

    const isCorrect = normalizedUserInput === normalizedCorrectWord;

    if (isCorrect) {
      setIsAnsweredCorrectly(true);
      // Use untrimmed userInput for exact match comparison
      if (userInput.trim() === correctWord) {
        setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      } else {
        const displayCorrect = getLatinizedText(correctWord, language);
        setFeedback({ 
          message: t('feedback.correctAnswerIs', `Correct! The answer is: ${displayCorrect}`, { correctAnswer: displayCorrect }), 
          type: 'correct' 
        });
      }
      setTimeout(() => {
        fetchAndSetNewWord();
      }, 1500); // 1.5-second delay
    } else {
      const displayCorrect = getLatinizedText(correctWord, language);
      setFeedback({ message: t('feedback.incorrectAnswerIs', `Incorrect. The correct answer is: ${displayCorrect}`, { correctAnswer: displayCorrect }), type: 'incorrect' });
    }
  };

  const showHint = () => {
    if (!correctWord || isRevealed || isAnsweredCorrectly) return;
    const firstLetter = getLatinizedText(correctWord[0], language);
    setFeedback({ message: t('feedback.hintWordStructure', `Hint: The word has ${correctWord.length} letters and starts with '${firstLetter}'.`, { length: correctWord.length, letter: firstLetter }), type: 'hint' });
  };

  const revealTheAnswer = () => {
    if (!correctWord || isAnsweredCorrectly) return; 
    const latinizedCorrectDisplay = getLatinizedText(correctWord, language);
    const displayAnswer = isLatinized ? latinizedCorrectDisplay : correctWord;
    // const itemId = `transcribe_${normalizeStringUtil(correctWord)}`; // Not used
    
    setUserInput(correctWord); 
    setFeedback({ message: t('feedback.correctAnswerIs', `The correct answer is: ${displayAnswer}`, { correctAnswer: displayAnswer }), type: 'info' });
    setIsRevealed(true);

    if (!isAnsweredCorrectly) { 
        setTimeout(() => {
            fetchAndSetNewWord();
        }, 2000); 
    }
  };

  const handleNext = () => {
    fetchAndSetNewWord();
  };

  if (isLoading) {
    return <p>{t('loading.transcribeExercise', 'Loading transcription exercise...')}</p>;
  }

  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }

  if (!correctWord && !isLoading) { 
    return <FeedbackDisplay message={t('exercises.noWordForTranscription', "No word available for transcription. Try different selections.")} type="info" />;
  }
  
  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.typeWhatYouHear', 'Type What You Hear')}</h3>
      <button onClick={handlePlaySound} disabled={!correctWord || isLoading} style={{ fontSize: '2rem', margin: '20px', background: 'none', border: 'none', cursor: 'pointer' }} aria-label={t('aria.playSound', "Play sound")}>
        🔊
      </button>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder={t('placeholders.typeHere', "Type here...")}
        disabled={isRevealed || isAnsweredCorrectly || isLoading}
        style={{ padding: '10px', fontSize: '1rem', width: '250px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        onKeyPress={(event) => {
            if (event.key === 'Enter' && !isRevealed && !isAnsweredCorrectly) {
              checkAnswer();
            }
        }}
      />
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAnsweredCorrectly && !!correctWord ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAnsweredCorrectly && !!correctWord ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAnsweredCorrectly && !!correctWord ? revealTheAnswer : undefined}
        onNextExercise={handleNext}
        config={{ 
            showCheck: !isRevealed && !isAnsweredCorrectly && !!correctWord, 
            showHint: !isRevealed && !isAnsweredCorrectly && !!correctWord, 
            showReveal: !isRevealed && !isAnsweredCorrectly && !!correctWord,
            showNext: true, 
        }}
      />
    </div>
  );
};

export default TranscribeWordExercise;
