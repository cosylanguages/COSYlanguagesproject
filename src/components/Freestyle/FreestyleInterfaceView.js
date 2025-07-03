import React from 'react'; // Removed useState as showLanguageMenu is no longer used here
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelectorFreestyle from './LanguageSelectorFreestyle';
import ToggleLatinizationButton from '../Common/ToggleLatinizationButton';
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import SubPracticeMenu from './SubPracticeMenu';
import ExerciseHost from './ExerciseHost';
import '../../pages/FreestyleModePage/FreestyleModePage.css';

const FreestyleInterfaceView = ({
  selectedLanguage,
  selectedDays,
  currentMainCategory,
  currentSubPractice,
  exerciseKey,
  onLanguageChange,
  onDaysChange,
  onCategorySelect,
  onSubPracticeSelect,
}) => {
  const { t } = useI18n(); // Removed allTranslations, i18nLanguage as they are not directly needed

  return (
    <div className="freestyle-mode-container">
      <div className="main-menu-box">
        <h1 className="freestyle-mode-header" data-transliterable>COSYlanguage</h1>
        
        {/* Language Selection */}
        <div className="menu-section selector-container">
          <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">
            {t('chooseLanguageLabel', '🌎 Choose Your Language:')}
          </label>
          <LanguageSelectorFreestyle
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
          <ToggleLatinizationButton 
            currentDisplayLanguage={selectedLanguage}
          />
        </div>

        {/* Day Selector - shows if language is selected */}
        {selectedLanguage && (
          <div className="selector-container">
            <DaySelectorFreestyle
              currentDays={selectedDays}
              onDaysChange={onDaysChange}
              language={selectedLanguage}
            />
          </div>
        )}

        {/* Practice Category Navigation - shows if language and days are selected */}
        {selectedLanguage && selectedDays && selectedDays.length > 0 && (
          <div className="selector-container">
            <PracticeCategoryNav
              activeCategory={currentMainCategory}
              onCategorySelect={onCategorySelect}
            />
          </div>
        )}

        {/* Sub-Practice Menu - shows if a main category is selected */}
        {selectedLanguage && selectedDays && selectedDays.length > 0 && currentMainCategory && (
          <div className="selector-container">
            <SubPracticeMenu
              mainCategory={currentMainCategory}
              activeSubPractice={currentSubPractice}
              onSubPracticeSelect={onSubPracticeSelect}
            />
          </div>
        )}
      </div>

      {/* Exercise Host Area */}
      <div className="freestyle-mode-exercise-host">
        {selectedLanguage && selectedDays && selectedDays.length > 0 && currentMainCategory && currentSubPractice ? (
          <ExerciseHost
            subPracticeType={currentSubPractice}
            language={selectedLanguage}
            days={selectedDays.map(String)} // Ensure days are strings if required by ExerciseHost
            exerciseKey={exerciseKey}
          />
        ) : (
          <p className="freestyle-mode-message">
            {!selectedLanguage ? t('selectLang', "Please select a language to begin.") :
             !(selectedDays && selectedDays.length > 0) ? t('selectDay', "Please select day(s).") :
             !currentMainCategory ? t('selectPractice', "Please select a practice category.") :
             !currentSubPractice ? t('selectSubPractice', "Please select a specific exercise.") : // Check currentSubPractice now
             t('freestyle.genericInstructions', "Select options above to start an exercise.") // Generic fallback
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
