import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Contexts & Providers
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { LatinizationProvider } from '../contexts/LatinizationContext';

// Island Components
import LanguageSelectorFreestyle from '../components/Freestyle/LanguageSelectorFreestyle';
import ToggleLatinizationButton from '../components/Common/ToggleLatinizationButton';
import DaySelectorFreestyle from '../components/Freestyle/DaySelectorFreestyle';

// Styles
import '../components/LanguageSelector/LanguageSelector.css';
import '../components/Freestyle/DaySelectorFreestyle.css';
import '../pages/FreestyleModePage/FreestyleModePage.css';

// --- Language Island Component (Exportable) ---
export const LanguageIslandApp = () => {
  const { language: i18nLanguage, changeLanguage, t } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState(i18nLanguage);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (i18nLanguage !== selectedLanguage) {
      setSelectedLanguage(i18nLanguage);
    }
  }, [i18nLanguage, selectedLanguage]);

  const showToast = (message, duration = 2500) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  };

  const handleLanguageChangeForIsland = (newLanguage) => {
    if (selectedLanguage === newLanguage) return;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);

    const languageName = t(`language.${newLanguage}`, newLanguage.replace('COSY', ''));
    const toastMsg = t('freestyle.languageChangedToast', `Language changed: ${languageName}`, { languageName });
    showToast(toastMsg);

    const event = new CustomEvent('languageIslandChange', { detail: { selectedLanguage: newLanguage } });
    window.dispatchEvent(event);
  };

  return (
    <>
      <div className="menu-section selector-container">
        <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">
          {t('chooseLanguageLabel', '🌎 Choose Your Language:')}
        </label>
        <LanguageSelectorFreestyle
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChangeForIsland}
        />
        <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
      </div>
      {toast && <div className="cosy-toast">{toast}</div>}
    </>
  );
};

// Wrapper for LanguageIslandApp with necessary providers (Exportable for testing)
export const LanguageIslandWrapper = () => (
  <I18nProvider>
    <LatinizationProvider>
      <LanguageIslandApp />
    </LatinizationProvider>
  </I18nProvider>
);

// --- Day Selector Island Component (Exportable) ---
export const DaySelectorIslandApp = ({ language }) => {
  const { t } = useI18n();
  const [currentDays, setCurrentDays] = useState([]);
  const [currentInputMode, setCurrentInputMode] = useState('choice');

  const mockMenuItemsConfig = {
    'day_selection_stage': { children: ['day_single_input', 'day_range_input', 'day_confirm_action'] },
    'day_single_input': { parent: 'day_selection_stage' },
    'day_range_input': { parent: 'day_selection_stage' },
    'day_confirm_action': { parent: 'day_selection_stage' }
  };

  const getActivePathForDaySelector = () => {
    if (currentInputMode === 'single') return ['day_selection_stage', 'day_single_input'];
    if (currentInputMode === 'range') return ['day_selection_stage', 'day_range_input'];
    return ['day_selection_stage'];
  };

  const isMenuItemVisibleForDaySelector = (path, itemKey, config) => {
    if (itemKey === 'day_single_input') return currentInputMode === 'single';
    if (itemKey === 'day_range_input') return currentInputMode === 'range';
    if (itemKey === 'day_selection_stage') return true;
    return false;
  };

  const handleDaySelectorMenuSelect = (itemKey, payload) => {
    if (itemKey === 'day_single_input') {
      setCurrentInputMode('single');
      setCurrentDays([]);
    } else if (itemKey === 'day_range_input') {
      setCurrentInputMode('range');
      setCurrentDays([]);
    } else if (itemKey === 'day_confirm_action' && payload && payload.days) {
      const event = new CustomEvent('dayIslandConfirm', { detail: { confirmedDays: payload.days } });
      window.dispatchEvent(event);
    }
  };

  const handleDaysChangeInIsland = (newDays) => {
    setCurrentDays(newDays);
  };

  return (
    <DaySelectorFreestyle
      currentDays={currentDays}
      onDaysChange={handleDaysChangeInIsland}
      language={language}
      activePath={getActivePathForDaySelector()}
      onMenuSelect={handleDaySelectorMenuSelect}
      isMenuItemVisible={isMenuItemVisibleForDaySelector}
      allMenuItemsConfig={mockMenuItemsConfig}
    />
  );
};

// Wrapper for DaySelectorIslandApp with necessary providers (Exportable for testing)
export const DaySelectorIslandWrapper = ({ language }) => (
  <I18nProvider>
    <LatinizationProvider>
      <DaySelectorIslandApp language={language} />
    </LatinizationProvider>
  </I18nProvider>
);


// --- Main Mounting Logic (runs only in browser-like environments) ---
// This guard should prevent this block from running in Jest
if (typeof window !== 'undefined' && typeof document !== 'undefined' && (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')) {
  const languageContainer = document.getElementById('language-selector-island-container');
  if (languageContainer) {
    const languageRoot = ReactDOM.createRoot(languageContainer);
    languageRoot.render(
      <React.StrictMode>
        <LanguageIslandWrapper />
      </React.StrictMode>
    );
  }
  // Removed the console.warn for missing languageContainer at initial load,
  // as it's not critical if the page isn't freestyle.html

  window.addEventListener('languageIslandChange', (event) => {
    const { selectedLanguage } = event.detail;
    const daySelectorContainer = document.getElementById('day-selector-island-container');
    const controlsPlaceholder = document.getElementById('freestyle-controls-placeholder-text');

    if (daySelectorContainer && selectedLanguage) {
      daySelectorContainer.style.display = 'block';
      if(controlsPlaceholder) controlsPlaceholder.style.display = 'none';

      // Manage React root instance for daySelectorContainer
      if (!daySelectorContainer._reactRoot) {
        daySelectorContainer._reactRoot = ReactDOM.createRoot(daySelectorContainer);
      }
      daySelectorContainer._reactRoot.render(
        <React.StrictMode>
          <DaySelectorIslandWrapper language={selectedLanguage} />
        </React.StrictMode>
      );
    } else {
      if(controlsPlaceholder && daySelectorContainer) {
          daySelectorContainer.style.display = 'none';
          controlsPlaceholder.style.display = 'block';
      }
      if (daySelectorContainer && daySelectorContainer._reactRoot) {
        // If language is deselected or invalid, unmount the component
        daySelectorContainer._reactRoot.unmount();
        daySelectorContainer._reactRoot = null; // Clear the stored root
      }
    }
  });

  window.addEventListener('dayIslandConfirm', (event) => {
      const { confirmedDays } = event.detail;
      console.log('FreestyleIslandsEntry: Days confirmed:', confirmedDays);
      const controlsContainer = document.getElementById('freestyle-controls-container');
      if (controlsContainer) {
          const nextStepPlaceholder = document.createElement('p');
          nextStepPlaceholder.textContent = `Days ${confirmedDays.join(', ')} confirmed. Next: Load Categories.`;
          const daySelectorContainer = document.getElementById('day-selector-island-container');
          if (daySelectorContainer) daySelectorContainer.style.border = '2px solid green';

          const existingMsg = controlsContainer.querySelector('#next-step-msg');
          if(existingMsg) existingMsg.remove();
          nextStepPlaceholder.id = 'next-step-msg';
          controlsContainer.appendChild(nextStepPlaceholder);
      }
  });
}
