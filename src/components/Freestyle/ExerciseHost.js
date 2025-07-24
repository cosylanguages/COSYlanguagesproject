// Import necessary libraries and components.
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';

// Import the host components for different exercise types.
import RandomWordPracticeHost from './exercises/vocabulary/RandomWordPracticeHost';
import GrammarExercisesHost from './exercises/grammar/GrammarExercisesHost';
import ReadingExercisesHost from './exercises/reading/ReadingExercisesHost';
import SpeakingExercisesHost from './exercises/speaking/SpeakingExercisesHost';
import WritingExercisesHost from './exercises/writing/WritingExercisesHost';

// A map that associates sub-practice types with their corresponding host components.
const exerciseMap = {
  vocabulary: RandomWordPracticeHost,
  grammar: GrammarExercisesHost,
  reading: ReadingExercisesHost,
  speaking: SpeakingExercisesHost,
  writing: WritingExercisesHost,
};

/**
 * A component that hosts the currently selected exercise.
 * It dynamically renders the appropriate exercise host based on the selected sub-practice type.
 * @param {object} props - The component's props.
 * @param {string} props.subPracticeType - The selected sub-practice type.
 * @param {string} props.language - The currently selected language.
 * @param {Array} props.days - An array of selected days.
 * @returns {JSX.Element} The ExerciseHost component.
 */
const ExerciseHost = ({ subPracticeType, language, days }) => {
  const { t, language: i18nLanguage } = useI18n();

  // If no sub-practice type is selected, display a hint.
  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
  }

  // Get the exercise component from the map.
  let ExerciseComponent = exerciseMap[subPracticeType];

  // If the exercise component is not found, display an error message.
  if (!ExerciseComponent) {
    console.warn(`[ExerciseHost] Exercise type "${subPracticeType}" not found directly in exerciseMap.`);
    const notFoundText = t('errors.exerciseHost.notFound', `Exercise type "<strong>${subPracticeType}</strong>" not found or not yet implemented.`, { subPracticeType });
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
        <h3><TransliterableText text={t('errors.exerciseHost.title', 'Exercise Error')} langOverride={i18nLanguage} /></h3>
        <p dangerouslySetInnerHTML={{ __html: notFoundText }} />
        <p><TransliterableText text={t('errors.exerciseHost.suggestion', 'Please check the mapping in ExerciseHost.js or select another exercise.')} langOverride={i18nLanguage} /></p>
      </div>
    );
  }

  // Render the exercise component with the appropriate props.
  return <ExerciseComponent language={language} days={days} />;
};

export default ExerciseHost;
