import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelectorFreestyle from './LanguageSelectorFreestyle';
import ToggleLatinizationButton from '../Common/ToggleLatinizationButton';
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import SubPracticeMenu from './SubPracticeMenu';
import ExerciseHost from './ExerciseHost';
import '../../pages/FreestyleModePage/FreestyleModePage.css';

// Import the menu logic utilities (assuming they are passed as props)
// No direct import of menuNavigationLogic.js here, it uses props.

const FreestyleInterfaceView = ({
  // Original state props (still needed for some direct uses or display)
  selectedLanguage,
  selectedDays,
  currentMainCategoryKey, // Now passing the key
  currentSubPracticeKey,  // Now passing the key
  exerciseKey,

  // New props for menu navigation logic
  activePath,
  onMenuSelect, // The main handler to call with item keys
  isMenuItemVisible,
  allMenuItemsConfig,

  // Original handlers (some might be adapted or used by new wrappers)
  onLanguageChange, // This is now handleLanguageChangeWrapper from FreestyleModePage
  onDaysChange,     // This is now handleDaysChangeWrapper from FreestyleModePage
  // onCategorySelect and onSubPracticeSelect are effectively replaced by onMenuSelect calls from child components
}) => {
  const { t } = useI18n();

  // Determine visibility of major sections using the new logic
  // const showLanguageSelector = activePath.length === 0; // Show initially - ESLint: 'showLanguageSelector' is assigned a value but never used.
  const showDaySelector = isMenuItemVisible(activePath, 'day_selection_stage', allMenuItemsConfig);
  const showPracticeCategories = isMenuItemVisible(activePath, 'main_practice_categories_stage', allMenuItemsConfig);
  
  // SubPracticeMenu visibility: if a main category is active and has children
  const showSubPracticeMenu = currentMainCategoryKey && 
                              activePath.includes(currentMainCategoryKey) && 
                              allMenuItemsConfig[currentMainCategoryKey]?.children?.length > 0 &&
                              activePath[activePath.length -1 ] === currentMainCategoryKey;


  // ExerciseHost visibility: if the last item in activePath is a leaf node (no children defined in config)
  // and it's not one of the container/stage keys.
  let showExerciseHost = false;
  let exerciseHostSubPracticeType = null;

  if (activePath.length > 0) {
    const lastActiveItemKey = activePath[activePath.length - 1];
    const lastItemConfig = allMenuItemsConfig[lastActiveItemKey];
    if (lastItemConfig && (!lastItemConfig.children || lastItemConfig.children.length === 0)) {
      // Check if it's not a "stage" or "action" key that shouldn't directly host an exercise
      if (lastActiveItemKey !== 'day_selection_stage' && 
          lastActiveItemKey !== 'day_confirm_action' &&
          lastActiveItemKey !== 'main_practice_categories_stage') {
        showExerciseHost = true;
        // The subPracticeType for ExerciseHost is the key of the leaf node.
        // This might be a main category if it has no subs (e.g. practice_all_main_cat)
        // or a sub-practice item, or a sub-sub-practice item.
        exerciseHostSubPracticeType = lastActiveItemKey; 
      }
    }
  }
  // If currentSubPracticeKey is set (from FreestyleModePage logic), it means we are at an exercise level.
  // This provides a more direct way if FreestyleModePage correctly identifies the exercise target.
  if (currentSubPracticeKey) {
      showExerciseHost = true;
      exerciseHostSubPracticeType = currentSubPracticeKey;
  }


  return (
    <div className="freestyle-mode-container">
      <div className="main-menu-box">
        <h1 className="freestyle-mode-header" data-transliterable>COSYlanguage</h1>
        
        {/* Language Selection - always show or manage via activePath if needed */}
        {/* For now, let's assume it's always available, or its onLanguageChange triggers the first onMenuSelect */}
        <div className="menu-section selector-container">
          <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">
            {t('chooseLanguageLabel', '🌎 Choose Your Language:')}
          </label>
          <LanguageSelectorFreestyle
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange} // This is the wrapper from FreestyleModePage
          />
          <ToggleLatinizationButton 
            currentDisplayLanguage={selectedLanguage}
          />
        </div>

        {/* Day Selector */}
        {showDaySelector && selectedLanguage && ( // Also check selectedLanguage as day selector needs it
          <div className="selector-container">
            <DaySelectorFreestyle
              currentDays={selectedDays}
              onDaysChange={onDaysChange} // Wrapper for local day changes
              language={selectedLanguage}
              // Props for new menu logic
              activePath={activePath}
              onMenuSelect={onMenuSelect}
              isMenuItemVisible={isMenuItemVisible}
              allMenuItemsConfig={allMenuItemsConfig}
            />
          </div>
        )}

        {/* Practice Category Navigation */}
        {showPracticeCategories && (
          <div className="selector-container">
            <PracticeCategoryNav
              // activeCategory prop might need to be derived from activePath or currentMainCategoryKey
              activeCategoryKey={currentMainCategoryKey} 
              onMenuSelect={onMenuSelect} // Categories will call this with their itemKey
              // Pass menu logic props if PracticeCategoryNav itself needs to check visibility of its children
              activePath={activePath}
              isMenuItemVisible={isMenuItemVisible}
              allMenuItemsConfig={allMenuItemsConfig}
            />
          </div>
        )}

        {/* Sub-Practice Menu */}
        {showSubPracticeMenu && currentMainCategoryKey && (
          <div className="selector-container">
            <SubPracticeMenu
              mainCategoryKey={currentMainCategoryKey} // Pass the key of the parent category
              activeSubPracticeKey={currentSubPracticeKey} // Pass the key of the active sub-practice
              onMenuSelect={onMenuSelect} // Sub-items will call this
              activePath={activePath}
              isMenuItemVisible={isMenuItemVisible}
              allMenuItemsConfig={allMenuItemsConfig}
            />
          </div>
        )}
      </div>

      {/* Exercise Host Area */}
      <div className="freestyle-mode-exercise-host">
        {showExerciseHost && selectedLanguage && selectedDays && selectedDays.length > 0 ? (
          <ExerciseHost
            subPracticeType={exerciseHostSubPracticeType} // Determined by activePath leaf
            language={selectedLanguage}
            days={selectedDays.map(String)} 
            exerciseKey={exerciseKey} // To force re-mount/re-fetch
          />
        ) : (
          <p className="freestyle-mode-message">
            {/* Updated placeholder messages based on new state logic */}
            {!selectedLanguage ? t('selectLang', "Please select a language to begin.") :
             !activePath.includes('day_confirm_action') ? t('selectDayAndConfirm', "Please select day(s) and confirm.") :
             !currentMainCategoryKey && !showExerciseHost ? t('selectPractice', "Please select a practice category.") :
             !currentSubPracticeKey && !showExerciseHost && allMenuItemsConfig[currentMainCategoryKey]?.children?.length > 0 ? t('selectSubPractice', "Please select a specific exercise.") :
             !showExerciseHost ? t('freestyle.selectExerciseFromMenu', "Select an exercise from the menu.") : // Fallback if no exercise yet
             t('freestyle.genericInstructions', "Select options above to start an exercise.")
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
