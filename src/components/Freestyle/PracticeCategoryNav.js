import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './PracticeCategoryNav.css';

const PracticeCategoryNav = ({ activeCategory, onCategorySelect }) => {
  const { t } = useI18n();

  // Define the practice categories statically.
  const definedPracticeCategories = [
    { id: 'vocabulary', translationKey: 'vocabulary', defaultLabel: '🔠 Vocabulary' },
    { id: 'grammar', translationKey: 'grammar', defaultLabel: '🧩 Grammar' },
    { id: 'reading', translationKey: 'reading', defaultLabel: '📚 Reading' },
    { id: 'speaking', translationKey: 'speaking', defaultLabel: '🗣️ Speaking' },
    { id: 'writing', translationKey: 'writing', defaultLabel: '✍️ Writing' },
  ];

  const getCategoryLabel = (categoryId) => {
    const categoryDefinition = definedPracticeCategories.find(c => c.id === categoryId);
    if (categoryDefinition) {
      return t(categoryDefinition.translationKey, categoryDefinition.defaultLabel);
    }
    // Fallback for unknown categoryId, though this shouldn't happen with current setup
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  if (activeCategory) {
    // An active category is selected, show only that category as a button.
    // Clicking this button will call onCategorySelect with the activeCategory,
    // signaling to the parent component to toggle it (i.e., deselect it).
    return (
      <div className="practice-category-nav-container">
        <h3 className="practice-category-label">
          <TransliterableText text={t('mainCategory.selectedLabel', 'Selected Category:')} />
        </h3>
        <div className="practice-category-buttons">
          <button
            key={activeCategory}
            onClick={() => onCategorySelect(activeCategory)}
            className="practice-category-btn active" // Indicate it's the active one
            aria-pressed="true"
          >
            {getCategoryLabel(activeCategory)}
          </button>
        </div>
      </div>
    );
  } else {
    // No category is active, show all available categories.
    const practiceCategoriesToDisplay = definedPracticeCategories.map(category => ({
      id: category.id,
      label: getCategoryLabel(category.id)
    }));
    const choosePracticeLabelText = t('selectPractice', '🧭 Choose Your Practice:');

    return (
      <div className="practice-category-nav-container">
        <h3 className="practice-category-label">
          <TransliterableText text={choosePracticeLabelText} />
        </h3>
        <div className="practice-category-buttons">
          {practiceCategoriesToDisplay.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="practice-category-btn" // Not active by default
              aria-pressed="false"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
};

export default PracticeCategoryNav;
