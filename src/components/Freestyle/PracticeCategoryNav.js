import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText'; // For the label

// It's good practice to have a dedicated CSS file for components
import './PracticeCategoryNav.css'; 

const PracticeCategoryNav = ({ activeCategory, onCategorySelect }) => {
  const { t } = useI18n(); // Removed allTranslations and language as they are not needed directly here

  // Define the practice categories statically for now.
  // Labels will be fetched using t(category.id) or t(category.translationKey)
  const definedPracticeCategories = [
    { id: 'vocabulary', translationKey: 'vocabulary', defaultLabel: '🔠 Vocabulary' },
    { id: 'grammar', translationKey: 'grammar', defaultLabel: '🧩 Grammar' },
    { id: 'reading', translationKey: 'reading', defaultLabel: '📚 Reading' },
    { id: 'speaking', translationKey: 'speaking', defaultLabel: '🗣️ Speaking' },
    { id: 'writing', translationKey: 'writing', defaultLabel: '✍️ Writing' },
    // { id: 'practiceAll', translationKey: 'practiceAll', defaultLabel: '🔄 Practice All'} // Example if "Practice All" is a category
  ];

  const practiceCategories = definedPracticeCategories.map(category => ({
    id: category.id,
    label: t(category.translationKey, category.defaultLabel) // Get translated label
  }));

  const choosePracticeLabelText = t('selectPractice', '🧭 Choose Your Practice:'); // Use existing key 'selectPractice'

  return (
    <div className="practice-category-nav-container">
      <h3 className="practice-category-label">
        <TransliterableText text={choosePracticeLabelText} />
      </h3>
      <div className="practice-category-buttons">
        {practiceCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`practice-category-btn ${activeCategory === category.id ? 'active' : ''}`}
            aria-pressed={activeCategory === category.id}
          >
            {/* Label is now translated via t() */}
            {category.label} 
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticeCategoryNav;
