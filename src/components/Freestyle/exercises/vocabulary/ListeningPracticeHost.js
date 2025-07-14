// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';

// Import the specific exercise components this host will manage
import TranscribeWordExercise from './TranscribeWordExercise';
import MatchSoundsWithWordsExercise from './MatchSoundsWithWordsExercise';

const managedExerciseComponents = [
  { key: 'transcribe_word', Component: TranscribeWordExercise, name: 'Listen and Type' },
  { key: 'match_sound_word', Component: MatchSoundsWithWordsExercise, name: 'Match Sound to Word' },
];

const ListeningPracticeHost = ({ language, days, exerciseKey: hostKey }) => {
  const { t } = useI18n();
  const [CurrentExercise, setCurrentExercise] = useState(null);
  const [currentExerciseInfo, setCurrentExerciseInfo] = useState(null);
  const [subExerciseKey, setSubExerciseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const selectAndLoadRandomExercise = useCallback(() => {
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * managedExerciseComponents.length);
    const selected = managedExerciseComponents[randomIndex];
    
    console.log(`ListeningPracticeHost: Selecting exercise type: ${selected.name}`);
    setCurrentExerciseInfo(selected);
    setCurrentExercise(() => selected.Component);
    setSubExerciseKey(prev => prev + 1);
    setIsLoading(false);
  }, []); // No dependencies needed, called explicitly

  useEffect(() => {
    console.log(`ListeningPracticeHost: hostKey changed to ${hostKey}, selecting new initial exercise.`);
    selectAndLoadRandomExercise();
  }, [hostKey, selectAndLoadRandomExercise]); // selectAndLoadRandomExercise is stable

  const handleSubExerciseComplete = useCallback(() => {
    console.log(`ListeningPracticeHost: Sub-exercise ${currentExerciseInfo?.name} completed. Selecting next one.`);
    setTimeout(() => {
      selectAndLoadRandomExercise();
    }, 500); // 0.5s delay for smooth transition
  }, [selectAndLoadRandomExercise, currentExerciseInfo]);

  if (isLoading || !CurrentExercise) {
    return <p>{t('loading.listeningExercise', 'Loading Listening Exercise...')}</p>;
  }

  return (
    <div className="listening-practice-host-container cosy-exercise-container">
      {/* Optional: Display the type of current listening exercise for debugging
      <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.9em' }}>
        Current listening mode: {currentExerciseInfo?.name || 'N/A'}
      </p> 
      */}
      <CurrentExercise
        language={language}
        days={days}
        exerciseKey={subExerciseKey}
        onComplete={handleSubExerciseComplete}
        // Note: Ensure TranscribeWordExercise also accepts and calls onComplete.
        // This will be reviewed/added in a later phase if not present.
      />
    </div>
  );
};

export default ListeningPracticeHost;
