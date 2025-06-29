import React, { useState, useEffect, useCallback } from 'react';
import { loadOppositesData } from '../../../../utils/exerciseDataService'; 
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useProgress } from '../../../../contexts/ProgressContext';
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
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false); // To manage post-correct state

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const progress = useProgress();
  const { t } = useI18n();

  const displayCurrentWord = getLatinizedText(currentWord, language);
  const displayCorrectOpposite = getLatinizedText(correctOpposite, language);

  const fetchNewOppositePair = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setUserInput('');
    setIsRevealed(false);
    setCurrentWord('');
    setCorrectOpposite('');
    setIsAnsweredCorrectly(false); // Reset for new pair

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
    const itemId = `typeopposite_${normalizeString(currentWord)}_${normalizeString(correctOpposite)}`;
    const isCorrect = normalizeString(userInput) === normalizeString(correctOpposite);

    if (isCorrect) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      progress.awardCorrectAnswer(itemId, 'vocab-type-opposite', language);
      setIsAnsweredCorrectly(true); // Mark as correctly answered
      // Auto-progress after a short delay
      setTimeout(() => {
        fetchNewOppositePair();
      }, 1500); // 1.5-second delay
    } else {
      setFeedback({ message: t('feedback.incorrectOpposite', `Incorrect. The opposite of "${displayCurrentWord}" is "${displayCorrectOpposite}".`, { word: displayCurrentWord, opposite: displayCorrectOpposite }), type: 'incorrect' });
      progress.awardIncorrectAnswer(itemId, 'vocab-type-opposite', language);
    }
  };

  const showHint = () => {
    if (!correctOpposite || isRevealed || isAnsweredCorrectly) return;
    const hintLetter = getLatinizedText(correctOpposite[0], language);
    setFeedback({ message: t('feedback.hintStartsWith', `Hint: The opposite starts with '${hintLetter}'.`, { letter: hintLetter }), type: 'hint' });
  };

  const revealAnswer = () => {
    if (!correctOpposite || !currentWord || isAnsweredCorrectly) return;
    const itemId = `typeopposite_${normalizeString(currentWord)}_${normalizeString(correctOpposite)}`;
    setUserInput(correctOpposite);
    setFeedback({ message: t('feedback.revealedOpposite', `The opposite of "${displayCurrentWord}" is "${displayCorrectOpposite}".`, { word: displayCurrentWord, opposite: displayCorrectOpposite }), type: 'info' });
    setIsRevealed(true);
    progress.scheduleReview(itemId, 'vocab-type-opposite', language, false); // Ensure language is passed
     // Auto-progress after showing revealed answer
    setTimeout(() => {
        fetchNewOppositePair();
    }, 2000); // Slightly longer delay for revealed answers
  };

  const handleNext = () => { // Manual next button action
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
        <div style={{ fontSize: '2rem', padding: '10px', ...(isLatinized && currentWord !== displayCurrentWord && {fontStyle: 'italic'}) }}>
          {displayCurrentWord}
        </div>
        <button onClick={() => handlePronounceWord(currentWord)} disabled={!currentWord} title={t('tooltips.pronounceWord', `Pronounce word`)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', marginLeft:'5px'}}>🔊</button>
      </div>
      
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder={t('placeholders.typeTheOpposite', "Type the opposite...")}
        disabled={isRevealed || isAnsweredCorrectly} // Disable input after correct answer or reveal
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
        onNextExercise={handleNext} // Manual next still available
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
