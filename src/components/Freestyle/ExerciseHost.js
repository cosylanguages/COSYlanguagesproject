import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText'; // Import TransliterableText

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
  const { t, language } = useI18n(); // Added language for TransliterableText
  const exerciseName = name || subPracticeType;
  // For text with simple HTML like <em> or <strong>, TransliterableText might pass it through.
  // If transliteration of content within these tags is an issue, it's a limitation of current utilGetLatinization.
  const message1Text = t('exercises.placeholder.message1', `This is a placeholder for the <em>${exerciseName}</em> exercise.`, { name: exerciseName });

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3><TransliterableText text={t('exercises.placeholder.title', `${exerciseName} Exercise`, { name: exerciseName })} langOverride={language} /></h3>
      {/* If message1Text contains HTML that should also be transliterated, this approach is limited.
          A component that can parse and transliterate segments would be needed for full fidelity.
          For now, assuming text content of the HTML is what matters. */}
      <p dangerouslySetInnerHTML={{ __html: message1Text }} /> 
      {/* A safer way if TransliterableText was enhanced to handle children or structured content:
      <p><TransliterableText text={t('exercises.placeholder.message1', `...`, { name: exerciseName })} langOverride={language} allowHtml={true} /></p> 
      For now, if the HTML is simple and only for styling, what's transliterated is the text content.
      Let's assume for now that the HTML content itself in the translation string does not need to be latinized, only the text around/within it.
      A better approach might be to avoid HTML in translation strings if it complicates latinization.
      If the HTML tags themselves should NOT be latinized, then using TransliterableText on the string containing HTML is okay.
      The useLatinization hook gets the text content.
      */}
      <p><TransliterableText text={t('exercises.placeholder.message2', 'Implementation is pending.')} langOverride={language} /></p>
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
  const { t, language: i18nLanguage } = useI18n(); // Use i18nLanguage for TransliterableText langOverride

  if (!subPracticeType) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}><TransliterableText text={t('exercises.selectExerciseHint', 'Please select an exercise type above.')} langOverride={i18nLanguage} /></p>;
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
      const notFoundText = t('errors.exerciseHost.notFound', `Exercise type "<strong>${subPracticeType}</strong>" not found or not yet implemented.`, { subPracticeType });
      return (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
          <h3><TransliterableText text={t('errors.exerciseHost.title', 'Exercise Error')} langOverride={i18nLanguage} /></h3>
          {/* Similar consideration for dangerouslySetInnerHTML and TransliterableText as above */}
          <p dangerouslySetInnerHTML={{ __html: notFoundText }} />
          <p><TransliterableText text={t('errors.exerciseHost.suggestion', 'Please check the mapping in ExerciseHost.js or select another exercise.')} langOverride={i18nLanguage} /></p>
        </div>
      );
    }
  }
  
  // The ExerciseComponent itself will be responsible for applying TransliterableText to its own content
  // and using its `language` prop (which is the target learning language) for that.
  return <ExerciseComponent language={language} days={days} exerciseKey={exerciseKey} />;
};

export default ExerciseHost;
