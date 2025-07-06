import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';

// Vocabulary Host Components
import RandomWordPracticeHost from './exercises/vocabulary/RandomWordPracticeHost';
import RandomImagePracticeHost from './exercises/vocabulary/RandomImagePracticeHost';
import ListeningPracticeHost from './exercises/vocabulary/ListeningPracticeHost';
import PracticeAllVocabHost from './exercises/vocabulary/PracticeAllVocabHost';
import MainPracticeAllHost from './MainPracticeAllHost'; // Import the new Main Practice All Host

// Specific Vocabulary Exercise Components (to be used by Hosts)
import ShowWordExercise from './exercises/vocabulary/ShowWordExercise';
import IdentifyImageExercise from './exercises/vocabulary/IdentifyImageExercise';
import TranscribeWordExercise from './exercises/vocabulary/TranscribeWordExercise';
import TypeOppositeExercise from './exercises/vocabulary/TypeOppositeExercise';
import MatchOppositesExercise from './exercises/vocabulary/MatchOppositesExercise';
import BuildWordExercise from './exercises/vocabulary/BuildWordExercise';
import MatchImageWordExercise from './exercises/vocabulary/MatchImageWordExercise';

// Grammar Exercise Components
// import ArticleWordExercise from './exercises/grammar/ArticleWordExercise'; // Not currently in map
// import MatchArticlesWordsExercise from './exercises/grammar/MatchArticlesWordsExercise'; // Not currently in map
import SelectArticleExercise from './exercises/grammar/SelectArticleExercise';
import TypeVerbExercise from './exercises/grammar/TypeVerbExercise'; // Not currently in map, but should be
// import MatchVerbsPronounsExercise from './exercises/grammar/MatchVerbsPronounsExercise'; // Not currently in map
import FillGapsExercise from './exercises/grammar/FillGapsExercise'; // Not currently in map
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
import StorytellingExercise from './exercises/writing/StorytellingExercise';
import DiaryPracticeExercise from './exercises/writing/DiaryPracticeExercise';

// Placeholder component
const PlaceholderExercise = ({ name, subPracticeType }) => {
  const { t, language } = useI18n();
  const exerciseName = name || subPracticeType;
  const message1Text = t('exercises.placeholder.message1', `This is a placeholder for the <em>${exerciseName}</em> exercise.`, { name: exerciseName });
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3><TransliterableText text={t('exercises.placeholder.title', `${exerciseName} Exercise`, { name: exerciseName })} langOverride={language} /></h3>
      <p dangerouslySetInnerHTML={{ __html: message1Text }} />
      <p><TransliterableText text={t('exercises.placeholder.message2', 'Implementation is pending.')} langOverride={language} /></p>
    </div>
  );
};

const exerciseMap = {
  // Vocabulary Host Keys (from allMenuItemsConfig)
  'vocab_random_word_host': RandomWordPracticeHost,
  'vocab_random_image_host': RandomImagePracticeHost,
  'vocab_listening_host': ListeningPracticeHost,
  'vocab_practice_all_sub_host': PracticeAllVocabHost,
  'practice_all_main_cat': MainPracticeAllHost, // Added mapping for Main Practice All

  // Specific exercises (some might be legacy or direct links if any exist outside hosts)
  // These would ideally be phased out from direct mapping if hosts cover all uses.
  'random-word': ShowWordExercise, // Legacy example
  'random-image': IdentifyImageExercise, // Legacy example
  'listening': TranscribeWordExercise, // Transcribe is a type of listening exercise
  'type-opposite': TypeOppositeExercise, // Now part of RandomWordPracticeHost
  'vocab_match_opposites': MatchOppositesExercise, // Now part of RandomWordPracticeHost
  'build-word': BuildWordExercise, // Now part of RandomWordPracticeHost
  'match-image-word': MatchImageWordExercise, // Now part of RandomImagePracticeHost

  // Grammar (ensure keys match allMenuItemsConfig if these are directly selectable)
  'grammar_fill_gaps': FillGapsExercise, // Assuming this key from config
  'grammar_type_verb': TypeVerbExercise, // Assuming this key from config
  'gender-articles': SelectArticleExercise, 
  'verbs-conjugation': WordOrderExercise, // This was likely a placeholder name for a specific type
  'word-order': WordOrderExercise, // Adding if 'word-order' is a distinct key
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
  'storytelling': StorytellingExercise,
  'diary': DiaryPracticeExercise, 
};

const ExerciseHost = ({ subPracticeType, language, days, exerciseKey }) => {
  const { t, language: i18nLanguage } = useI18n();

  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
  }

  let ExerciseComponent = exerciseMap[subPracticeType];

  if (!ExerciseComponent) {
    // Fallback for simple keys if subPracticeType might be namespaced (e.g. old system)
    const simpleKey = subPracticeType.split('/').pop();
    if (exerciseMap[simpleKey]) {
        ExerciseComponent = exerciseMap[simpleKey];
    } else {
        // Fallback for keys that might have a prefix in some older data structure
        const foundKey = Object.keys(exerciseMap).find(key => subPracticeType.endsWith(`/${key}`) || key.endsWith(`/${subPracticeType}`));
        ExerciseComponent = foundKey ? exerciseMap[foundKey] : null;
    }

    if (!ExerciseComponent) {
      const notFoundText = t('errors.exerciseHost.notFound', `Exercise type "<strong>${subPracticeType}</strong>" not found or not yet implemented.`, { subPracticeType });
      return (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
          <h3><TransliterableText text={t('errors.exerciseHost.title', 'Exercise Error')} langOverride={i18nLanguage} /></h3>
          <p dangerouslySetInnerHTML={{ __html: notFoundText }} />
          <p><TransliterableText text={t('errors.exerciseHost.suggestion', 'Please check the mapping in ExerciseHost.js or select another exercise.')} langOverride={i18nLanguage} /></p>
        </div>
      );
    }
  }
  
  return <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} />;
};

export default ExerciseHost;
