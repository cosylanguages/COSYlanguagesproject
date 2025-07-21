import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import CosyLanguageSelector from './CosyLanguageSelector';

const LanguageSelector = () => {
  const { language, changeLanguage } = useI18n();

  return (
    <CosyLanguageSelector
      selectedLanguage={language}
      onLanguageChange={changeLanguage}
    />
  );
};

export default LanguageSelector;
