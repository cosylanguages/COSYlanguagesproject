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
import SelectArticleExercise from './exercises/grammar/SelectArticleExercise';
import ConjugationPracticeExercise from './exercises/grammar/ConjugationPracticeExercise';
import TypeVerbExercise from './exercises/grammar/TypeVerbExercise';
import FillGapsExercise from './exercises/grammar/FillGapsExercise';
import WordOrderExercise from './exercises/grammar/WordOrderExercise';

// Sentence Skills Components (New)
import SentenceUnscramblePracticeHost from './exercises/common/SentenceUnscramblePracticeHost';

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
  'vocab_random_word_host': RandomWordPracticeHost, // This might need to be 'vocab_random_word_exercise' if that's the key used in menu
  'vocab_random_image_host': RandomImagePracticeHost, // Same as above, check keys
  'vocab_listening_host': ListeningPracticeHost, // This is a host for listening sub-types
  'vocab_practice_all_sub_host': PracticeAllVocabHost,
  'practice_all_main_cat': MainPracticeAllHost,

  // Direct specific exercises (ensure these keys match menu items if directly linked)
  'vocab_random_word_exercise': RandomWordPracticeHost, // Pointing to host for consistency
  'vocab_random_image_exercise': RandomImagePracticeHost, // Pointing to host
  'vocab_match_image_word_exercise': MatchImageWordExercise, // This is a specific component
  'vocab_listening_exercise': ListeningPracticeHost, // This is a host
  'vocab_type_opposite_exercise': TypeOppositeExercise,
  'vocab_match_opposites_exercise': MatchOppositesExercise,
  'vocab_build_word_exercise': BuildWordExercise,

  // Grammar (keys from allMenuItemsConfig)
  'grammar_fill_gaps_exercise': FillGapsExercise,
  'grammar_type_verb_exercise': TypeVerbExercise,
  'grammar_select_article_exercise': SelectArticleExercise, // Changed from 'gender-articles'
  'grammar_word_order_exercise': WordOrderExercise,     // Changed from 'word-order'
  'grammar_conjugation_practice': ConjugationPracticeExercise,

  // Sentence Skills (New)
  'sentence_unscramble_exercise': SentenceUnscramblePracticeHost,

  // Reading
  'reading_story_exercise': StoryReadingExercise, // Changed from 'story'
  'reading_interesting_fact_exercise': InterestingFactExercise, // Changed from 'interesting-fact'

  // Speaking
  'speaking_question_exercise': SpeakingQuestionExercise, // Changed from 'question-practice'
  'speaking_monologue_exercise': MonologueExercise,   // Changed from 'monologue'
  'speaking_role_play_exercise': RolePlayExercise,   // Changed from 'role-play'

  // Writing
  'writing_question_exercise': WritingQuestionExercise, // Changed from 'writing-question'
  'writing_storytelling_exercise': StorytellingExercise, // Changed from 'storytelling'
  'writing_diary_exercise': DiaryPracticeExercise,      // Changed from 'diary'

  // Legacy/Other (review if still needed or covered by above)
  'listening': ListeningPracticeHost, // Catch-all for general listening category
  'possessives': () => <PlaceholderExercise name="Possessives" subPracticeType="possessives" />,
};

const ExerciseHost = ({ subPracticeType, language, days, exerciseKey }) => {
  const { t, language: i18nLanguage } = useI18n();

  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
  }

  let ExerciseComponent = exerciseMap[subPracticeType];

  if (!ExerciseComponent) {
    console.warn(`[ExerciseHost] Exercise type "${subPracticeType}" not found directly in exerciseMap. Attempting fallback.`);
    // Fallback for simple keys if subPracticeType might be namespaced (e.g. old system)
    const simpleKey = subPracticeType.split('/').pop();
    if (exerciseMap[simpleKey]) {
        ExerciseComponent = exerciseMap[simpleKey];
        console.log(`[ExerciseHost] Found component using simple key fallback: ${simpleKey}`);
    } else {
        // Fallback for keys that might have a prefix in some older data structure
        const foundKey = Object.keys(exerciseMap).find(key => subPracticeType.endsWith(`/${key}`) || key.endsWith(`/${subPracticeType}`));
        if (foundKey) {
          ExerciseComponent = exerciseMap[foundKey];
          console.log(`[ExerciseHost] Found component using endsWith fallback: ${foundKey}`);
        }
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

  return <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} subPracticeType={subPracticeType} />;
};

export default ExerciseHost;
