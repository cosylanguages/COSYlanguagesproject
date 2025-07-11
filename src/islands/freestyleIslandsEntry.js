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

// Config (can be a subset if needed, or full for simplicity if it doesn't cause issues)
import { allMenuItemsConfig as fullMenuConfig } from '../utils/menuNavigationLogic';

// Styles
import '../components/LanguageSelector/LanguageSelector.css';
import '../components/Freestyle/DaySelectorFreestyle.css';
import '../components/Freestyle/PracticeCategoryNav.css'; // For PracticeCategoryNav & SubPracticeMenu
import '../pages/FreestyleModePage/FreestyleModePage.css';

// --- Global state for islands (simple version) ---
let globalSelectedLanguage = null;
let globalConfirmedDays = [];

// --- Language Island ---
export const LanguageIslandApp = () => {
  const { language: i18nLanguage, changeLanguage, t } = useI18n();
  // Initialize from context, useEffect will handle updates.
  const [selectedLanguage, setSelectedLanguage] = useState(i18nLanguage);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // If the language from context (i18nLanguage) changes, update the local selectedLanguage
    if (i18nLanguage !== selectedLanguage) {
      setSelectedLanguage(i18nLanguage);
      // We might also want to update globalSelectedLanguage here if context is the source of truth
      // globalSelectedLanguage = i18nLanguage;
      // For now, handleLanguageChangeForIsland is the main place globalSelectedLanguage is set.
    }
  }, [i18nLanguage, selectedLanguage]);

  const showToast = (message, duration = 2500) => { setToast(message); setTimeout(() => setToast(null), duration); };

  const handleLanguageChangeForIsland = (newLanguage) => {
    if (selectedLanguage === newLanguage) return;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
    globalSelectedLanguage = newLanguage; // Update global state

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
  const [currentInputMode, setCurrentInputMode] = useState('choice'); // 'choice', 'single', 'range'

  const localMenuConfigForDaySelector = {
    'day_selection_stage': { children: ['day_single_input', 'day_range_input', 'day_confirm_action'] },
    'day_single_input': { parent: 'day_selection_stage', isModeSelector: true },
    'day_range_input': { parent: 'day_selection_stage', isModeSelector: true },
    'day_confirm_action': { parent: 'day_selection_stage' }
  };
  const getActivePathForDaySelector = () => { /* ... see previous version, simplified ... */
    if (currentInputMode === 'single') return ['day_selection_stage', 'day_single_input'];
    if (currentInputMode === 'range') return ['day_selection_stage', 'day_range_input'];
    return ['day_selection_stage']; // choice
  };
  const isMenuItemVisibleForDaySelector = (path, itemKey) => { /* ... see previous, simplified ... */
    const currentActiveStage = path.length > 0 ? path[path.length - 1] : null;
    if (itemKey === currentActiveStage) return true; // Current stage is visible
    if (localMenuConfigForDaySelector[itemKey]?.parent === currentActiveStage) return true; // Direct children of current stage
    if (currentActiveStage === 'day_selection_stage' && (itemKey === 'day_single_input' || itemKey === 'day_range_input')) return currentInputMode === 'choice'; // Show mode buttons
    return false;
 };


  const handleDaySelectorMenuSelect = (itemKey, payload) => {
    if (itemKey === 'day_single_input') setCurrentInputMode('single');
    else if (itemKey === 'day_range_input') setCurrentInputMode('range');
    else if (itemKey === 'day_confirm_action' && payload && payload.days) {
      globalConfirmedDays = payload.days; // Update global state
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
  // This path will be simpler: e.g., ['main_practice_categories_stage'] or ['main_practice_categories_stage', 'vocabulary']
  const [currentIslandNavPath, setCurrentIslandNavPath] = useState(['main_practice_categories_stage']);

  // Use the full menu config for now, as PracticeCategoryNav and SubPracticeMenu expect it.
  // We can create a subset if this proves too complex or brings in unwanted parts.
  const localNavMenuConfig = fullMenuConfig;

  const localIsMenuItemVisible = (path, itemKey, config) => {
    // Simplified: A main category is visible if path is at 'main_practice_categories_stage'.
    // A sub-practice item is visible if its parent main category is the last element in path.
    const currentStage = path[path.length - 1];
    if (itemKey === currentStage) return true; // The stage itself
    if (config[itemKey]?.parent === 'main_practice_categories_stage' && currentStage === 'main_practice_categories_stage') return true;
    if (config[itemKey]?.parent === activeMainCatKey && currentStage === activeMainCatKey) return true;
    return false;
  };

  const localOnMenuSelect = (itemKey) => {
    const itemConfig = localNavMenuConfig[itemKey];
    if (!itemConfig) return;

    if (itemConfig.parent === 'main_practice_categories_stage') { // Clicked a main category
      setActiveMainCatKey(itemKey);
      setCurrentIslandNavPath(['main_practice_categories_stage', itemKey]);
      if (itemConfig.isExercise) { // Main category is itself an exercise (e.g., listening, practice_all)
        window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { language, days, exercise: itemKey } }));
      }
    } else if (itemConfig.parent === activeMainCatKey) { // Clicked a sub-practice item
      if (itemConfig.isExercise) {
        window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { language, days, exercise: itemKey } }));
      } else {
        // Handle deeper menus if any (not typical for current config beyond one sub-level)
        setCurrentIslandNavPath(['main_practice_categories_stage', activeMainCatKey, itemKey]);
      }
    }
  };

  const showSubMenu = activeMainCatKey && localNavMenuConfig[activeMainCatKey] && localNavMenuConfig[activeMainCatKey].children && !localNavMenuConfig[activeMainCatKey].isExercise;

  return (
    <>
      <PracticeCategoryNav
        activePath={currentIslandNavPath}
        onMenuSelect={localOnMenuSelect}
        isMenuItemVisible={localIsMenuItemVisible}
        allMenuItemsConfig={localNavMenuConfig}
        activeCategoryKey={activeMainCatKey}
      />
      {showSubMenu && (
        <SubPracticeMenu
          mainCategoryKey={activeMainCatKey}
          activeSubPracticeKey={null} // SubPracticeMenu might need its own active state if we allow deeper nav
          activePath={currentIslandNavPath}
          onMenuSelect={localOnMenuSelect}
          isMenuItemVisible={localIsMenuItemVisible}
          allMenuItemsConfig={localNavMenuConfig}
        />
      )}
    </>
  );
};
export const PracticeNavIslandWrapper = ({ language, days }) => <I18nProvider><LatinizationProvider><PracticeNavIslandApp language={language} days={days} /></LatinizationProvider></I18nProvider>;


// --- Main Mounting & Event Handling Logic ---
if (typeof window !== 'undefined' && typeof document !== 'undefined' && (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')) {
  const languageContainer = document.getElementById('language-selector-island-container');
  if (languageContainer) {
    ReactDOM.createRoot(languageContainer).render(<React.StrictMode><LanguageIslandWrapper /></React.StrictMode>);
  }

  window.addEventListener('languageIslandChange', (event) => {
    const { selectedLanguage } = event.detail;
    globalSelectedLanguage = selectedLanguage; // Store globally
    const daySelectorContainer = document.getElementById('day-selector-island-container');
    const practiceNavContainer = document.getElementById('practice-nav-island-container');
    const controlsPlaceholder = document.getElementById('freestyle-controls-placeholder-text');

    if (daySelectorContainer && selectedLanguage) {
      daySelectorContainer.style.display = 'block';
      if (controlsPlaceholder) controlsPlaceholder.style.display = 'none';
      if (!daySelectorContainer._reactRoot) daySelectorContainer._reactRoot = ReactDOM.createRoot(daySelectorContainer);
      daySelectorContainer._reactRoot.render(<React.StrictMode><DaySelectorIslandWrapper language={selectedLanguage} /></React.StrictMode>);
    } else {
      if (daySelectorContainer) daySelectorContainer.style.display = 'none';
      if (practiceNavContainer) practiceNavContainer.style.display = 'none'; // Hide nav if lang deselected
      if (controlsPlaceholder) controlsPlaceholder.style.display = 'block';
      if (daySelectorContainer?._reactRoot) { daySelectorContainer._reactRoot.unmount(); daySelectorContainer._reactRoot = null; }
      if (practiceNavContainer?._reactRoot) { practiceNavContainer._reactRoot.unmount(); practiceNavContainer._reactRoot = null; }
    }
  });

  window.addEventListener('dayIslandConfirm', (event) => {
    const { confirmedDays } = event.detail;
    globalConfirmedDays = confirmedDays; // Store globally
    const practiceNavContainer = document.getElementById('practice-nav-island-container');
    const daySelectorContainer = document.getElementById('day-selector-island-container');

    if (practiceNavContainer && globalSelectedLanguage && confirmedDays.length > 0) {
      if (daySelectorContainer) daySelectorContainer.style.border = '2px solid green'; // Visual feedback
      practiceNavContainer.style.display = 'block';
      if (!practiceNavContainer._reactRoot) practiceNavContainer._reactRoot = ReactDOM.createRoot(practiceNavContainer);
      practiceNavContainer._reactRoot.render(<React.StrictMode><PracticeNavIslandWrapper language={globalSelectedLanguage} days={confirmedDays} /></React.StrictMode>);
    } else {
      if (practiceNavContainer) practiceNavContainer.style.display = 'none';
    }
    // Update placeholder text or clear it
    const controlsContainer = document.getElementById('freestyle-controls-container');
    const nextStepMsg = controlsContainer?.querySelector('#next-step-msg');
    if(nextStepMsg) nextStepMsg.remove();
  });

  window.addEventListener('exerciseSelected', (event) => {
    const { language, days, exercise } = event.detail;
    console.log('FreestyleIslandsEntry: Exercise selected:', { language, days, exercise });
    const exerciseHostContainer = document.getElementById('exercise-host-container');
    if (exerciseHostContainer) {
      exerciseHostContainer.innerHTML = `<p>Exercise <strong>${exercise}</strong> selected for language <strong>${language}</strong>, days <strong>${days.join(', ')}</strong>. Mount ExerciseHost here.</p>`;
      // TODO: Mount the actual ExerciseHost component here
    }
  });
}
