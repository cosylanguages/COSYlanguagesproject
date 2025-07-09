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
  const showDaySelector = isMenuItemVisible(activePath, 'day_selection_stage', allMenuItemsConfig);
  const showPracticeCategories = isMenuItemVisible(activePath, 'main_practice_categories_stage', allMenuItemsConfig);

  // SubPracticeMenu visibility: if a main category is active and has children
  // The key for the main category itself (e.g., 'vocabulary') should be the active stage for SubPracticeMenu to appear.
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
        {/* PracticeCategoryNav should be visible if 'main_practice_categories_stage' is active OR one of its children (a main category like 'vocabulary') is active.
            If 'vocabulary' is active, PracticeCategoryNav might show 'vocabulary' as selected and other main cats as options.
            The isMenuItemVisible for 'main_practice_categories_stage' covers the first case.
            If a specific category like 'vocabulary' is the activeStage, PracticeCategoryNav should still render.
            Let's refine this: It should be visible if the path is at or beyond 'main_practice_categories_stage',
            but not yet at a leaf exercise node (unless the category itself is a leaf).
        */}
        {isMenuItemVisible(activePath, 'main_practice_categories_stage', allMenuItemsConfig) && (
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
        {/* showSubPracticeMenu logic was: currentMainCategoryKey && activePath.includes(currentMainCategoryKey) && ...
            This translates to: the currentMainCategoryKey (e.g. 'vocabulary') IS the active stage.
            And it should have children to display.
        */}
        {currentMainCategoryKey &&
         isMenuItemVisible(activePath, currentMainCategoryKey, allMenuItemsConfig) &&
         allMenuItemsConfig[currentMainCategoryKey]?.children?.length > 0 &&
         !allMenuItemsConfig[currentMainCategoryKey]?.isExercise && // Don't show sub-menu if the category itself is an exercise host
         (
           // Ensure we are not already at a deeper exercise level within this category
           activePath.length === (allMenuItemsConfig[currentMainCategoryKey]?.parent.split('/').length || 0) + 2 // Path: [...parent, main_cat_stage, main_cat_key]
         ) && (
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
             !isMenuItemVisible(activePath, 'day_confirm_action', allMenuItemsConfig) && activePath.includes('day_selection_stage') ? t('selectDayAndConfirm', "Please select day(s) and confirm.") :
             !isMenuItemVisible(activePath, 'main_practice_categories_stage', allMenuItemsConfig) && isMenuItemVisible(activePath, 'day_confirm_action', allMenuItemsConfig) ? t('freestyle.loadingCategories', "Loading categories...") : // Placeholder if needed
             isMenuItemVisible(activePath, 'main_practice_categories_stage', allMenuItemsConfig) && !currentMainCategoryKey && !showExerciseHost ? t('selectPractice', "Please select a practice category.") :
             currentMainCategoryKey && isMenuItemVisible(activePath, currentMainCategoryKey, allMenuItemsConfig) && !currentSubPracticeKey && !showExerciseHost && allMenuItemsConfig[currentMainCategoryKey]?.children?.length > 0 && !allMenuItemsConfig[currentMainCategoryKey]?.isExercise ? t('selectSubPractice', "Please select a specific exercise.") :
             !showExerciseHost ? t('freestyle.selectExerciseFromMenu', "Select an exercise from the menu.") :
             t('freestyle.genericInstructions', "Select options above to start an exercise.")
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
