// Import necessary libraries and components.
import React, { lazy, Suspense } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import Loading from '../Common/Loading';
import exerciseMap from './exercises/exerciseRegistry';

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
  if (!subPracticeType || !subPracticeType.category || !subPracticeType.subCategory) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
  }

  // Get the exercise component from the map.
  const { category, subCategory } = subPracticeType;
  const ExerciseComponent = exerciseMap[category] && exerciseMap[category][subCategory];

  // If the exercise component is not found, display an error message.
  if (!ExerciseComponent) {
    console.warn(`[ExerciseHost] Exercise type "${category}.${subCategory}" not found in exerciseMap.`);
    const notFoundText = t('errors.exerciseHost.notFound', `Exercise type "<strong>${category}.${subCategory}</strong>" not found or not yet implemented.`, { category, subCategory });
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
        <h3><TransliterableText text={t('errors.exerciseHost.title', 'Exercise Error')} langOverride={i18nLanguage} /></h3>
        <p dangerouslySetInnerHTML={{ __html: notFoundText }} />
        <p><TransliterableText text={t('errors.exerciseHost.suggestion', 'Please check the mapping in exerciseRegistry.js or select another exercise.')} langOverride={i18nLanguage} /></p>
      </div>
    );
  }

  // Render the exercise component with the appropriate props.
  return (
    <Suspense fallback={<Loading />}>
      <ExerciseComponent language={language} days={days} />
    </Suspense>
  );
};

export default ExerciseHost;
