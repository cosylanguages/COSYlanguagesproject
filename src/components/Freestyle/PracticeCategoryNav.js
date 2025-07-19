import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './PracticeCategoryNav.css';

// Props now include menu navigation logic utilities
const PracticeCategoryNav = ({ 
    activePath, // From parent island (e.g., PracticeNavIslandApp)
    onMenuSelect, // From parent island
    isMenuItemVisible, // Function from menuNavigationLogic
    allMenuItemsConfig, // The menu config
    // activeCategoryKey is still useful for styling the "active" button
    activeCategoryKey 
}) => {
  const { t } = useI18n();

  // Get category keys from the config, children of 'main_practice_categories_stage'
  const categoryKeys = allMenuItemsConfig.main_practice_categories_stage?.children || [];

  // Define display properties for categories (could be part of allMenuItemsConfig in future)
  const categoryDisplayInfo = {
    vocabulary: { translationKey: 'vocabulary', defaultLabel: '🔠 Vocabulary', icon: '🔠' },
    grammar: { translationKey: 'grammar', defaultLabel: '🧩 Grammar', icon: '🧩' },
    reading: { translationKey: 'reading', defaultLabel: '📚 Reading', icon: '📚' },
    speaking: { translationKey: 'speaking', defaultLabel: '🗣️ Speaking', icon: '🗣️' },
    writing: { translationKey: 'writing', defaultLabel: '✍️ Writing', icon: '✍️' },
    number_practice: { translationKey: 'number_practice', defaultLabel: '🔢 Number Practice', icon: '🔢' },
    // sentence_skills, listening, and practice_all_main_cat removed
    // Add other categories as needed
  };

  const getCategoryLabel = (categoryKey) => {
    const displayInfo = categoryDisplayInfo[categoryKey];
    if (displayInfo) {
      return t(displayInfo.translationKey, displayInfo.defaultLabel);
    }
    return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/_/g, ' ');
  };
  
  // Determine which categories to render based on visibility logic
  const practiceCategoriesToDisplay = categoryKeys
    .filter(catKey => isMenuItemVisible(activePath, catKey, allMenuItemsConfig))
    .map(catKey => ({
      id: catKey,
      label: getCategoryLabel(catKey),
      isActive: activeCategoryKey === catKey // Or activePath.includes(catKey) and it's the relevant segment
    }));

  // If no categories are meant to be visible according to the logic (e.g., a sub-menu is very deep)
  // this component might render nothing, or a specific "active category" display.
  // The current logic of isMenuItemVisible should handle this: if path is deeper than main_practice_categories_stage,
  // then only the active category button (as an ancestor) will be visible.

  const choosePracticeLabelText = t('selectPractice', '🧭 Choose Your Practice:');
  
  // Check if any category is currently active at this level or deeper
  const isAnyCategoryActiveOrBeyond = activePath.includes('main_practice_categories_stage') && 
                                   activePath.length > allMenuItemsConfig['main_practice_categories_stage'].parent.split('/').length + 1;


  return (
    <div className="practice-category-nav-container">
      <h3 className="practice-category-label">
        <TransliterableText text={choosePracticeLabelText} />
      </h3>
      <div className="practice-category-buttons">
        {practiceCategoriesToDisplay.map((category) => (
          <button
            key={category.id}
            onClick={() => onMenuSelect(category.id)}
            className={`practice-category-btn ${category.isActive ? 'active' : ''}`}
            aria-pressed={category.isActive}
          >
            {category.label}
          </button>
        ))}
        {practiceCategoriesToDisplay.length === 0 && !isAnyCategoryActiveOrBeyond && (
            <p>{t('freestyle.noCategoriesAvailable', 'No practice categories available at this stage.')}</p>
        )}
         {/* If a category is active and its children are shown, this nav might only show the active category.
             The parent island (PracticeNavIslandApp) handles showing the SubPracticeMenu alongside or instead.
             The current filtering logic ensures only relevant buttons are shown.
          */}
      </div>
    </div>
  );
};

export default PracticeCategoryNav;
