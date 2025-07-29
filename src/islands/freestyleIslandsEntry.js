// Import necessary libraries and components.
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { LatinizationProvider } from '../contexts/LatinizationContext';
import CosyLanguageSelector from '../components/LanguageSelector/CosyLanguageSelector';
import ToggleLatinizationButton from '../components/Common/ToggleLatinizationButton';
import DaySelectorFreestyle from '../components/Freestyle/DaySelectorFreestyle';
import PracticeCategoryNav from '../components/Freestyle/PracticeCategoryNav';
import SubPracticeMenu from '../components/Freestyle/SubPracticeMenu';
import ExerciseHost from '../components/Freestyle/ExerciseHost';
import HelpPopupIsland from '../components/Freestyle/HelpPopupIsland';
import { allMenuItemsConfig as fullMenuConfig } from '../utils/menuNavigationLogic';
import '../index.css';
import '../components/Freestyle/DaySelectorFreestyle.css';
import '../components/Freestyle/PracticeCategoryNav.css';
import '../freestyle-shared.css';

// A simple global state for the freestyle islands.
let globalSelectedLanguage = null;
let exerciseInstanceKey = 0;

/**
 * The Language Island component.
 * This component allows the user to select a language.
 */
export const LanguageIslandApp = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const navigateToStudyMode = () => {
    navigate('/study');
  };

  return (
    <>
      <div className="menu-section selector-container">
        <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">
          {t('chooseLanguageLabel', '🌎 Choose Your Language:')}
        </label>
        <CosyLanguageSelector />
        <ToggleLatinizationButton />
        <button onClick={navigateToStudyMode} className="study-mode-switch-btn">
          {t('switchToStudyMode', 'Study Mode')}
        </button>
      </div>
    </>
  );
};
export const LanguageIslandWrapper = () => <BrowserRouter><I18nProvider><LatinizationProvider><LanguageIslandApp /></LatinizationProvider></I18nProvider></BrowserRouter>;

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

/**
 * The Practice Navigation Island component.
 * This component allows the user to navigate through the practice categories and sub-practices.
 */
export const PracticeNavIslandApp = ({ language, days }) => {
  const { t } = useI18n();
  const [navPath, setNavPath] = useState(['main_practice_categories_stage']);
  const localNavMenuConfig = fullMenuConfig;

  const activeStage = navPath[navPath.length - 1];

  const localIsMenuItemVisible = (path, itemKey, config) => {
    const currentActiveStage = path[path.length - 1];
    if (itemKey === currentActiveStage) return true;
    if (config[itemKey]?.parent === currentActiveStage) return true;
    return false;
  };

  const localOnMenuSelect = (itemKey) => {
    const itemConfig = localNavMenuConfig[itemKey];
    if (!itemConfig) return;

    const newPath = [...navPath, itemKey];
    setNavPath(newPath);

    if (itemConfig.isExercise) {
      exerciseInstanceKey++;
      window.dispatchEvent(new CustomEvent('exerciseSelected', { detail: { language, days, exercise: itemKey, key: exerciseInstanceKey } }));
    }
  };

  const goBack = () => {
    if (navPath.length > 1) {
      const newPath = navPath.slice(0, navPath.length - 1);
      setNavPath(newPath);
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
          activeCategoryKey={null}
        />
      )}
      {showSubMenu && (
        <SubPracticeMenu
          mainCategoryKey={activeStage}
          activeSubPracticeKey={null}
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

/**
 * The Exercise Host Island component.
 * This component hosts the exercises.
 */
export const ExerciseHostIslandApp = ({ language, days, subPracticeType, exerciseKey }) => {
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

/**
 * The Help Popup Island component.
 * This component displays a help popup.
 */
export const HelpPopupIslandWrapper = () => <BrowserRouter><I18nProvider><LatinizationProvider><HelpPopupIsland /></LatinizationProvider></I18nProvider></BrowserRouter>;

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
    } else {
      if (daySelectorContainer) { daySelectorContainer.style.display = 'none'; if(daySelectorContainer._reactRoot) {daySelectorContainer._reactRoot.unmount(); daySelectorContainer._reactRoot = null;}}
      if (practiceNavContainer) { practiceNavContainer.style.display = 'none'; if(practiceNavContainer._reactRoot) {practiceNavContainer._reactRoot.unmount(); practiceNavContainer._reactRoot = null;}}
      if (exerciseHostContainer && exerciseHostContainer._reactRoot) { exerciseHostContainer._reactRoot.unmount(); exerciseHostContainer._reactRoot = null; exerciseHostContainer.innerHTML = '<p>Exercise Area</p>';}
      if (controlsPlaceholder) controlsPlaceholder.style.display = 'block';
    }
  });

  window.addEventListener('dayIslandConfirm', (event) => {
    const { confirmedDays } = event.detail;
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
    if (exerciseHostContainer && exerciseHostContainer._reactRoot) { exerciseHostContainer._reactRoot.unmount(); exerciseHostContainer._reactRoot = null; exerciseHostContainer.innerHTML = '<p>Exercise Area</p>';}
  });

  window.addEventListener('exerciseSelected', (event) => {
    const { language, days, exercise, key: exerciseKeyFromEvent } = event.detail;
    console.log('FreestyleIslandsEntry: Exercise selected:', { language, days, exercise, key: exerciseKeyFromEvent });
    const exerciseHostContainer = document.getElementById('exercise-host-container');
    if (exerciseHostContainer) {
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
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFreestyleIslands);
  } else {
    mountFreestyleIslands();
  }
}
