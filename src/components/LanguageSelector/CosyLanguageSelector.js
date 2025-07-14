import React from 'react';
import Select from 'react-select';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './CosyLanguageSelector.css';

const CosyLanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const { allTranslations, t } = useI18n();

  const popularLanguageOrder = [
    'english',
    'spanish',
    'french',
    'portuguese',
    'russian',
    'german',
    'italian',
  ];

  const availableLanguages = Object.keys(allTranslations)
    .map((langKey) => {
      if (langKey === 'null' || !allTranslations[langKey]) return null;

      const langData = allTranslations[langKey];
      const cosyName = langData?.cosyName;
      const logo = langData?.logo;
      let name;

      if (cosyName) {
        name = cosyName;
      } else {
        name = langKey.charAt(0).toUpperCase() + langKey.slice(1);
      }
      return {
        value: langKey,
        label: name,
        cosyName: cosyName || name,
        logo: logo,
        nativeName: langData?.languageNameNative,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const indexA = popularLanguageOrder.indexOf(a.value);
      const indexB = popularLanguageOrder.indexOf(b.value);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) {
        return -1;
      }
      if (indexB !== -1) {
        return 1;
      }
      return (a.nativeName || a.label).localeCompare(b.nativeName || b.label);
    });

  const handleChange = (selectedOption) => {
    onLanguageChange(selectedOption ? selectedOption.value : null);
  };

  const formatOptionLabel = ({ logo, label }) => (
    <div className="cosy-language-option">
      <img src={logo} alt={`${label} logo`} className="language-logo" />
      <TransliterableText text={label} />
    </div>
  );

  const selectedValue = availableLanguages.find(
    (option) => option.value === selectedLanguage
  );

  return (
    <div className="language-selector-container">
      <label htmlFor="language-select" className="language-select-label">
        <TransliterableText text={t('languageSelector.label', '🌎:')} />
      </label>
      <Select
        id="language-select"
        value={selectedValue}
        onChange={handleChange}
        options={availableLanguages}
        formatOptionLabel={formatOptionLabel}
        className="cosy-language-select"
        classNamePrefix="cosy-language-select"
        aria-label={t('languageSelector.ariaLabel', 'Select language')}
        placeholder={t('languageSelector.selectPlaceholder', '-- Select Language --')}
        isClearable
      />
    </div>
  );
};

export default CosyLanguageSelector;
