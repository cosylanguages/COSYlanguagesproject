import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';

// Host Components
import RandomWordPracticeHost from './exercises/vocabulary/RandomWordPracticeHost';
import GrammarExercisesHost from './exercises/grammar/GrammarExercisesHost'; // Assuming a new host for grammar
import ReadingExercisesHost from './exercises/reading/ReadingExercisesHost'; // Assuming a new host for reading
import SpeakingExercisesHost from './exercises/speaking/SpeakingExercisesHost'; // Assuming a new host for speaking
import WritingExercisesHost from './exercises/writing/WritingExercisesHost'; // Assuming a new host for writing


const exerciseMap = {
  vocabulary: RandomWordPracticeHost,
  grammar: GrammarExercisesHost,
  reading: ReadingExercisesHost,
  speaking: SpeakingExercisesHost,
  writing: WritingExercisesHost,
};

const ExerciseHost = ({ subPracticeType, language, days }) => {
  const { t, language: i18nLanguage } = useI18n();

  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
  }

  let ExerciseComponent = exerciseMap[subPracticeType];

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

  return <ExerciseComponent language={language} days={days} />;
};

export default ExerciseHost;
