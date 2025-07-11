import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './StudyModePracticeTypeSelector.css'; // We'll create this CSS file later

// TODO: This list should eventually be dynamic based on available content
// and the mapping from syllabus block_types.
const PREDEFINED_PRACTICE_TYPES = [
  { key: 'vocabulary', labelKey: 'practiceType.vocabulary', defaultLabel: '🔠 Vocabulary' },
  { key: 'grammar', labelKey: 'practiceType.grammar', defaultLabel: '🧩 Grammar' },
  { key: 'pronunciation', labelKey: 'practiceType.pronunciation', defaultLabel: '🗣️ Pronunciation' },
  { key: 'dialogue', labelKey: 'practiceType.dialogue', defaultLabel: '💬 Dialogue' },
  // Add more types as needed based on Step 1 findings and syllabus capabilities
];

const StudyModePracticeTypeSelector = ({
  selectedPracticeType,
  onPracticeTypeSelect,
  availablePracticeTypes = PREDEFINED_PRACTICE_TYPES // Prop to allow dynamic types later
}) => {
  const { t } = useI18n();

  const handleSelect = (typeKey) => {
    if (onPracticeTypeSelect) {
      onPracticeTypeSelect(typeKey);
    }
  };

  if (!availablePracticeTypes || availablePracticeTypes.length === 0) {
    return <p>{t('studyMode.noPracticeTypesAvailable', 'No practice types available for this selection.')}</p>;
  }

  return (
    <div className="studymode-practice-type-selector-container">
      <h3 className="studymode-practice-type-label">
        <TransliterableText text={t('studyMode.choosePracticeType', '🎯 Choose Practice Type:')} />
      </h3>
      <div className="studymode-practice-type-buttons">
        {availablePracticeTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => handleSelect(type.key)}
            className={`studymode-practice-type-btn ${selectedPracticeType === type.key ? 'active' : ''}`}
            aria-pressed={selectedPracticeType === type.key}
          >
            <TransliterableText text={t(type.labelKey, type.defaultLabel)} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyModePracticeTypeSelector;
