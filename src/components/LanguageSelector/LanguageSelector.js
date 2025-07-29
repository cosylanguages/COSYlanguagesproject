// Import necessary libraries and components.
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import CosyLanguageSelector from './CosyLanguageSelector';

/**
 * A component that provides a language selector.
 * It is a wrapper around the CosyLanguageSelector component.
 * @returns {JSX.Element} The LanguageSelector component.
 */
const LanguageSelector = () => {
  const { language, changeLanguage } = useI18n();

  // Render the CosyLanguageSelector with the current language and a callback to change it.
  return (
    <CosyLanguageSelector
      selectedLanguage={language}
      onLanguageChange={changeLanguage}
    />
  );
};

export default LanguageSelector;
