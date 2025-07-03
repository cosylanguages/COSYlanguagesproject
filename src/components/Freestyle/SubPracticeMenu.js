import React from 'react';
import { useI18n } from '../../i18n/I18nContext'; // Import useI18n

// Translation keys for sub-practice options
// These keys should exist in the translations.js file
const SUB_PRACTICE_OPTIONS = {
  vocabulary: [
    { id: 'random-word', labelKey: 'subPractice.vocabulary.randomWord' },
    { id: 'random-image', labelKey: 'subPractice.vocabulary.randomImage' },
    { id: 'listening', labelKey: 'subPractice.vocabulary.listening' },
    { id: 'practice-all', labelKey: 'subPractice.vocabulary.practiceAll' },
  ],
  grammar: [
    { id: 'gender-articles', labelKey: 'subPractice.grammar.genderArticles' },
    { id: 'verbs-conjugation', labelKey: 'subPractice.grammar.verbsConjugation' },
    { id: 'possessives', labelKey: 'subPractice.grammar.possessives' },
    { id: 'word-order', labelKey: 'subPractice.grammar.wordOrder' },
  ],
  reading: [
    { id: 'story', labelKey: 'subPractice.reading.story' },
    { id: 'interesting-fact', labelKey: 'subPractice.reading.interestingFact' },
  ],
  speaking: [
    { id: 'question-practice', labelKey: 'subPractice.speaking.question' },
    { id: 'monologue', labelKey: 'subPractice.speaking.monologue' },
  ],
  writing: [
    { id: 'writing-question', labelKey: 'subPractice.writing.question' },
    { id: 'storytelling', labelKey: 'subPractice.writing.storytelling' },
  ],
};

const SubPracticeMenu = ({ mainCategory, activeSubPractice, onSubPracticeSelect }) => {
  const { t } = useI18n(); // Initialize the t function

  if (!mainCategory || !SUB_PRACTICE_OPTIONS[mainCategory]) {
    return null;
  }

  const options = SUB_PRACTICE_OPTIONS[mainCategory];
  const mainCategoryTitle = t(`mainCategory.${mainCategory.toLowerCase()}`, mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1));


  return (
    <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
      <h3 style={{ marginTop: '0', textAlign: 'center' }}>{mainCategoryTitle} {t('titles.options', 'Options')}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSubPracticeSelect(option.id)}
            style={{
              padding: '8px 12px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              backgroundColor: activeSubPractice === option.id ? '#28a745' : '#f8f9fa',
              color: activeSubPractice === option.id ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minWidth: '150px', // Ensure buttons have a decent width
              textAlign: 'center',
            }}
            aria-pressed={activeSubPractice === option.id}
          >
            {t(option.labelKey, option.id.replace(/-/g, ' '))} {/* Use t function for labels, with fallback */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubPracticeMenu;
