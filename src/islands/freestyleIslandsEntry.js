import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Contexts & Providers
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { LatinizationProvider } from '../contexts/LatinizationContext';

// Main Components for Islands
import LanguageSelectorFreestyle from '../components/Freestyle/LanguageSelectorFreestyle';
import ToggleLatinizationButton from '../components/Common/ToggleLatinizationButton';
import DaySelectorFreestyle from '../components/Freestyle/DaySelectorFreestyle';
import PracticeCategoryNav from '../components/Freestyle/PracticeCategoryNav';
import SubPracticeMenu from '../components/Freestyle/SubPracticeMenu';
import ExerciseHost from '../components/Freestyle/ExerciseHost'; // Import ExerciseHost

// Config
import { allMenuItemsConfig as fullMenuConfig } from '../utils/menuNavigationLogic';

// Styles
import '../components/LanguageSelector/LanguageSelector.css';
import '../components/Freestyle/DaySelectorFreestyle.css';
import '../components/Freestyle/PracticeCategoryNav.css';
import '../pages/FreestyleModePage/FreestyleModePage.css';

// --- Global state for islands (simple version) ---
let globalSelectedLanguage = null;
let globalConfirmedDays = [];
let exerciseInstanceKey = 0; // For unique key for ExerciseHost

// --- Language Island ---
export const LanguageIslandApp = () => {
  const { language: i18nLanguage, changeLanguage, t } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState(i18nLanguage);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (i18nLanguage !== selectedLanguage) {
      setSelectedLanguage(i18nLanguage);
    }
  }, [i18nLanguage, selectedLanguage]);

  const showToast = (message, duration = 2500) => { setToast(message); setTimeout(() => setToast(null), duration); };

  const handleLanguageChangeForIsland = (newLanguage) => {
    if (selectedLanguage === newLanguage) return;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
    globalSelectedLanguage = newLanguage;

    const languageName = t(`language.${newLanguage}`, newLanguage.replace('COSY', ''));
    showToast(t('freestyle.languageChangedToast', `Language changed: ${languageName}`, { languageName }));
    window.dispatchEvent(new CustomEvent('languageIslandChange', { detail: { selectedLanguage: newLanguage } }));
  };

  return (
    <>
      <div className="menu-section selector-container">
        <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">
          {t('chooseLanguageLabel', '🌎 Choose Your Language:')}
        </label>
        <LanguageSelectorFreestyle selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChangeForIsland} />
        <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
      </div>
      {toast && <div className="cosy-toast">{toast}</div>}
    </>
  );
};
export const LanguageIslandWrapper = () => <I18nProvider><LatinizationProvider><LanguageIslandApp /></LatinizationProvider></I18nProvider>;

// --- Day Selector Island ---
export const DaySelectorIslandApp = ({ language }) => {
  const [currentDays, setCurrentDays] = useState([]);
  const [currentInputMode, setCurrentInputMode] = useState('choice');

  const localMenuConfigForDaySelector = { /* ... as before ... */
    'day_selection_stage': { children: ['day_single_input', 'day_range_input', 'day_confirm_action'] },
    'day_single_input': { parent: 'day_selection_stage', isModeSelector: true },
    'day_range_input': { parent: 'day_selection_stage', isModeSelector: true },
    'day_confirm_action': { parent: 'day_selection_stage' }
  };
  const getActivePathForDaySelector = () => {
    if (currentInputMode === 'single') return ['day_selection_stage', 'day_single_input'];
    if (currentInputMode === 'range') return ['day_selection_stage', 'day_range_input'];
    return ['day_selection_stage'];
  };
  const isMenuItemVisibleForDaySelector = (path, itemKey) => {
    const currentActiveStage = path.length > 0 ? path[path.length - 1] : null;
    if (itemKey === currentActiveStage) return true;
    if (localMenuConfigForDaySelector[itemKey]?.parent === currentActiveStage) return true;
    if (currentActiveStage === 'day_selection_stage' && (itemKey === 'day_single_input' || itemKey === 'day_range_input')) return currentInputMode === 'choice';
    return false;
 };

  const handleDaySelectorMenuSelect = (itemKey, payload) => {
    if (itemKey === 'day_single_input') setCurrentInputMode('single');
    else if (itemKey === 'day_range_input') setCurrentInputMode('range');
    else if (itemKey === 'day_confirm_action' && payload && payload.days) {
      globalConfirmedDays = payload.days;
      window.dispatchEvent(new CustomEvent('dayIslandConfirm', { detail: { confirmedDays: payload.days } }));
    }
  };
  const handleDaysChangeInIsland = (newDays) => setCurrentDays(newDays);

  return <DaySelectorFreestyle currentDays={currentDays} onDaysChange={handleDaysChangeInIsland} language={language} activePath={getActivePathForDaySelector()} onMenuSelect={handleDaySelectorMenuSelect} isMenuItemVisible={isMenuItemVisibleForDaySelector} allMenuItemsConfig={localMenuConfigForDaySelector} />;
};
export const DaySelectorIslandWrapper = ({ language }) => <I18nProvider><LatinizationProvider><DaySelectorIslandApp language={language} /></LatinizationProvider></I18nProvider>;


// --- Practice Navigation Island ---
export const PracticeNavIslandApp = ({ language, days }) => {
  const [activeMainCatKey, setActiveMainCatKey] = useState(null);
  const [currentIslandNavPath, setCurrentIslandNavPath] = useState(['main_practice_categories_stage']);
  const localNavMenuConfig = fullMenuConfig;

  const localIsMenuItemVisible = (path, itemKey, config) => {
    const currentStage = path[path.length - 1];
    if (itemKey === currentStage) return true;
    if (config[itemKey]?.parent === 'main_practice_categories_stage' && currentStage === 'main_practice_categories_stage') return true;
    if (config[itemKey]?.parent === activeMainCatKey && currentStage === activeMainCatKey) return true;
    return false;
  };

  const localOnMenuSelect = (itemKey) => {
    const itemConfig = localNavMenuConfig[itemKey];
    if (!itemConfig) return;

    if (itemConfig.parent === 'main_practice_categories_stage') {
      setActiveMainCatKey(itemKey);
      setCurrentIslandNavPath(['main_practice_categories_stage', itemKey]);
      if (itemConfig.isExercise) {
        exerciseInstanceKey++; // Increment key for remount
        window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { language, days, exercise: itemKey, key: exerciseInstanceKey } }));
      }
    } else if (itemConfig.parent === activeMainCatKey) {
      if (itemConfig.isExercise) {
        exerciseInstanceKey++; // Increment key for remount
        window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { language, days, exercise: itemKey, key: exerciseInstanceKey } }));
      } else {
        setCurrentIslandNavPath(['main_practice_categories_stage', activeMainCatKey, itemKey]);
      }
    }
  };
  const showSubMenu = activeMainCatKey && localNavMenuConfig[activeMainCatKey]?.children && !localNavMenuConfig[activeMainCatKey]?.isExercise;

  return (
    <>
      <PracticeCategoryNav activePath={currentIslandNavPath} onMenuSelect={localOnMenuSelect} isMenuItemVisible={localIsMenuItemVisible} allMenuItemsConfig={localNavMenuConfig} activeCategoryKey={activeMainCatKey} />
      {showSubMenu && <SubPracticeMenu mainCategoryKey={activeMainCatKey} activeSubPracticeKey={null} activePath={currentIslandNavPath} onMenuSelect={localOnMenuSelect} isMenuItemVisible={localIsMenuItemVisible} allMenuItemsConfig={localNavMenuConfig} />}
    </>
  );
};
export const PracticeNavIslandWrapper = ({ language, days }) => <I18nProvider><LatinizationProvider><PracticeNavIslandApp language={language} days={days} /></LatinizationProvider></I18nProvider>;

// --- Exercise Host Island ---
export const ExerciseHostIslandApp = ({ language, days, subPracticeType, exerciseKey }) => {
  // ExerciseHost uses useI18n internally.
  return (
    <ExerciseHost
      language={language}
      days={days}
      subPracticeType={subPracticeType}
      exerciseKey={exerciseKey}
    />
  );
};
export const ExerciseHostIslandWrapper = ({ language, days, subPracticeType, exerciseKey }) => <I18nProvider><LatinizationProvider><ExerciseHostIslandApp language={language} days={days} subPracticeType={subPracticeType} exerciseKey={exerciseKey} /></LatinizationProvider></I18nProvider>;


// --- Main Mounting & Event Handling Logic ---
if (typeof window !== 'undefined' && typeof document !== 'undefined' && (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')) {
  const languageContainer = document.getElementById('language-selector-island-container');
  if (languageContainer) {
    ReactDOM.createRoot(languageContainer).render(<React.StrictMode><LanguageIslandWrapper /></React.StrictMode>);
  }

  window.addEventListener('languageIslandChange', (event) => {
    const { selectedLanguage } = event.detail;
    globalSelectedLanguage = selectedLanguage;
    const daySelectorContainer = document.getElementById('day-selector-island-container');
    const practiceNavContainer = document.getElementById('practice-nav-island-container');
    const exerciseHostContainer = document.getElementById('exercise-host-container');
    const controlsPlaceholder = document.getElementById('freestyle-controls-placeholder-text');

    if (daySelectorContainer && selectedLanguage) {
      daySelectorContainer.style.display = 'block';
      if (controlsPlaceholder) controlsPlaceholder.style.display = 'none';
      if (!daySelectorContainer._reactRoot) daySelectorContainer._reactRoot = ReactDOM.createRoot(daySelectorContainer);
      daySelectorContainer._reactRoot.render(<React.StrictMode><DaySelectorIslandWrapper language={selectedLanguage} /></React.StrictMode>);
    } else { // Language deselected or not available
      if (daySelectorContainer) { daySelectorContainer.style.display = 'none'; if(daySelectorContainer._reactRoot) {daySelectorContainer._reactRoot.unmount(); daySelectorContainer._reactRoot = null;}}
      if (practiceNavContainer) { practiceNavContainer.style.display = 'none'; if(practiceNavContainer._reactRoot) {practiceNavContainer._reactRoot.unmount(); practiceNavContainer._reactRoot = null;}}
      if (exerciseHostContainer && exerciseHostContainer._reactRoot) { exerciseHostContainer._reactRoot.unmount(); exerciseHostContainer._reactRoot = null; exerciseHostContainer.innerHTML = '<p>Exercise Area</p>';}
      if (controlsPlaceholder) controlsPlaceholder.style.display = 'block';
      globalConfirmedDays = []; // Reset days
    }
  });

  window.addEventListener('dayIslandConfirm', (event) => {
    const { confirmedDays } = event.detail;
    globalConfirmedDays = confirmedDays;
    const practiceNavContainer = document.getElementById('practice-nav-island-container');
    const daySelectorContainer = document.getElementById('day-selector-island-container');
    const exerciseHostContainer = document.getElementById('exercise-host-container');


    if (practiceNavContainer && globalSelectedLanguage && confirmedDays.length > 0) {
      if (daySelectorContainer) daySelectorContainer.style.border = '2px solid green';
      practiceNavContainer.style.display = 'block';
      if (!practiceNavContainer._reactRoot) practiceNavContainer._reactRoot = ReactDOM.createRoot(practiceNavContainer);
      practiceNavContainer._reactRoot.render(<React.StrictMode><PracticeNavIslandWrapper language={globalSelectedLanguage} days={confirmedDays} /></React.StrictMode>);
    } else {
      if (practiceNavContainer) { practiceNavContainer.style.display = 'none'; if(practiceNavContainer._reactRoot) {practiceNavContainer._reactRoot.unmount(); practiceNavContainer._reactRoot = null;}}
    }
    // Clear exercise host if days change
    if (exerciseHostContainer && exerciseHostContainer._reactRoot) { exerciseHostContainer._reactRoot.unmount(); exerciseHostContainer._reactRoot = null; exerciseHostContainer.innerHTML = '<p>Exercise Area</p>';}
  });

  window.addEventListener('exerciseSelected', (event) => {
    const { language, days, exercise, key: exerciseKeyFromEvent } = event.detail;
    console.log('FreestyleIslandsEntry: Exercise selected:', { language, days, exercise, key: exerciseKeyFromEvent });
    const exerciseHostContainer = document.getElementById('exercise-host-container');
    if (exerciseHostContainer) {
      // Clear any placeholder text
      const placeholder = exerciseHostContainer.querySelector('p');
      if(placeholder) placeholder.remove();

      if (!exerciseHostContainer._reactRoot) exerciseHostContainer._reactRoot = ReactDOM.createRoot(exerciseHostContainer);
      exerciseHostContainer._reactRoot.render(
        <React.StrictMode>
          <ExerciseHostIslandWrapper
            language={language}
            days={days}
            subPracticeType={exercise}
            exerciseKey={exerciseKeyFromEvent}
          />
        </React.StrictMode>
      );
    }
  });
}
