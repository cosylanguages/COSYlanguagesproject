// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';

// Import the specific exercise components this host will manage
import IdentifyImageExercise from './IdentifyImageExercise';
import MatchWordsWithPicturesExercise from './MatchWordsWithPicturesExercise';

const managedExerciseComponents = [
  { key: 'identify_image', Component: IdentifyImageExercise, name: 'Identify Image (Type)' },
  { key: 'match_words_pictures', Component: MatchWordsWithPicturesExercise, name: 'Match Words to Pictures' },
];

const RandomImagePracticeHost = ({ language, days, exerciseKey: hostKey }) => {
  const { t } = useI18n();
  const [CurrentExercise, setCurrentExercise] = useState(null);
  const [currentExerciseInfo, setCurrentExerciseInfo] = useState(null);
  const [subExerciseKey, setSubExerciseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const selectAndLoadRandomExercise = useCallback(() => {
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * managedExerciseComponents.length);
    const selected = managedExerciseComponents[randomIndex];
    
    console.log(`RandomImagePracticeHost: Selecting exercise type: ${selected.name}`);
    setCurrentExerciseInfo(selected);
    setCurrentExercise(() => selected.Component); // Store the component constructor
    setSubExerciseKey(prev => prev + 1);
    setIsLoading(false);
  }, []); // No dependencies needed, called explicitly

  useEffect(() => {
    // This effect runs when the hostKey (passed from ExerciseHost) changes,
    // or on initial mount. It signifies a new "session" for this host.
    console.log(`RandomImagePracticeHost: hostKey changed to ${hostKey}, selecting new initial exercise.`);
    selectAndLoadRandomExercise();
  }, [hostKey, selectAndLoadRandomExercise]); // selectAndLoadRandomExercise is stable

  const handleSubExerciseComplete = useCallback(() => {
    console.log(`RandomImagePracticeHost: Sub-exercise ${currentExerciseInfo?.name} completed. Selecting next one.`);
    setTimeout(() => {
      selectAndLoadRandomExercise();
    }, 500); // 0.5s delay for smooth transition
  }, [selectAndLoadRandomExercise, currentExerciseInfo]);

  if (isLoading || !CurrentExercise) {
    return <p>{t('loading.randomImageExercise', 'Loading Random Image Exercise...')}</p>;
  }

  return (
    <div className="random-image-practice-host-container cosy-exercise-container">
      {/* Optional: Display the type of current random image exercise for debugging
      <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.9em' }}>
        Current image mode: {currentExerciseInfo?.name || 'N/A'}
      </p> 
      */}
      <CurrentExercise
        language={language}
        days={days}
        exerciseKey={subExerciseKey} // Use subExerciseKey to re-mount/reset the specific exercise
        onComplete={handleSubExerciseComplete} // Pass the completion handler
        // Note: Ensure IdentifyImageExercise also accepts and calls onComplete.
        // This will be reviewed/added in a later phase if not present.
      />
    </div>
  );
};

export default RandomImagePracticeHost;
