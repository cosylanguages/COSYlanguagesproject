import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import CosyLanguageSelector from '../LanguageSelector/CosyLanguageSelector';

const LanguageSelectorFreestyle = ({ onLanguageChange }) => {
  const { language, changeLanguage } = useI18n();

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <CosyLanguageSelector
      selectedLanguage={language}
      onLanguageChange={handleLanguageChange}
    />
  );
};

export default LanguageSelectorFreestyle;
