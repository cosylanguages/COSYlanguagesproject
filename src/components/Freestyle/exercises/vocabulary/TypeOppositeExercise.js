import React, { useState, useEffect, useCallback } from 'react';
import { loadOppositesData } from '../../../../utils/exerciseDataService'; 
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { normalizeString } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext';


const TypeOppositeExercise = ({ language, days, exerciseKey }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [correctOpposite, setCorrectOpposite] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false); 

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const fetchNewOppositePair = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setUserInput('');
    setIsRevealed(false);
    setCurrentWord('');
    setCorrectOpposite('');
    setIsAnsweredCorrectly(false); 

    try {
      const { data: oppositesMap, error: oppositesError } = await loadOppositesData(language, days);
      if (oppositesError) {
        throw new Error(oppositesError.message || oppositesError.error || 'Failed to load opposites data.');
      }

      if (!oppositesMap || Object.keys(oppositesMap).length === 0) {
        setError(t('exercises.noOppositesData', 'No opposites data found for the selected criteria.'));
        setIsLoading(false);
        return;
      }

      const wordsWithOpposites = Object.keys(oppositesMap);
      if (wordsWithOpposites.length === 0) {
        setError(t('exercises.noWordsWithOpposites', 'No words with opposites found in the data.'));
        setIsLoading(false);
        return;
      }

      const randomWord = wordsWithOpposites[Math.floor(Math.random() * wordsWithOpposites.length)];
      setCurrentWord(randomWord);
      setCorrectOpposite(oppositesMap[randomWord]);

    } catch (err) {
      console.error("TypeOppositeExercise - Error fetching data:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchNewOppositePair();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchNewOppositePair, exerciseKey, language, days, t]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!correctOpposite || isRevealed || !currentWord || isAnsweredCorrectly) return;
    
    const normalizedUserInput = normalizeString(userInput);
    const normalizedCorrectOpposite = normalizeString(correctOpposite);
    // const itemId = `typeopposite_${normalizeString(currentWord)}_${normalizedCorrectOpposite}`; // Not used

    const isCorrect = normalizedUserInput === normalizedCorrectOpposite;

    if (isCorrect) {
      setIsAnsweredCorrectly(true);
      if (userInput.trim() === correctOpposite) {
        setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      } else {
        const displayCorrect = getLatinizedText(correctOpposite, language);
        const displayWord = getLatinizedText(currentWord, language);
        setFeedback({ 
            message: t('feedback.correctOppositeIs', `Correct! The opposite of "${displayWord}" is: ${displayCorrect}`, { word: displayWord, opposite: displayCorrect }), 
            type: 'correct' 
        });
      }
      setTimeout(() => {
        fetchNewOppositePair();
      }, 1500); 
    } else {
      const displayOriginalWord = getLatinizedText(currentWord, language);
      const displayOriginalOpposite = getLatinizedText(correctOpposite, language);
      setFeedback({ 
          message: t('feedback.incorrectOpposite', `Incorrect. The opposite of "${displayOriginalWord}" is "${displayOriginalOpposite}".`, { word: displayOriginalWord, opposite: displayOriginalOpposite }), 
          type: 'incorrect' 
      });
    }
  };

  const showHint = () => {
    if (!correctOpposite || isRevealed || isAnsweredCorrectly) return;
    const hintLetter = getLatinizedText(correctOpposite[0], language);
    setFeedback({ message: t('feedback.hintStartsWith', `Hint: The opposite starts with '${hintLetter}'.`, { letter: hintLetter }), type: 'hint' });
  };

  const revealAnswer = () => {
    if (!correctOpposite || !currentWord || isAnsweredCorrectly) return;
    // const itemId = `typeopposite_${normalizeString(currentWord)}_${normalizeString(correctOpposite)}`; // Not used
    setUserInput(correctOpposite);
    const displayOriginalWord = getLatinizedText(currentWord, language);
    const displayOriginalOpposite = getLatinizedText(correctOpposite, language);
    setFeedback({ 
        message: t('feedback.revealedOpposite', `The opposite of "${displayOriginalWord}" is "${displayOriginalOpposite}".`, { word: displayOriginalWord, opposite: displayOriginalOpposite }), 
        type: 'info' 
    });
    setIsRevealed(true);
    setIsAnsweredCorrectly(true); // Consider revealed as answered for flow
    setTimeout(() => {
        fetchNewOppositePair();
    }, 2000);
  };

  const handleNext = () => { 
    fetchNewOppositePair();
  };

  const handlePronounceWord = (wordToPronounce) => {
    if (wordToPronounce && language) {
      pronounceText(wordToPronounce, language).catch(err => {
          console.error("Pronunciation error:", err);
          setFeedback({message: t('errors.pronunciationError', 'Could not pronounce the word.'), type: 'error'});
      });
    }
  };

  const displayCurrentWordForUI = getLatinizedText(currentWord, language);
  // const displayCorrectOppositeForUI = getLatinizedText(correctOpposite, language); // Not used directly in render but good for consistency

  if (isLoading) {
    return <p>{t('loading.oppositesExercise', 'Loading opposites exercise...')}</p>;
  }

  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }

  if (!currentWord || !correctOpposite) {
    return <FeedbackDisplay message={t('exercises.noOppositesPair', 'No opposites pair available. Try different selections.')} type="info"/>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.whatIsTheOpposite', 'What is the opposite of:')}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '2rem', padding: '10px', ...(isLatinized && currentWord !== displayCurrentWordForUI && {fontStyle: 'italic'}) }}>
          {displayCurrentWordForUI}
        </div>
        <button onClick={() => handlePronounceWord(currentWord)} disabled={!currentWord} title={t('tooltips.pronounceWord', `Pronounce word`)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', marginLeft:'5px'}}>🔊</button>
      </div>
      
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder={t('placeholders.typeTheOpposite', "Type the opposite...")}
        disabled={isRevealed || isAnsweredCorrectly} 
        style={{ padding: '10px', fontSize: '1rem', width: '250px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        onKeyPress={(event) => {
            if (event.key === 'Enter' && !isRevealed && !isAnsweredCorrectly) {
              checkAnswer();
            }
        }}
      />
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      
      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAnsweredCorrectly && currentWord ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAnsweredCorrectly && currentWord ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAnsweredCorrectly && currentWord ? revealAnswer : undefined}
        onNextExercise={handleNext} 
        config={{ 
            showCheck: !isRevealed && !isAnsweredCorrectly && !!currentWord, 
            showHint: !isRevealed && !isAnsweredCorrectly && !!currentWord, 
            showReveal: !isRevealed && !isAnsweredCorrectly && !!currentWord,
            showNext: true, 
        }}
      />
    </div>
  );
};

export default TypeOppositeExercise;
