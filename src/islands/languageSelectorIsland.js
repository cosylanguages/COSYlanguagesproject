import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// Assuming paths to actual components and contexts
import LanguageSelectorFreestyle from '../components/Freestyle/LanguageSelectorFreestyle';
import ToggleLatinizationButton from '../components/Common/ToggleLatinizationButton';
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { LatinizationProvider, useLatinization } from '../contexts/LatinizationContext';

// Styles that might be needed globally or for the island itself
// These would typically be handled by the main app's CSS imports or a specific CSS file for the island
import '../components/LanguageSelector/LanguageSelector.css';
import '../pages/FreestyleModePage/FreestyleModePage.css'; // For .selector-container if used, and .cosy-toast
// It's generally better to have island-specific CSS or ensure global styles apply correctly.

const LanguageIslandApp = () => {
  // Pulling parts of logic from FreestyleModePage.js related to language selection
  const { language: i18nLanguage, changeLanguage, t } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState(i18nLanguage);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Sync with external changes to i18nLanguage if any (e.g. from other parts of a larger app)
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
    changeLanguage(newLanguage); // This updates the I18nContext

    const languageName = t(`language.${newLanguage}`, newLanguage.replace('COSY', ''));
    const toastMsg = t('freestyle.languageChangedToast', `Language changed: ${languageName}`, { languageName });
    showToast(toastMsg);

    // Announce the language change to the outside world (e.g., for other islands)
    const event = new CustomEvent('languageIslandChange', { detail: { selectedLanguage: newLanguage } });
    window.dispatchEvent(event);
    console.log(`LanguageIsland: Dispatched languageIslandChange event for ${newLanguage}`);
  };

  // The actual ToggleLatinizationButton will use useLatinization context internally
  // No specific props needed for it here other than what it pulls from context.

  return (
    <>
      <div className="menu-section selector-container"> {/* Mimicking structure from FreestyleInterfaceView for styling */}
        <label htmlFor="freestyle-language-select" data-transliterable id="study-choose-language-label">
          {t('chooseLanguageLabel', '🌎 Choose Your Language:')}
        </label>
        <LanguageSelectorFreestyle
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChangeForIsland}
        />
        <ToggleLatinizationButton
          currentDisplayLanguage={selectedLanguage}
        />
      </div>
      {toast && <div className="cosy-toast">{toast}</div>}
    </>
  );
};

const AppWrapper = () => {
  return (
    <I18nProvider>
      <LatinizationProvider>
        <LanguageIslandApp />
      </LatinizationProvider>
    </I18nProvider>
  );
};

const container = document.getElementById('language-selector-island-container');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
} else {
  console.error('Language selector island container not found in freestyle.html');
}
