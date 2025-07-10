import React, { useState, useEffect, useCallback } from 'react';
import { loadSentenceUnscrambleData } from '../../../../utils/exerciseDataService';
import SentenceUnscrambleExercise from './SentenceUnscrambleExercise';
import FeedbackDisplay from '../../FeedbackDisplay'; // For loading/error states
import ExerciseControls from '../../ExerciseControls'; // For next button
import { useI18n } from '../../../../i18n/I18nContext';

const SentenceUnscramblePracticeHost = ({ language, exerciseKey }) => {
  const { t } = useI18n();
  const [exerciseDataList, setExerciseDataList] = useState([]);
  const [currentExerciseItem, setCurrentExerciseItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isCorrectOnce, setIsCorrectOnce] = useState(false);


  const loadExercises = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    try {
      const { data, error: fetchError } = await loadSentenceUnscrambleData(language);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || t('errors.loadDataError', 'Failed to load sentence unscramble exercises.'));
      }
      if (!data || data.length === 0) {
        setError(t('exercises.noDataForLanguage', 'No sentence unscramble exercises found for this language.'));
        setExerciseDataList([]);
        setCurrentExerciseItem(null);
      } else {
        // Optionally shuffle the whole list once
        // For now, just use as is, can add shuffling later
        setExerciseDataList(data);
        setCurrentExerciseItem(data[0]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Error loading sentence unscramble exercises:", err);
      setError(err.message);
      setExerciseDataList([]);
      setCurrentExerciseItem(null);
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    if (language) {
      loadExercises();
    }
  }, [language, exerciseKey, loadExercises]); // Reload if language or key changes

  const handleNextExercise = useCallback(() => {
    setIsCorrectOnce(false);
    setFeedback({ message: '', type: '' });
    const nextIndex = currentIndex + 1;
    if (exerciseDataList.length > 0) {
      if (nextIndex < exerciseDataList.length) {
        setCurrentIndex(nextIndex);
        setCurrentExerciseItem(exerciseDataList[nextIndex]);
      } else {
        // End of list, maybe reshuffle and start over or show completion
        setFeedback({ message: t('exercises.allCompleted', 'All sentences unscrambled! Resetting...'), type: 'info' });
        // For now, just restart from a shuffled list or the beginning
        // To properly reshuffle and avoid immediate repeats, more complex logic is needed.
        // Simple restart:
        setCurrentIndex(0);
        setCurrentExerciseItem(exerciseDataList[0]);
        // Or reload/reshuffle: loadExercises();
      }
    }
  }, [currentIndex, exerciseDataList, t]);

  const handleCorrect = () => {
    setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'success' });
    setIsCorrectOnce(true);
  };

  const handleIncorrect = () => {
    setFeedback({ message: t('feedback.incorrect', 'Incorrect, try again.'), type: 'error' });
    setIsCorrectOnce(false);
  };

  if (isLoading) {
    return <FeedbackDisplay message={t('loadingExercises', 'Loading exercises...')} type="loading" />;
  }
  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }
  if (!currentExerciseItem) {
    return <FeedbackDisplay message={t('exercises.noExercisesAvailable', 'No exercises available at the moment.')} type="info" />;
  }

  return (
    <div className="sentence-unscramble-practice-host">
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <SentenceUnscrambleExercise
        exerciseData={currentExerciseItem}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
      />
      <ExerciseControls
        onNextExercise={handleNextExercise}
        isAnswerCorrect={isCorrectOnce}
        // Disable check/reveal if exercise handles it internally or if not applicable
        config={{ showCheck: false, showReveal: false, showNext: true }}
      />
    </div>
  );
};

export default SentenceUnscramblePracticeHost;
