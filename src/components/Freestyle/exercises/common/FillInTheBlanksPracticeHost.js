import React, { useState, useEffect, useCallback } from 'react';
import { loadFillInTheBlanksData } from '../../../../utils/exerciseDataService';
import FillInTheBlanksExercise from './FillInTheBlanksExercise';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';

const FillInTheBlanksPracticeHost = ({ language, exerciseKey }) => {
  const { t } = useI18n();
  const [exerciseDataList, setExerciseDataList] = useState([]);
  const [currentExerciseItem, setCurrentExerciseItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isCorrectOnce, setIsCorrectOnce] = useState(false); // Track if current item was answered correctly at least once

  const loadExercises = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setIsCorrectOnce(false);
    try {
      const { data, error: fetchError } = await loadFillInTheBlanksData(language);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || t('errors.loadDataError', 'Failed to load exercises.'));
      }
      if (!data || data.length === 0) {
        setError(t('exercises.noDataForLanguage', 'No Fill in the Blanks exercises found for this language.'));
        setExerciseDataList([]);
        setCurrentExerciseItem(null);
      } else {
        // Simple shuffle for variety for now
        const shuffledData = [...data].sort(() => Math.random() - 0.5);
        setExerciseDataList(shuffledData);
        setCurrentExerciseItem(shuffledData[0]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Error loading FillInTheBlanks exercises:", err);
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
  }, [language, exerciseKey, loadExercises]);

  const handleNextExercise = useCallback(() => {
    setIsCorrectOnce(false);
    setFeedback({ message: '', type: '' });
    const nextIndex = currentIndex + 1;
    if (exerciseDataList.length > 0) {
      if (nextIndex < exerciseDataList.length) {
        setCurrentIndex(nextIndex);
        setCurrentExerciseItem(exerciseDataList[nextIndex]);
      } else {
        setFeedback({ message: t('exercises.allCompleted', 'All blanks filled! Resetting...'), type: 'info' });
        // Simple restart from a re-shuffled list for now
        const reshuffledData = [...exerciseDataList].sort(() => Math.random() - 0.5);
        setExerciseDataList(reshuffledData);
        setCurrentIndex(0);
        setCurrentExerciseItem(reshuffledData[0]);
      }
    }
  }, [currentIndex, exerciseDataList, t]);

  const handleCorrect = () => {
    setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'success' });
    setIsCorrectOnce(true);
  };

  const handleIncorrect = () => {
    setFeedback({ message: t('feedback.incorrect', 'Not quite, try again or reveal.'), type: 'error' });
    setIsCorrectOnce(false);
  };

  const handleAttempt = () => {
    // Clear feedback when a new attempt is made (e.g. by Check Answer button in child)
    setFeedback({ message: '', type: '' });
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
    <div className="fill-in-the-blanks-practice-host">
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <FillInTheBlanksExercise
        exerciseData={currentExerciseItem}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        onAttempt={handleAttempt}
      />
      <ExerciseControls
        onNextExercise={handleNextExercise}
        isAnswerCorrect={isCorrectOnce}
        // FillInTheBlanksExercise has its own Check and Reveal buttons
        config={{ showCheck: false, showReveal: false, showNext: true }}
      />
    </div>
  );
};

export default FillInTheBlanksPracticeHost;
