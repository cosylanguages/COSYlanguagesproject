// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';

// Import the specific exercise components this host will manage
import ShowWordExercise from './ShowWordExercise';
import TypeOppositeExercise from './TypeOppositeExercise';
import MatchOppositesExercise from './MatchOppositesExercise';
import BuildWordExercise from './BuildWordExercise';

const managedExerciseComponents = [
  { key: 'show_word', Component: ShowWordExercise, name: 'Show Word' },
  { key: 'type_opposite', Component: TypeOppositeExercise, name: 'Type Opposite' },
  { key: 'match_opposites', Component: MatchOppositesExercise, name: 'Match Opposites' },
  { key: 'build_word', Component: BuildWordExercise, name: 'Build Word' },
];

const RandomWordPracticeHost = ({ language, days, exerciseKey: hostKey }) => {
  const { t } = useI18n();
  const [CurrentExercise, setCurrentExercise] = useState(null);
  const [currentExerciseInfo, setCurrentExerciseInfo] = useState(null);
  const [subExerciseKey, setSubExerciseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const selectAndLoadRandomExercise = useCallback(() => {
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * managedExerciseComponents.length);
    const selected = managedExerciseComponents[randomIndex];
    
    console.log(`RandomWordPracticeHost: Selecting exercise type: ${selected.name}`);
    setCurrentExerciseInfo(selected);
    setCurrentExercise(() => selected.Component); // Store the component constructor
    setSubExerciseKey(prev => prev + 1);
    setIsLoading(false);
  }, []); // No dependencies needed here as it's meant to be called to reset

  useEffect(() => {
    // This effect runs when the hostKey (passed from ExerciseHost) changes,
    // or on initial mount. It signifies a new "session" for this host.
    console.log(`RandomWordPracticeHost: hostKey changed to ${hostKey}, selecting new initial exercise.`);
    selectAndLoadRandomExercise();
  }, [hostKey, selectAndLoadRandomExercise]); // selectAndLoadRandomExercise is stable

  const handleSubExerciseComplete = useCallback(() => {
    console.log(`RandomWordPracticeHost: Sub-exercise ${currentExerciseInfo?.name} completed. Selecting next one.`);
    // After a sub-exercise completes, load another random one.
    // Adding a small delay for smoother transition if needed, e.g. after success message.
    setTimeout(() => {
      selectAndLoadRandomExercise();
    }, 500); // 0.5s delay
  }, [selectAndLoadRandomExercise, currentExerciseInfo]);

  if (isLoading || !CurrentExercise) {
    return <p>{t('loading.randomWordExercise', 'Loading Random Word Exercise...')}</p>;
  }

  return (
    <div className="random-word-practice-host-container">
      {/* Optional: Display the type of current random word exercise for debugging or clarity */}
      {/* <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.9em' }}>
        Current mode: {currentExerciseInfo?.name || 'N/A'}
      </p> */}
      <CurrentExercise
        language={language}
        days={days}
        exerciseKey={subExerciseKey} // Use subExerciseKey to re-mount/reset the specific exercise
        onComplete={handleSubExerciseComplete} // Pass the completion handler
        // Note: Ensure all managed exercises accept and call onComplete when they are finished.
        // MatchOppositesExercise already does. Others might need this prop added.
      />
    </div>
  );
};

export default RandomWordPracticeHost;
