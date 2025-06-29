import React, { useState, useEffect, useCallback } from 'react';
import { loadPossessivesData } from '../../../../utils/exerciseDataService';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { normalizeString } from '../../../../utils/stringUtils';
import { useProgress } from '../../../../contexts/ProgressContext';
import { useI18n } from '../../../../i18n/I18nContext';

const PossessivesExercise = ({ language, days, exerciseKey }) => {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [exerciseData, setExerciseData] = useState([]);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization();
  const progress = useProgress();
  const { t } = useI18n();

  const pickNewExercise = useCallback((data) => {
    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCurrentExercise(data[randomIndex]);
      setUserInput('');
      setFeedback({ message: '', type: '' });
      setIsRevealed(false);
      setError(null);
    } else {
      setError(t('exercises.noPossessivesFound', 'No possessives exercises found for the selected criteria.'));
      setCurrentExercise(null);
    }
    setIsLoading(false);
  }, [t]);

  const fetchAndSetNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await loadPossessivesData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || t('errors.failedLoadPossessives'));
      }
      // Data for possessives is expected to be an array of items for the given day(s)
      // loadPossessivesData already handles filtering by day.
      setExerciseData(data || []); 
      pickNewExercise(data || []);
    } catch (err) {
      console.error("PossessivesExercise - Error fetching exercises:", err);
      setError(err.message || t('errors.unexpectedError'));
      setIsLoading(false);
      setCurrentExercise(null);
    }
  }, [language, days, pickNewExercise, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchAndSetNewExercise();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay'));
      setCurrentExercise(null);
    }
  }, [fetchAndSetNewExercise, exerciseKey, language, days, t]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!currentExercise || isRevealed) return;

    const correctAnswer = currentExercise.answer;
    const normalizedUserInput = normalizeString(userInput);
    const normalizedCorrectAnswer = normalizeString(correctAnswer);
    
    const displayAnswer = isLatinized ? getLatinizedText(correctAnswer, language) : correctAnswer;
    const itemId = `possessive_${normalizeString(currentExercise.sentence.split(" ")[0])}_${normalizeString(correctAnswer)}`;

    if (normalizedUserInput === normalizedCorrectAnswer) {
      setFeedback({ message: t('feedback.correct'), type: 'correct' });
      progress.awardCorrectAnswer(itemId, 'grammar-possessive');
    } else {
      setFeedback({ message: t('feedback.incorrectAnswerIs', { correctAnswer: displayAnswer }), type: 'incorrect' });
      progress.awardIncorrectAnswer(itemId, 'grammar-possessive');
    }
  };

  const showHint = () => {
    if (!currentExercise || isRevealed) return;
    // Basic hint: show the first letter of the answer
    const firstLetter = currentExercise.answer[0];
    const latinizedFirstLetter = getLatinizedText(firstLetter, language);
    setFeedback({ message: t('feedback.hintFirstLetterIs', { letter: latinizedFirstLetter }), type: 'hint' });
  };

  const revealTheAnswer = () => {
    if (!currentExercise) return;
    const correctAnswer = currentExercise.answer;
    const displayAnswer = isLatinized ? getLatinizedText(correctAnswer, language) : correctAnswer;
    const itemId = `possessive_${normalizeString(currentExercise.sentence.split(" ")[0])}_${normalizeString(correctAnswer)}`;

    setUserInput(correctAnswer); // Show the full answer in the input
    setFeedback({ message: t('feedback.correctAnswerIs', { correctAnswer: displayAnswer }), type: 'info' });
    setIsRevealed(true);
    progress.scheduleReview(itemId, 'grammar-possessive', false);
  };

  const handleNext = () => {
    setIsLoading(true);
    pickNewExercise(exerciseData);
  };

  if (isLoading) {
    return <p>{t('loading.possessivesExercise', 'Loading possessives exercise...')}</p>;
  }

  if (error) {
    return <FeedbackDisplay message={error} type="error" />;
  }

  if (!currentExercise) {
    return <FeedbackDisplay message={t('exercises.noPossessivesLoaded', 'No possessive exercise loaded. Try different selections or check data.')} type="info" />;
  }

  // Display logic for "fill_blank" type
  let sentenceParts = [];
  let placeholder = "____"; // Default placeholder
  if (currentExercise.sentence.includes('____')) {
    sentenceParts = currentExercise.sentence.split('____');
  } else if (currentExercise.sentence.includes('_')) { // Allow single underscore as placeholder
    sentenceParts = currentExercise.sentence.split('_');
    placeholder = "_";
  } else {
    sentenceParts = [currentExercise.sentence, ""]; // No placeholder found, input after sentence
  }


  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
      <h3>{t('titles.fillThePossessive', 'Fill in the Correct Possessive')}</h3>
      <p style={{ fontSize: '1.1rem', margin: '15px 0' }}>
        {getLatinizedText(sentenceParts[0], language)}
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isRevealed || isLoading}
          style={{ 
            padding: '8px', 
            fontSize: '1rem', 
            width: `${Math.max(currentExercise.answer.length * 10, 60)}px`, // Dynamic width
            minWidth: '60px',
            maxWidth: '150px',
            margin: '0 5px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            textAlign: 'center'
          }}
        />
        {getLatinizedText(sentenceParts[1] || '', language)}
      </p>
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      <ExerciseControls
        onCheckAnswer={!isRevealed && !!currentExercise ? checkAnswer : undefined}
        onShowHint={!isRevealed && !!currentExercise ? showHint : undefined}
        onRevealAnswer={!isRevealed && !!currentExercise ? revealTheAnswer : undefined}
        onNextExercise={handleNext}
        config={{
          showCheck: !isRevealed && !!currentExercise,
          showHint: !isRevealed && !!currentExercise,
          showReveal: !isRevealed && !!currentExercise,
          showNext: true,
        }}
      />
    </div>
  );
};

export default PossessivesExercise;
