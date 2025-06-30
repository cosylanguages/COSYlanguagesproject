import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

const PracticeCategoryNav = ({ activeCategory, onCategorySelect }) => {
  const { t, allTranslations, language } = useI18n();

  // Get main categories from the translations for the current language
  // The mainCategory object should have keys like 'vocabulary', 'grammar', etc.
  // and values like '🔠 Vocabulary', '🧩 Grammar', etc.
  const currentLanguageTranslations = allTranslations[language] || allTranslations.COSYenglish;
  // Ensure mainCategory exists and is an object, default to COSYenglish's mainCategory if not found or if it's not an object
  let mainCategoriesSource = currentLanguageTranslations.mainCategory;
  if (typeof mainCategoriesSource !== 'object' || mainCategoriesSource === null) {
    mainCategoriesSource = allTranslations.COSYenglish.mainCategory || {};
  }
  
  const mainCategories = mainCategoriesSource;

  const practiceCategories = Object.keys(mainCategories).map(key => ({
    id: key, // e.g., 'vocabulary'
    // The label is directly from the mainCategory object's value, which is already translated.
    // If mainCategory values were keys (e.g., 'mainCategory.vocabulary'), we'd use t() here.
    label: mainCategories[key] 
  }));

  return (
    <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
      {practiceCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          style={{
            padding: '10px 15px',
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: activeCategory === category.id ? '#007bff' : '#f0f0f0',
            color: activeCategory === category.id ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
          aria-pressed={activeCategory === category.id}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default PracticeCategoryNav;
