import React, { Suspense } from 'react';

// Vocabulary Exercise Components (lazy)
const ShowWordExercise = React.lazy(() => import('./exercises/vocabulary/ShowWordExercise'));
const IdentifyImageExercise = React.lazy(() => import('./exercises/vocabulary/IdentifyImageExercise'));
const TranscribeWordExercise = React.lazy(() => import('./exercises/vocabulary/TranscribeWordExercise'));
const TypeOppositeExercise = React.lazy(() => import('./exercises/vocabulary/TypeOppositeExercise'));
const MatchOppositesExercise = React.lazy(() => import('./exercises/vocabulary/MatchOppositesExercise'));
const BuildWordExercise = React.lazy(() => import('./exercises/vocabulary/BuildWordExercise'));
const MatchImageWordExercise = React.lazy(() => import('./exercises/vocabulary/MatchImageWordExercise'));

// Grammar Exercise Components (lazy)
const ArticleWordExercise = React.lazy(() => import('./exercises/grammar/ArticleWordExercise'));
const MatchArticlesWordsExercise = React.lazy(() => import('./exercises/grammar/MatchArticlesWordsExercise'));
const SelectArticleExercise = React.lazy(() => import('./exercises/grammar/SelectArticleExercise'));
const TypeVerbExercise = React.lazy(() => import('./exercises/grammar/TypeVerbExercise'));
const MatchVerbsPronounsExercise = React.lazy(() => import('./exercises/grammar/MatchVerbsPronounsExercise'));
const FillGapsExercise = React.lazy(() => import('./exercises/grammar/FillGapsExercise'));
const WordOrderExercise = React.lazy(() => import('./exercises/grammar/WordOrderExercise'));
const PossessivesExercise = React.lazy(() => import('./exercises/grammar/PossessivesExercise'));

// Reading Exercise Components (lazy)
const StoryReadingExercise = React.lazy(() => import('./exercises/reading/StoryReadingExercise'));
const InterestingFactExercise = React.lazy(() => import('./exercises/reading/InterestingFactExercise'));

// Speaking Exercise Components (lazy)
const SpeakingQuestionExercise = React.lazy(() => import('./exercises/speaking/SpeakingQuestionExercise'));
const MonologueExercise = React.lazy(() => import('./exercises/speaking/MonologueExercise'));
const RolePlayExercise = React.lazy(() => import('./exercises/speaking/RolePlayExercise'));

// Writing Exercise Components (lazy)
const WritingQuestionExercise = React.lazy(() => import('./exercises/writing/WritingQuestionExercise'));
const StorytellingExercise = React.lazy(() => import('./exercises/writing/StorytellingExercise'));
const DiaryPracticeExercise = React.lazy(() => import('./exercises/writing/DiaryPracticeExercise'));

// Placeholder component for exercises not yet migrated (though not currently used after possessives added)
const PlaceholderExercise = ({ name, subPracticeType }) => (
  <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
    <h3>{name || subPracticeType} Exercise</h3>
    <p>This is a placeholder for the <em>{name || subPracticeType}</em> exercise.</p>
    <p>Implementation is pending.</p>
  </div>
);

// Mapping of sub-practice IDs to their components
const exerciseMap = {
  // Vocabulary
  'random-word': ShowWordExercise,
  'random-image': IdentifyImageExercise,
  'match-image-word': MatchImageWordExercise,
  'listening': TranscribeWordExercise,
  'type-opposite': TypeOppositeExercise,
  'match-opposites': MatchOppositesExercise,
  'build-word': BuildWordExercise,
  
  // Grammar
  'gender-articles': SelectArticleExercise, 
  'verbs-conjugation': TypeVerbExercise, 
  'possessives': PossessivesExercise, // Updated from PlaceholderExercise
  'word-order': WordOrderExercise, 
  
  // Reading
  'story': StoryReadingExercise,
  'interesting-fact': InterestingFactExercise,
  
  // Speaking
  'question-practice': SpeakingQuestionExercise,
  'monologue': MonologueExercise,
  'role-play': RolePlayExercise,
  
  // Writing
  'writing-question': WritingQuestionExercise,
  'storytelling': StorytellingExercise, 
  'diary': DiaryPracticeExercise, 
};

const ExerciseHost = ({ subPracticeType, language, days, exerciseKey }) => {
  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>Please select an exercise type above.</p>;
  }

  let ExerciseComponent = exerciseMap[subPracticeType];

  if (!ExerciseComponent) {
    const simpleKey = subPracticeType.split('/').pop();
    if (exerciseMap[simpleKey]) {
        ExerciseComponent = exerciseMap[simpleKey];
    } else {
        const foundKey = Object.keys(exerciseMap).find(key => key.endsWith(`/${subPracticeType}`));
        ExerciseComponent = foundKey ? exerciseMap[foundKey] : null;
    }

    if (!ExerciseComponent) {
        return (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
            <h3>Exercise Error</h3>
            <p>Exercise type "<strong>{subPracticeType}</strong>" not found or not yet implemented.</p>
            <p>Please check the mapping in ExerciseHost.js or select another exercise.</p>
          </div>
        );
    }
  }
  
  return (
    <Suspense fallback={<div style={{textAlign: 'center', padding: '20px'}}>Chargement de l'exercice...</div>}>
      <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} />
    </Suspense>
  );
};

export default ExerciseHost;
