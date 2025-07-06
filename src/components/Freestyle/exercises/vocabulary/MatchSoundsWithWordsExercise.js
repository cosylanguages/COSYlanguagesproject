// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
// import { useLatinizationContext } from '../../../../contexts/LatinizationContext'; // Commented out: isLatinized from here is unused
import useLatinization from '../../../../hooks/useLatinization';
import { useI18n } from '../../../../i18n/I18nContext';
import './MatchSoundsWithWordsExercise.css'; // To be created

const NUM_OPTIONS = 4; // Total options: 1 correct, 3 distractors

const MatchSoundsWithWordsExercise = ({ language, days, exerciseKey, onComplete }) => {
  const { t } = useI18n();
  const getLatinizedText = useLatinization; // For displaying word options

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [targetWord, setTargetWord] = useState(null); // { word: string, audio: string }
  const [displayOptions, setDisplayOptions] = useState([]); // Array of { text: string, id: string, isCorrect: boolean, status: 'unselected'|'correct'|'incorrect' }
  
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isAnswered, setIsAnswered] = useState(false); // To disable options after an answer

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setTargetWord(null);
    setDisplayOptions([]);
    setIsAnswered(false);

    try {
      const { data: allVocabItems, error: fetchError } = await loadVocabularyData(language, days);
      if (fetchError) throw new Error(fetchError.message || t('errors.failedToLoadData', 'Failed to load data.'));
      
      const itemsWithAudio = allVocabItems.filter(item => item.word && item.audio);
      if (itemsWithAudio.length === 0) {
        setError(t('exercises.noAudioData', 'No words with audio found for this exercise.'));
        setIsLoading(false);
        return;
      }

      // Select target word
      const randomTargetIndex = Math.floor(Math.random() * itemsWithAudio.length);
      const currentTarget = itemsWithAudio[randomTargetIndex];
      setTargetWord({ word: currentTarget.word, audio: currentTarget.audio });

      // Select distractors
      const distractors = [];
      // let attempts = 0; // ESLint: 'attempts' is assigned a value but never used. Prevent infinite loop if not enough unique words
      const potentialDistractors = itemsWithAudio.filter(item => item.word !== currentTarget.word);
      const shuffledPotentialDistractors = shuffleArray(potentialDistractors);

      for (const distractor of shuffledPotentialDistractors) {
        if (distractors.length < NUM_OPTIONS - 1) {
          distractors.push(distractor.word);
        } else {
          break;
        }
      }
      
      // If not enough distractors, fill with placeholders or fewer options
      while (distractors.length < NUM_OPTIONS - 1 && itemsWithAudio.length > distractors.length + 1) {
         // This case is less likely if NUM_OPTIONS is small like 4 and there's decent vocab.
         // For now, if this happens, the number of options will be less than NUM_OPTIONS.
         // A more robust solution might involve fetching more data or specific distractor generation.
        console.warn("Not enough unique distractors, options might be fewer than planned.");
        break; 
      }

      const options = [{ text: currentTarget.word, id: `opt_${currentTarget.word}_correct`, isCorrect: true, status: 'unselected' }];
      distractors.forEach((dText, i) => {
        options.push({ text: dText, id: `opt_${dText}_${i}_incorrect`, isCorrect: false, status: 'unselected' });
      });
      
      setDisplayOptions(shuffleArray(options));
      
      // Auto-play sound for the target word
      if (currentTarget.audio) {
        pronounceText(currentTarget.word, language, currentTarget.audio).catch(err => {
          console.error("Error auto-playing sound:", err);
          setFeedback({ message: t('errors.soundPlayError', 'Could not play sound automatically.'), type: 'error' });
        });
      }

    } catch (err) {
      console.error("MatchSoundsWithWordsExercise - Error setting up:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupNewExercise();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [setupNewExercise, exerciseKey, language, days, t]);

  const playTargetSound = () => {
    if (targetWord && targetWord.audio) {
      pronounceText(targetWord.word, language, targetWord.audio).catch(err => {
        console.error("Error playing sound on button click:", err);
        setFeedback({ message: t('errors.soundPlayError', 'Could not play sound.'), type: 'error' });
      });
    }
  };

  const handleOptionClick = (option) => {
    if (isAnswered || isLoading) return;
    setIsAnswered(true); // Mark as answered to disable further clicks on options

    if (option.isCorrect) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setDisplayOptions(prevOpts => prevOpts.map(opt => 
        opt.id === option.id ? { ...opt, status: 'correct' } : opt
      ));
      if (onComplete) {
        setTimeout(() => onComplete(), 1200); // Delay before calling complete for user to see feedback
      }
    } else {
      setFeedback({ message: t('feedback.incorrectTryNext', `Incorrect. The correct answer was "${targetWord?.word}".`), type: 'incorrect' });
      setDisplayOptions(prevOpts => prevOpts.map(opt => {
        if (opt.id === option.id) return { ...opt, status: 'incorrect' };
        if (opt.isCorrect) return { ...opt, status: 'correct' }; // Highlight the correct one
        return opt;
      }));
       if (onComplete) { // Still call onComplete to move to next after incorrect, common for this type
        setTimeout(() => onComplete(), 1800); 
      }
    }
  };
  
  if (isLoading) return <p>{t('loading.matchSoundWord', 'Loading Match Sound with Word exercise...')}</p>;
  if (error) return (
    <div>
        <FeedbackDisplay message={error} type="error" />
        <ExerciseControls onNextExercise={setupNewExercise} config={{showNext: true}} />
    </div>
  );
  if (!targetWord && !isLoading) {
    return <FeedbackDisplay message={t('exercises.noData', "No exercise data available. Try different selections.")} type="info" />;
  }

  return (
    <div className="match-sounds-words-exercise">
      <h3>{t('titles.matchSoundToWord', 'Match the Sound to the Word')}</h3>
      
      <button onClick={playTargetSound} className="play-sound-button-msw" disabled={isLoading || !targetWord?.audio}>
        <span role="img" aria-label={t('ariaLabels.playSound', 'Play Sound')}>🔊</span>
        {t('buttons.playSound', 'Play Sound')}
      </button>

      <div className="options-area-msw">
        {displayOptions.map(option => (
          <button
            key={option.id}
            className={`option-button-msw ${option.status}`} // Status: unselected, correct, incorrect
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered || isLoading}
          >
            {getLatinizedText(option.text, language)}
          </button>
        ))}
      </div>

      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <ExerciseControls
        onNextExercise={setupNewExercise} // "Next" button to get a new sound/word set
        config={{ showCheck: false, showHint: false, showReveal: false, showNext: true }}
        isAnswerCorrect={isAnswered && displayOptions.find(o => o.status === 'correct')?.isCorrect} // True if answered and correct
      />
    </div>
  );
};

export default MatchSoundsWithWordsExercise;
