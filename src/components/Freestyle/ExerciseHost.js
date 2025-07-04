import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

// New Vocabulary Host Components
import RandomWordPracticeHost from './exercises/vocabulary/RandomWordPracticeHost';
import RandomImagePracticeHost from './exercises/vocabulary/RandomImagePracticeHost';
import ListeningPracticeHost from './exercises/vocabulary/ListeningPracticeHost';
import PracticeAllVocabHost from './exercises/vocabulary/PracticeAllVocabHost';

// Existing Specific Vocabulary Exercise Components (may be refactored or used by new hosts)
import ShowWordExercise from './exercises/vocabulary/ShowWordExercise';
import IdentifyImageExercise from './exercises/vocabulary/IdentifyImageExercise';
import TranscribeWordExercise from './exercises/vocabulary/TranscribeWordExercise';
import TypeOppositeExercise from './exercises/vocabulary/TypeOppositeExercise';
import MatchOppositesExercise from './exercises/vocabulary/MatchOppositesExercise';
import BuildWordExercise from './exercises/vocabulary/BuildWordExercise';
import MatchImageWordExercise from './exercises/vocabulary/MatchImageWordExercise';

// Grammar Exercise Components
import ArticleWordExercise from './exercises/grammar/ArticleWordExercise';
import MatchArticlesWordsExercise from './exercises/grammar/MatchArticlesWordsExercise';
import SelectArticleExercise from './exercises/grammar/SelectArticleExercise';
import TypeVerbExercise from './exercises/grammar/TypeVerbExercise';
import MatchVerbsPronounsExercise from './exercises/grammar/MatchVerbsPronounsExercise';
import FillGapsExercise from './exercises/grammar/FillGapsExercise';
import WordOrderExercise from './exercises/grammar/WordOrderExercise';

// Reading Exercise Components
import StoryReadingExercise from './exercises/reading/StoryReadingExercise';
import InterestingFactExercise from './exercises/reading/InterestingFactExercise';

// Speaking Exercise Components
import SpeakingQuestionExercise from './exercises/speaking/SpeakingQuestionExercise';
import MonologueExercise from './exercises/speaking/MonologueExercise';
import RolePlayExercise from './exercises/speaking/RolePlayExercise';

// Writing Exercise Components
import WritingQuestionExercise from './exercises/writing/WritingQuestionExercise';
import StorytellingExercise from './exercises/writing/StorytellingExercise'; // Newly added
import DiaryPracticeExercise from './exercises/writing/DiaryPracticeExercise'; // Newly added

// Placeholder component for exercises not yet migrated
const PlaceholderExercise = ({ name, subPracticeType }) => {
  const { t } = useI18n();
  const exerciseName = name || subPracticeType;
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3>{t('exercises.placeholder.title', `${exerciseName} Exercise`, { name: exerciseName })}</h3>
      {/* Using dangerouslySetInnerHTML for <em> tag, ensure content is safe or find alternative if needed */}
      <p dangerouslySetInnerHTML={{ __html: t('exercises.placeholder.message1', `This is a placeholder for the <em>${exerciseName}</em> exercise.`, { name: exerciseName }) }} />
      <p>{t('exercises.placeholder.message2', 'Implementation is pending.')}</p>
    </div>
  );
};

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
  'verbs-conjugation': WordOrderExercise, 
  'possessives': () => <PlaceholderExercise name="Possessives" subPracticeType="possessives" />,
  
  // Reading
  'story': StoryReadingExercise,
  'interesting-fact': InterestingFactExercise,
  
  // Speaking
  'question-practice': SpeakingQuestionExercise,
  'monologue': MonologueExercise,
  'role-play': RolePlayExercise,
  
  // Writing
  'writing-question': WritingQuestionExercise,
  'storytelling': StorytellingExercise, // Updated from Placeholder
  'diary': DiaryPracticeExercise, // Assuming 'diary' is the subPracticeType ID
};

const ExerciseHost = ({ subPracticeType, language, days, exerciseKey }) => {
  const { t } = useI18n();

  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>{t('exercises.selectExerciseHint', 'Please select an exercise type above.')}</p>;
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
            <h3>{t('errors.exerciseHost.title', 'Exercise Error')}</h3>
            {/* Using dangerouslySetInnerHTML for <strong> tag, ensure content is safe or find alternative */}
            <p dangerouslySetInnerHTML={{ __html: t('errors.exerciseHost.notFound', `Exercise type "<strong>${subPracticeType}</strong>" not found or not yet implemented.`, { subPracticeType }) }} />
            <p>{t('errors.exerciseHost.suggestion', 'Please check the mapping in ExerciseHost.js or select another exercise.')}</p>
          </div>
        );
    }
  }
  
  return <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} />;
};

export default ExerciseHost;
