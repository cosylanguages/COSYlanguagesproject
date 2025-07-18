import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';

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
import HelpPopupIsland from '../components/Freestyle/HelpPopupIsland'; // Import HelpPopupIsland

// Config
import { allMenuItemsConfig as fullMenuConfig } from '../utils/menuNavigationLogic';

// Styles
import '../index.css'; // Import global styles
import '../components/LanguageSelector/LanguageSelector.css';
import '../components/Freestyle/DaySelectorFreestyle.css';
import '../components/Freestyle/PracticeCategoryNav.css';
import '../freestyle-shared.css';

// --- Global state for islands (simple version) ---
let globalSelectedLanguage = null;
// let globalConfirmedDays = []; // Removed as it's unused; days are passed via events/props
let exerciseInstanceKey = 0; // For unique key for ExerciseHost

// --- Language Island ---

/**
 * The Language Island component.
 * This component allows the user to select a language.
 */
export const LanguageIslandApp = () => {
  const { language: i18nLanguage, changeLanguage, t } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState(i18nLanguage);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (i18nLanguage !== selectedLanguage) {
      setSelectedLanguage(i18nLanguage);
    }
  }, [i18nLanguage, selectedLanguage]);

  const showToast = (message, duration = 2500) => { setToast(message); setTimeout(() => setToast(null), duration); };

  const navigateToStudyMode = () => {
    navigate('/study');
  };

  const handleLanguageChangeForIsland = (newLanguage) => {
    // Prevent processing if the new language is null, undefined, or empty, or same as current
    if (!newLanguage || selectedLanguage === newLanguage) {
      // If newLanguage is null/empty and it's different from selectedLanguage (which might be valid),
      // it implies the selector was cleared. We might want to reset things or do nothing.
      // For now, just preventing call to changeLanguage(null).
      // If newLanguage is truly undefined or null from a dropdown, it means "no selection".
      // We should ensure LanguageSelectorFreestyle provides a valid key or an empty string.
      // If it's an empty string, I18nContext's changeLanguage will handle it by reverting.
      // The main goal here is to prevent explicitly calling changeLanguage(null).
      if (newLanguage === null || newLanguage === undefined) {
        console.warn('[LanguageIslandApp] Attempted to set language to null/undefined. Ignoring.');
        return;
      }
      if (selectedLanguage === newLanguage) return; // No actual change
    }

    // At this point, newLanguage should be a non-null, non-empty string if it passed the first check.
    // I18nContext.changeLanguage will validate if it's a known key.
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage); // This will internally default to COSYenglish if newLanguage is invalid

    // Update globalSelectedLanguage and dispatch event only if newLanguage is valid (or becomes valid after context defaults)
    // We need to get the actual language set by I18nContext if it defaulted.
    // However, i18nLanguage in this component's scope won't update until the next render cycle after context changes.
    // For simplicity, we'll dispatch with newLanguage. If it's invalid, subsequent islands might not find translations
    // but I18nContext should ensure they get *some* default.
    // A more robust way would be to listen to an event from I18nContext itself, or pass the defaulted language back.

    // For now, assume newLanguage (if not null) is what we proceed with.
    // The I18nContext's own defaulting mechanism handles invalid keys passed to its changeLanguage.
    globalSelectedLanguage = newLanguage;

    // The t() function will use the current language from context for the toast.
    // If newLanguage was invalid and context defaulted, this toast might be slightly off until next render.
    const languageName = t(`language.${newLanguage}`, String(newLanguage).replace('COSY', ''));
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
+        <button onClick={navigateToStudyMode} className="study-mode-switch-btn">
+          {t('switchToStudyMode', 'Study Mode')}
+        </button>
      </div>
      {toast && <div className="cosy-toast">{toast}</div>}
    </>
  );
};
export const LanguageIslandWrapper = () => <BrowserRouter><I18nProvider><LatinizationProvider><LanguageIslandApp /></LatinizationProvider></I18nProvider></BrowserRouter>;

// --- Day Selector Island ---

/**
 * The Day Selector Island component.
 * This component allows the user to select a day.
 */
export const DaySelectorIslandApp = ({ language, onConfirm }) => {
  const [currentDays, setCurrentDays] = useState([]);

  const handleDaysChangeInIsland = (newDays) => setCurrentDays(newDays);

  return <DaySelectorFreestyle currentDays={currentDays} onDaysChange={handleDaysChangeInIsland} language={language} onConfirm={onConfirm} />;
};
export const DaySelectorIslandWrapper = ({ language, onConfirm }) => <BrowserRouter><I18nProvider><LatinizationProvider><DaySelectorIslandApp language={language} onConfirm={onConfirm} /></LatinizationProvider></I18nProvider></BrowserRouter>;


// --- Practice Navigation Island ---

/**
 * The Practice Navigation Island component.
 * This component allows the user to navigate through the practice categories and sub-practices.
 */
export const PracticeNavIslandApp = ({ language, days }) => {
  const { t } = useI18n();
  const [navPath, setNavPath] = useState(['main_practice_categories_stage']);
  const localNavMenuConfig = fullMenuConfig;

  const activeStage = navPath[navPath.length - 1];
  // const activeMainCatKey = navPath.includes('vocabulary') ? 'vocabulary' : navPath.includes('grammar') ? 'grammar' : navPath.includes('reading') ? 'reading' : navPath.includes('speaking') ? 'speaking' : navPath.includes('writing') ? 'writing' : null; // This is no longer needed for visibility logic

  const localIsMenuItemVisible = (path, itemKey, config) => {
    const currentActiveStage = path[path.length - 1];
    if (itemKey === currentActiveStage) return true; // The stage itself is "visible" as the active container
    if (config[itemKey]?.parent === currentActiveStage) return true; // Children of the active stage are visible
    return false;
  };

  const localOnMenuSelect = (itemKey) => {
    const itemConfig = localNavMenuConfig[itemKey];
    if (!itemConfig) return;

    // Navigate deeper into the menu
    const newPath = [...navPath, itemKey];
    setNavPath(newPath);

    if (itemConfig.isExercise) {
      exerciseInstanceKey++; // Increment key for remount
      window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { language, days, exercise: itemKey, key: exerciseInstanceKey } }));
    }
  };

  const goBack = () => {
    if (navPath.length > 1) {
      const newPath = navPath.slice(0, navPath.length - 1);
      setNavPath(newPath);
      // If we go back, we should clear the exercise
      window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { exercise: null } }));
    }
  };

  const showMainMenu = activeStage === 'main_practice_categories_stage';
  const showSubMenu = localNavMenuConfig[activeStage]?.parent === 'main_practice_categories_stage' && !localNavMenuConfig[activeStage]?.isExercise;
  const showBackButton = navPath.length > 1;

  return (
    <div className="practice-nav-island-content">
      {showBackButton && (
        <button onClick={goBack} className="go-back-button">
          &larr; {t('controls.goBack', 'Go Back')}
        </button>
      )}
      {showMainMenu && (
        <PracticeCategoryNav
          activePath={navPath}
          onMenuSelect={localOnMenuSelect}
          isMenuItemVisible={localIsMenuItemVisible}
          allMenuItemsConfig={localNavMenuConfig}
          activeCategoryKey={null} // activeCategoryKey is now implicitly handled by navPath
        />
      )}
      {showSubMenu && (
        <SubPracticeMenu
          mainCategoryKey={activeStage}
          activeSubPracticeKey={null} // activeSubPracticeKey can be derived from navPath if needed
          activePath={navPath}
          onMenuSelect={localOnMenuSelect}
          isMenuItemVisible={localIsMenuItemVisible}
          allMenuItemsConfig={localNavMenuConfig}
        />
      )}
    </div>
  );
};
export const PracticeNavIslandWrapper = ({ language, days }) => <BrowserRouter><I18nProvider><LatinizationProvider><PracticeNavIslandApp language={language} days={days} /></LatinizationProvider></I18nProvider></BrowserRouter>;

// --- Exercise Host Island ---

/**
 * The Exercise Host Island component.
 * This component hosts the exercises.
 */
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
export const ExerciseHostIslandWrapper = ({ language, days, subPracticeType, exerciseKey }) => <BrowserRouter><I18nProvider><LatinizationProvider><ExerciseHostIslandApp language={language} days={days} subPracticeType={subPracticeType} exerciseKey={exerciseKey} /></LatinizationProvider></I18nProvider></BrowserRouter>;


// --- Help Popup Island Wrapper (if needed, or mount directly) ---

/**
 * The Help Popup Island component.
 * This component displays a help popup.
 */
// For consistency and providing contexts if they were needed (though HelpPopupIsland is simple)
export const HelpPopupIslandWrapper = () => <BrowserRouter><I18nProvider><LatinizationProvider><HelpPopupIsland /></LatinizationProvider></I18nProvider></BrowserRouter>;

// --- Main Mounting & Event Handling Logic ---

/**
 * Mounts the freestyle islands.
 */
function mountFreestyleIslands() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')) {
    const languageContainer = document.getElementById('language-selector-island-container');
    const daySelectorContainer = document.getElementById('day-selector-island-container');
    const practiceNavContainer = document.getElementById('practice-nav-island-container');
    const exerciseHostContainer = document.getElementById('exercise-host-container');
    const helpPopupContainer = document.getElementById('help-popup-island-container');

    if (!languageContainer || !daySelectorContainer || !practiceNavContainer || !exerciseHostContainer || !helpPopupContainer) {
      return;
    }

    if (languageContainer) {
      ReactDOM.createRoot(languageContainer).render(<React.StrictMode><LanguageIslandWrapper /></React.StrictMode>);
    }

    if (helpPopupContainer) {
      ReactDOM.createRoot(helpPopupContainer).render(<React.StrictMode><HelpPopupIslandWrapper /></React.StrictMode>);
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
      // globalConfirmedDays = []; // No longer needed
    }
  });

  window.addEventListener('dayIslandConfirm', (event) => {
    const { confirmedDays } = event.detail;
    // globalConfirmedDays = confirmedDays; // No longer needed, passed directly where required
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
  } // end of main if block
} // end of mountFreestyleIslands function

// Wait for the DOM to be fully loaded before trying to mount the islands
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') { // Document is still loading
    document.addEventListener('DOMContentLoaded', mountFreestyleIslands);
  } else { // Document has already loaded
    mountFreestyleIslands();
  }
}
