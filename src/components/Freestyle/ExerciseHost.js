import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';

// Vocabulary Host Components
import RandomWordPracticeHost from './exercises/vocabulary/RandomWordPracticeHost';
import RandomImagePracticeHost from './exercises/vocabulary/RandomImagePracticeHost';
import ListeningPracticeHost from './exercises/vocabulary/ListeningPracticeHost';
import PracticeAllVocabHost from './exercises/vocabulary/PracticeAllVocabHost';
import MainPracticeAllHost from './MainPracticeAllHost';

// Specific Vocabulary Exercise Components
// import ShowWordExercise from './exercises/vocabulary/ShowWordExercise'; // Unused
// import IdentifyImageExercise from './exercises/vocabulary/IdentifyImageExercise'; // Unused
// import TranscribeWordExercise from './exercises/vocabulary/TranscribeWordExercise'; // Unused
// import TypeOppositeExercise from './exercises/vocabulary/TypeOppositeExercise'; // Potentially to be merged or removed - Unused
// import MatchOppositesExercise from './exercises/vocabulary/MatchOppositesExercise'; // Potentially to be merged or removed - Unused
// import BuildWordExercise from './exercises/vocabulary/BuildWordExercise'; // Potentially to be merged or removed (replaced by LettersScramble) - Unused
// import MatchImageWordExercise from './exercises/vocabulary/MatchImageWordExercise'; // Potentially to be merged or removed - Unused

// New Vocabulary Exercise Stubs
import RandomWordImageExercise from './exercises/vocabulary/RandomWordImageExercise';
import GenericMatchItExercise from './exercises/vocabulary/GenericMatchItExercise';
import LettersScrambleExercise from './exercises/vocabulary/LettersScrambleExercise';
import TrueFalseExercise from './exercises/vocabulary/TrueFalseExercise';

// Grammar Exercise Components
import SelectArticleExercise from './exercises/grammar/SelectArticleExercise';
import ConjugationPracticeExercise from './exercises/grammar/ConjugationPracticeExercise';
import TypeVerbExercise from './exercises/grammar/TypeVerbExercise';
import FillGapsExercise from './exercises/grammar/FillGapsExercise';
import WordOrderExercise from './exercises/grammar/WordOrderExercise';

// Sentence Skills Components
import SentenceUnscramblePracticeHost from './exercises/common/SentenceUnscramblePracticeHost';
import FillInTheBlanksPracticeHost from './exercises/common/FillInTheBlanksPracticeHost'; // New Import
import NumberPracticeExercise from './exercises/common/NumberPracticeExercise';

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
  // Vocabulary Host Keys
  'vocab_random_word_host': RandomWordPracticeHost,
  'vocab_random_image_host': RandomImagePracticeHost,
  'vocab_listening_host': ListeningPracticeHost,
  'vocab_practice_all_sub_host': PracticeAllVocabHost, // This might need review later if it's still relevant
  'practice_all_main_cat': MainPracticeAllHost, // This was removed from main categories config

  // New Vocabulary Exercise Mappings
  'vocabulary_random_word_image': RandomWordImageExercise,
  'vocabulary_opposites_match': GenericMatchItExercise,
  'vocabulary_letters_scramble': LettersScrambleExercise,
  'vocabulary_true_false': TrueFalseExercise,

  // Old/Obsolete specific vocabulary exercises (commented out, to be removed if not reused/merged)
  // 'vocab_random_word_exercise': RandomWordPracticeHost, // Replaced by vocabulary_random_word_image
  // 'vocab_random_image_exercise': RandomImagePracticeHost, // Replaced by vocabulary_random_word_image
  // 'vocab_match_image_word_exercise': MatchImageWordExercise, // Potentially part of vocabulary_opposites_match
  // 'vocab_listening_exercise': ListeningPracticeHost, // Listening removed as a main/vocab category for now
  // 'vocab_type_opposite_exercise': TypeOppositeExercise, // Potentially part of vocabulary_opposites_match
  // 'vocab_match_opposites_exercise': MatchOppositesExercise, // Potentially part of vocabulary_opposites_match
  // 'vocab_build_word_exercise': BuildWordExercise, // Replaced by vocabulary_letters_scramble

  // Grammar
  'grammar_fill_gaps_exercise': FillGapsExercise,
  'grammar_type_verb_exercise': TypeVerbExercise,
  'grammar_select_article_exercise': SelectArticleExercise,
  'grammar_word_order_exercise': WordOrderExercise,
  'grammar_conjugation_practice': ConjugationPracticeExercise,

  // Sentence Skills
  'sentence_unscramble_exercise': SentenceUnscramblePracticeHost,
  'fill_in_the_blanks_exercise': FillInTheBlanksPracticeHost, // New Entry
  'number_practice_exercise': NumberPracticeExercise,

  // Reading
  'reading_story_exercise': StoryReadingExercise,
  'reading_interesting_fact_exercise': InterestingFactExercise,

  // Speaking
  'speaking_question_exercise': SpeakingQuestionExercise,
  'speaking_monologue_exercise': MonologueExercise,
  'speaking_role_play_exercise': RolePlayExercise,

  // Writing
  'writing_question_exercise': WritingQuestionExercise,
  'writing_storytelling_exercise': StorytellingExercise,
  'writing_diary_exercise': DiaryPracticeExercise,

  // General Listening (if directly selected as a category) - Obsolete, now under vocabulary
  // 'listening': ListeningPracticeHost,
  'possessives': () => <PlaceholderExercise name="Possessives" subPracticeType="possessives" />, // Placeholder

  // New Vocabulary mappings based on user feedback
  'vocabulary_listening': ListeningPracticeHost,
  'vocabulary_practice_all': PracticeAllVocabHost,
};

const ExerciseHost = ({ subPracticeType, language, days, exerciseKey }) => {
  const { t, language: i18nLanguage } = useI18n();

  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
  }

  let ExerciseComponent = exerciseMap[subPracticeType];

  if (!ExerciseComponent) {
    console.warn(`[ExerciseHost] Exercise type "${subPracticeType}" not found directly in exerciseMap.`);
    // Basic fallback removed for clarity, direct match is preferred.
    // If specific fallbacks are needed, they should be explicit or handled by menu logic.
    const notFoundText = t('errors.exerciseHost.notFound', `Exercise type "<strong>${subPracticeType}</strong>" not found or not yet implemented.`, { subPracticeType });
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
        <h3><TransliterableText text={t('errors.exerciseHost.title', 'Exercise Error')} langOverride={i18nLanguage} /></h3>
        <p dangerouslySetInnerHTML={{ __html: notFoundText }} />
        <p><TransliterableText text={t('errors.exerciseHost.suggestion', 'Please check the mapping in ExerciseHost.js or select another exercise.')} langOverride={i18nLanguage} /></p>
      </div>
    );
  }

  return <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} subPracticeType={subPracticeType} />;
};

export default ExerciseHost;
