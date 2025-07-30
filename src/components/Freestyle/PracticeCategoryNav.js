import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useFreestyle } from '../../contexts/FreestyleContext';
import TransliterableText from '../Common/TransliterableText';
import './PracticeCategoryNav.css';

const PracticeCategoryNav = ({ language, days }) => {
  const { t } = useI18n();
  const { selectedExercise, setSelectedExercise } = useFreestyle();

  const handleCategorySelect = (category) => {
    // For now, we'll just set the category.
    // In the future, we might want to have a sub-menu for each category.
    setSelectedExercise({ exercise: category, key: `${language}-${days.join(',')}-${category}` });
  };

  const categoryDisplayInfo = {
    vocabulary: { translationKey: 'vocabulary', defaultLabel: '🔠 Vocabulary', icon: '🔠' },
    grammar: { translationKey: 'grammar', defaultLabel: '🧩 Grammar', icon: '🧩' },
    reading: { translationKey: 'reading', defaultLabel: '📚 Reading', icon: '📚' },
    speaking: { translationKey: 'speaking', defaultLabel: '🗣️ Speaking', icon: '🗣️' },
    writing: { translationKey: 'writing', defaultLabel: '✍️ Writing', icon: '✍️' },
  };

  const categoryKeys = Object.keys(categoryDisplayInfo);

  return (
    <div className="practice-category-nav-container">
      <h3 className="practice-category-label">
        <TransliterableText text={t('selectPractice', '🧭 Choose Your Practice:')} />
      </h3>
      <div className="practice-category-buttons">
        {categoryKeys.map((categoryKey) => (
          <button
            key={categoryKey}
            onClick={() => handleCategorySelect(categoryKey)}
            className={`practice-category-btn ${selectedExercise?.exercise === categoryKey ? 'active' : ''}`}
          >
            {t(categoryDisplayInfo[categoryKey].translationKey, categoryDisplayInfo[categoryKey].defaultLabel)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticeCategoryNav;
