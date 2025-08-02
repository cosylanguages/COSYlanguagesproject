import React, { useState, useEffect, useCallback } from 'react';
import { loadOppositesData, loadVocabularyData } from '../../../../utils/exerciseDataService'; 
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { useI18n } from '../../../../i18n/I18nContext';
import TransliterableText from '../../../Common/TransliterableText'; // For title
import Button from '../../../Common/Button';
import './TypeOppositeExercise.css'; // Will create/update this CSS

const NUM_TOTAL_OPTIONS = 4; // 1 correct, 3 distractors

const TypeOppositeExercise = ({ language, days, exerciseKey, onComplete }) => {
  const [targetDisplayWord, setTargetDisplayWord] = useState(''); // The word for which opposite is asked
  const [correctOptionText, setCorrectOptionText] = useState(''); // The actual correct opposite text
  const [displayOptions, setDisplayOptions] = useState([]); // { id: string, text: string, isCorrect: boolean, status: 'unselected'|'correct'|'incorrect' }
  
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t, language: i18nLanguage } = useI18n();

  const fetchAndPrepareExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setTargetDisplayWord('');
    setCorrectOptionText('');
    setDisplayOptions([]);
    setIsAnswered(false);

    try {
      const { data: oppositesMap, error: oppositesError } = await loadOppositesData(language, days);
      if (oppositesError || !oppositesMap || Object.keys(oppositesMap).length === 0) {
        setError(t('exercises.noOppositesData', 'No opposites data found for the selected criteria.'));
        setIsLoading(false);
        return;
      }

      const wordsWithDefinedOpposites = Object.keys(oppositesMap);
      if (wordsWithDefinedOpposites.length === 0) {
        setError(t('exercises.noWordsWithOpposites', 'No words with opposites found.'));
        setIsLoading(false);
        return;
      }

      const randomWordKey = wordsWithDefinedOpposites[Math.floor(Math.random() * wordsWithDefinedOpposites.length)];
      const currentWord = randomWordKey;
      const actualCorrectOpposite = oppositesMap[currentWord];

      setTargetDisplayWord(currentWord);
      setCorrectOptionText(actualCorrectOpposite);

      // Fetch general vocabulary for distractors
      const { data: allVocab, error: vocabError } = await loadVocabularyData(language, days);
      let potentialDistractorsPool = [];
      if (!vocabError && allVocab) {
        potentialDistractorsPool = allVocab.map(item => typeof item === 'string' ? item : item.word).filter(Boolean);
      } else { // Fallback to keys/values from oppositesMap if general vocab fails
        potentialDistractorsPool = [...new Set([...wordsWithDefinedOpposites, ...Object.values(oppositesMap)])];
      }
      
      potentialDistractorsPool = potentialDistractorsPool.filter(
        word => word !== currentWord && word !== actualCorrectOpposite
      );
      shuffleArray(potentialDistractorsPool);
      const distractors = potentialDistractorsPool.slice(0, NUM_TOTAL_OPTIONS - 1);
      
      const options = [{ text: actualCorrectOpposite, id: `opt_correct_${actualCorrectOpposite}`, isCorrect: true, status: 'unselected' }];
      distractors.forEach((dText, i) => {
        options.push({ text: dText, id: `opt_distractor_${dText}_${i}`, isCorrect: false, status: 'unselected' });
      });

      // Ensure we have NUM_TOTAL_OPTIONS, if not, it's an issue with data pool size.
      if (options.length < 2 && NUM_TOTAL_OPTIONS > 1) { // Need at least one distractor for MCQ
         setError(t('exercises.notEnoughOptionsForMCQ', 'Not enough distinct words to create multiple choice options.'));
         setIsLoading(false);
         return;
      }
      
      setDisplayOptions(shuffleArray(options));

    } catch (err) {
      console.error("TypeOppositeExercise (MCQ) - Error setting up:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchAndPrepareExercise();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchAndPrepareExercise, exerciseKey, language, days, t]);

  const handleOptionClick = (selectedOption) => {
    if (isAnswered || isLoading) return;
    setIsAnswered(true);

    if (selectedOption.isCorrect) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setDisplayOptions(prevOpts => prevOpts.map(opt => 
        opt.id === selectedOption.id ? { ...opt, status: 'correct' } : opt
      ));
    } else {
      setFeedback({ 
        message: t('feedback.incorrectAnswerWas', `Incorrect. The correct opposite of "${getLatinizedText(targetDisplayWord, language)}" is "${getLatinizedText(correctOptionText, language)}".`, { 
          targetWord: getLatinizedText(targetDisplayWord, language), 
          correctAnswer: getLatinizedText(correctOptionText, language) 
        }), 
        type: 'incorrect' 
      });
      setDisplayOptions(prevOpts => prevOpts.map(opt => {
        if (opt.id === selectedOption.id) return { ...opt, status: 'incorrect' };
        if (opt.isCorrect) return { ...opt, status: 'correct' }; // Highlight the correct one
        return opt;
      }));
    }
    if (onComplete) {
      setTimeout(() => onComplete(), selectedOption.isCorrect ? 1500 : 2000); 
    }
  };
  
  const handleNextRequestByControl = () => { 
    if (onComplete) {
      onComplete();
    } else {
      fetchAndPrepareExercise(); // Fallback
    }
  };

  const handlePronounceTargetWord = () => {
    if (targetDisplayWord && language) {
      pronounceText(targetDisplayWord, language).catch(err => {
          console.error("Pronunciation error:", err);
          setFeedback({message: t('errors.pronunciationError', 'Could not pronounce the word.'), type: 'error'});
      });
    }
  };

  if (isLoading) return <p>{t('loading.oppositesExercise', 'Loading opposites exercise...')}</p>;
  if (error) return (
    <>
      <FeedbackDisplay message={error} type="error" />
      <ExerciseControls onNextExercise={handleNextRequestByControl} onRandomize={handleNextRequestByControl} config={{showNext: true, showRandomize: true}} />
    </>
  );
  if (displayOptions.length === 0 && !isLoading) return (
    <>
      <FeedbackDisplay message={t('exercises.noOppositesPair', 'No opposites pair available for MCQ. Try different selections.')} type="info"/>
      <ExerciseControls onNextExercise={handleNextRequestByControl} onRandomize={handleNextRequestByControl} config={{showNext: true, showRandomize: true}} />
    </>
  );

  return (
    <div className="type-opposite-exercise mcq-variant">
      <h3>
        <TransliterableText 
          text={t('titles.whatIsTheOppositeOf', 'What is the opposite of:')} 
          langOverride={i18nLanguage} 
        />
        <strong style={{ marginLeft: '8px', ...(isLatinized && targetDisplayWord !== getLatinizedText(targetDisplayWord, language) && {fontStyle: 'italic'}) }}>
          {getLatinizedText(targetDisplayWord, language)}
        </strong>
        <Button onClick={handlePronounceTargetWord} disabled={!targetDisplayWord} title={t('tooltips.pronounceWord', `Pronounce word`)} className="button--icon">🔊</Button>
      </h3>
      
      <div className="mcq-options-container">
        {displayOptions.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className={`button--mcq ${option.status}`}
            disabled={isAnswered || isLoading}
          >
            {getLatinizedText(option.text, language)}
          </Button>
        ))}
      </div>
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      
      <ExerciseControls
        onNextExercise={handleNextRequestByControl} 
        onRandomize={handleNextRequestByControl}
        isAnswerCorrect={isAnswered && displayOptions.find(o => o.status === 'correct')?.isCorrect}
        // Reveal and Hint are not implemented for this MCQ version yet
        config={{ 
            showCheck: false, 
            showHint: false, 
            showReveal: false,
            showNext: true, 
            showRandomize: true,
        }}
      />
    </div>
  );
};

export default TypeOppositeExercise;
