// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../../../i18n/I18nContext';

// Import ALL individual vocabulary exercise components
import ShowWordExercise from './ShowWordExercise';
import TypeOppositeExercise from './TypeOppositeExercise'; // Now MCQ version
import MatchOppositesExercise from './MatchOppositesExercise';
import BuildWordExercise from './BuildWordExercise';
import IdentifyImageExercise from './IdentifyImageExercise';
import MatchWordsWithPicturesExercise from './MatchWordsWithPicturesExercise';
import TranscribeWordExercise from './TranscribeWordExercise';
import MatchSoundsWithWordsExercise from './MatchSoundsWithWordsExercise';

// Define all individual vocabulary exercises that "Practice All" can cycle through
const allVocabExerciseComponents = [
  { key: 'show_word', Component: ShowWordExercise, name: 'Show Word' },
  { key: 'type_opposite_mcq', Component: TypeOppositeExercise, name: 'Opposites (MCQ)' },
  { key: 'match_opposites', Component: MatchOppositesExercise, name: 'Match Opposites' },
  { key: 'build_word', Component: BuildWordExercise, name: 'Build Word' },
  { key: 'identify_image', Component: IdentifyImageExercise, name: 'Identify Image' },
  { key: 'match_words_pictures', Component: MatchWordsWithPicturesExercise, name: 'Match Words & Pictures' },
  { key: 'transcribe_word', Component: TranscribeWordExercise, name: 'Listen & Type' },
  { key: 'match_sound_word', Component: MatchSoundsWithWordsExercise, name: 'Match Sound & Word' },
];

const PracticeAllVocabHost = ({ language, days, exerciseKey: hostKey, onComplete }) => {
  // Note: This top-level "PracticeAllVocabHost" might itself have an onComplete if it's part of an even larger sequence.
  // For now, its primary role is to cycle its children indefinitely or until the user navigates away.
  // The `onComplete` prop received here would be from `ExerciseHost` if `vocab_practice_all_sub_host` was itself just one step in a sequence.
  // However, typically, "Practice All" modes are continuous until the user stops.
  // Let's assume for now it cycles internally and relies on its own `exerciseKey` from `ExerciseHost` to be "reset".

  const { t } = useI18n();
  const [CurrentExercise, setCurrentExercise] = useState(null);
  const [currentExerciseInfo, setCurrentExerciseInfo] = useState(null);
  const [subExerciseKey, setSubExerciseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const selectAndLoadRandomVocabExercise = useCallback(() => {
    setIsLoading(true);
    if (allVocabExerciseComponents.length === 0) {
      setCurrentExerciseInfo({name: "No Vocab Exercises Available"});
      setCurrentExercise(() => () => <p>No vocabulary exercises configured for Practice All.</p>);
      setIsLoading(false);
      return;
    }
    const randomIndex = Math.floor(Math.random() * allVocabExerciseComponents.length);
    const selected = allVocabExerciseComponents[randomIndex];
    
    console.log(`PracticeAllVocabHost: Selecting exercise type: ${selected.name}`);
    setCurrentExerciseInfo(selected);
    setCurrentExercise(() => selected.Component);
    setSubExerciseKey(prev => prev + 1);
    setIsLoading(false);
  }, []); // No dependencies as it picks from a static list

  useEffect(() => {
    console.log(`PracticeAllVocabHost: hostKey changed to ${hostKey}, selecting new initial exercise.`);
    selectAndLoadRandomVocabExercise();
  }, [hostKey, selectAndLoadRandomVocabExercise]);

  const handleSubExerciseComplete = useCallback(() => {
    console.log(`PracticeAllVocabHost: Sub-exercise ${currentExerciseInfo?.name} completed. Selecting next random vocab exercise.`);
    // After a sub-exercise completes, load another random one.
    setTimeout(() => {
      selectAndLoadRandomVocabExercise();
    }, 700); // Slightly longer delay to allow feedback messages from child to be seen
  }, [selectAndLoadRandomVocabExercise, currentExerciseInfo]);

  if (isLoading || !CurrentExercise) {
    return <p>{t('loading.practiceAllVocab', 'Loading Practice All Vocabulary Session...')}</p>;
  }

  return (
    <div className="practice-all-vocab-host-container cosy-exercise-container">
      <h3 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--color-text-headings)', fontSize:'1.2em' }}>
        {t('titles.practiceAllVocab', 'Practice All Vocabulary')}
      </h3>
      {currentExerciseInfo && currentExerciseInfo.name !== "No Vocab Exercises Available" && (
        <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '1.0em', color: 'var(--color-text-secondary)', marginTop: '0', marginBottom: '15px' }}>
          Current activity: {currentExerciseInfo.name}
        </p>
      )}
      <CurrentExercise
        language={language}
        days={days}
        exerciseKey={subExerciseKey} // To re-initialize the specific exercise with new data
        onComplete={handleSubExerciseComplete}
      />
      {/* 
        The "Next Random Exercise Type" button from the previous implementation is removed.
        Progression is now handled by the onComplete callback from the child exercises.
        The ExerciseControls within each child exercise will provide its own "Next" button,
        which, when onComplete is wired up, signals back to this host.
      */}
    </div>
  );
};

export default PracticeAllVocabHost;
