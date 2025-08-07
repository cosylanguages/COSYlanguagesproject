import { lazy } from 'react';

const exerciseMap = {
  vocabulary: {
    random: lazy(() => import('./vocabulary/RandomWordPracticeHost')),
  },
  grammar: {
    main: lazy(() => import('./grammar/GrammarExercisesHost')),
  },
  reading: {
    main: lazy(() => import('./reading/ReadingExercisesHost')),
  },
  speaking: {
    main: lazy(() => import('./speaking/SpeakingExercisesHost')),
  },
  writing: {
    main: lazy(() => import('./writing/WritingExercisesHost')),
  },
};

export default exerciseMap;
