import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useFreestyle } from '../../contexts/FreestyleContext';
import CosyLanguageSelector from '../LanguageSelector/CosyLanguageSelector';

const LanguageSelectorFreestyle = () => {
  const { language, changeLanguage } = useI18n();
  const { setSelectedLanguage } = useFreestyle();

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setSelectedLanguage(newLanguage);
  };

  return (
    <CosyLanguageSelector
      selectedLanguage={language}
      onLanguageChange={handleLanguageChange}
    />
  );
};

export default LanguageSelectorFreestyle;
