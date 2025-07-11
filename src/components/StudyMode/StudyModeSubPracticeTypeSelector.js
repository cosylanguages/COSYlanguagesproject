import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './StudyModeSubPracticeTypeSelector.css'; // We'll create this CSS file later

// TODO: This list should eventually be dynamic based on the selectedPracticeType
// and the actual sub-practices available in the syllabus content for that type.
const PREDEFINED_SUB_PRACTICE_TYPES = {
  vocabulary: [
    { key: 'flashcards', labelKey: 'subPractice.vocabulary.flashcards', defaultLabel: '🃏 Flashcards' },
    { key: 'matching_pairs', labelKey: 'subPractice.vocabulary.matching_pairs', defaultLabel: '🔄 Matching Pairs' },
    { key: 'image_match', labelKey: 'subPractice.vocabulary.image_match', defaultLabel: '🖼️ Image Match' },
    { key: 'word_list', labelKey: 'subPractice.vocabulary.word_list', defaultLabel: '📋 Word List' },
  ],
  grammar: [
    { key: 'fill_blanks', labelKey: 'subPractice.grammar.fill_blanks', defaultLabel: '✍️ Fill in the Blanks' },
    { key: 'sentence_scramble', labelKey: 'subPractice.grammar.sentence_scramble', defaultLabel: '🔄 Sentence Scramble' },
  ],
  pronunciation: [
    { key: 'rules_match', labelKey: 'subPractice.pronunciation.rules_match', defaultLabel: '🗣️ Rules Match' },
    { key: 'listen_repeat', labelKey: 'subPractice.pronunciation.listen_repeat', defaultLabel: '🎧 Listen & Repeat' },
  ],
  dialogue: [
    { key: 'read_comprehend', labelKey: 'subPractice.dialogue.read_comprehend', defaultLabel: '📖 Read & Comprehend' },
    { key: 'role_play', labelKey: 'subPractice.dialogue.role_play', defaultLabel: '🎭 Role Play' },
  ],
  // Add more types as needed
};

const StudyModeSubPracticeTypeSelector = ({
  selectedPracticeType,
  selectedSubPracticeType,
  onSubPracticeTypeSelect,
  // availableSubPracticeTypes can be passed if already determined by parent
}) => {
  const { t } = useI18n();

  const handleSelect = (subTypeKey) => {
    if (onSubPracticeTypeSelect) {
      onSubPracticeTypeSelect(subTypeKey);
    }
  };

  // Determine sub-types based on the main selected practice type
  const subTypesToShow = selectedPracticeType ? PREDEFINED_SUB_PRACTICE_TYPES[selectedPracticeType] || [] : [];

  if (!selectedPracticeType) {
    return null; // Don't show if no main practice type is selected
  }

  if (subTypesToShow.length === 0) {
    return (
      <div className="studymode-subpractice-type-selector-container">
        <p>{t('studyMode.noSubPracticeTypesAvailable', 'No sub-practice options available for this type.')}</p>
      </div>
    );
  }

  const practiceTypeLabels = {
    vocabulary: t('practiceType.vocabulary', 'Vocabulary'),
    grammar: t('practiceType.grammar', 'Grammar'),
    pronunciation: t('practiceType.pronunciation', 'Pronunciation'),
    dialogue: t('practiceType.dialogue', 'Dialogue'),
  };
  const currentPracticeTypeLabel = practiceTypeLabels[selectedPracticeType] || selectedPracticeType;


  return (
    <div className="studymode-subpractice-type-selector-container">
      <h4 className="studymode-subpractice-type-label">
        <TransliterableText text={t('studyMode.chooseSubPracticeType', '🛠️ Choose {practiceType} Option:', { practiceType: currentPracticeTypeLabel })} />
      </h4>
      <div className="studymode-subpractice-type-buttons">
        {subTypesToShow.map((subType) => (
          <button
            key={subType.key}
            onClick={() => handleSelect(subType.key)}
            className={`studymode-subpractice-type-btn ${selectedSubPracticeType === subType.key ? 'active' : ''}`}
            aria-pressed={selectedSubPracticeType === subType.key}
          >
            <TransliterableText text={t(subType.labelKey, subType.defaultLabel)} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyModeSubPracticeTypeSelector;
