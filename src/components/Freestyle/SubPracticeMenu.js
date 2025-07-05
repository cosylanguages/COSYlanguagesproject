import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText'; // For consistency if needed
import './PracticeCategoryNav.css'; // Can reuse or create specific styles

// Props now include menu navigation logic utilities
const SubPracticeMenu = ({
  mainCategoryKey,      // e.g., 'vocabulary'
  activeSubPracticeKey, // e.g., 'vocab_random_word' (key of the currently active sub-item)
  activePath,
  onMenuSelect,
  isMenuItemVisible,
  allMenuItemsConfig
}) => {
  const { t } = useI18n();

  if (!mainCategoryKey || !allMenuItemsConfig[mainCategoryKey] || !allMenuItemsConfig[mainCategoryKey].children) {
    // This shouldn't happen if FreestyleInterfaceView controls visibility correctly,
    // but as a safeguard:
    return null; 
  }

  const subPracticeItemKeys = allMenuItemsConfig[mainCategoryKey].children || [];

  // Define display properties for sub-practice items. 
  // Ideally, this could also be part of allMenuItemsConfig or a related display config.
  // For now, simple mapping based on common patterns.
  const getSubPracticeItemLabel = (itemKey) => {
    // Example: 'vocab_random_word' -> t('subPractice.vocab_random_word', 'Random Word')
    // More robust mapping might be needed.
    const fallbackLabel = itemKey.split('_').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return t(`subPractice.${mainCategoryKey}.${itemKey}`, fallbackLabel); 
  };
  
  const itemsToDisplay = subPracticeItemKeys
    .filter(itemKey => isMenuItemVisible(activePath, itemKey, allMenuItemsConfig))
    .map(itemKey => ({
      id: itemKey,
      label: getSubPracticeItemLabel(itemKey),
      isActive: activeSubPracticeKey === itemKey // Or check activePath.includes(itemKey) and depth
    }));

  const mainCategoryDisplayInfo = {
    vocabulary: { translationKey: 'vocabulary', defaultLabel: 'Vocabulary' },
    grammar: { translationKey: 'grammar', defaultLabel: 'Grammar' },
    reading: { translationKey: 'reading', defaultLabel: 'Reading' },
    speaking: { translationKey: 'speaking', defaultLabel: 'Speaking' },
    writing: { translationKey: 'writing', defaultLabel: 'Writing' },
    listening: { translationKey: 'listening', defaultLabel: 'Listening' },
  };
  
  const mainCategoryTitle = mainCategoryDisplayInfo[mainCategoryKey] 
    ? t(mainCategoryDisplayInfo[mainCategoryKey].translationKey, mainCategoryDisplayInfo[mainCategoryKey].defaultLabel)
    : mainCategoryKey;

  if (itemsToDisplay.length === 0) {
    // This case implies that a sub-practice item was selected and it, itself, has children,
    // so this menu's items are correctly hidden by isMenuItemVisible.
    // Or, the mainCategoryKey has no children defined.
    return null; 
  }

  return (
    <div className="sub-practice-menu-container practice-category-nav-container"> {/* Reusing some styles */}
      <h4 className="sub-practice-menu-label practice-category-label"> {/* Reusing some styles */}
        <TransliterableText text={`${mainCategoryTitle} - ${t('titles.options', 'Options')}`} />
      </h4>
      <div className="practice-category-buttons"> {/* Reusing some styles */}
        {itemsToDisplay.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuSelect(item.id)}
            className={`practice-category-btn sub-practice-btn ${item.isActive ? 'active' : ''}`}
            aria-pressed={item.isActive}
          >
            <TransliterableText text={item.label} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubPracticeMenu;
