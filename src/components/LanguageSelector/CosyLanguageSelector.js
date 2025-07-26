// Import necessary libraries and components.
import React, { useEffect } from 'react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './CosyLanguageSelector.css';

// A map of language keys to their corresponding logo images.
const logos = {
  COSYarmenian: '/assets/icons/cosylanguages_logos/cosyarmenian.png',
  COSYbashkir: '/assets/icons/cosylanguages_logos/cosybachkir.png',
  COSYbreton: '/assets/icons/cosylanguages_logos/cosybreton.png',
  COSYenglish: '/assets/icons/cosylanguages_logos/cosyenglish.png',
  COSYfrench: '/assets/icons/cosylanguages_logos/cosyfrench.png',
  COSYgeorgian: '/assets/icons/cosylanguages_logos/cosygeorgian.png',
  COSYgerman: '/assets/icons/cosylanguages_logos/cosygerman.png',
  COSYgreek: '/assets/icons/cosylanguages_logos/cosygreek.png',
  COSYitalian: '/assets/icons/cosylanguages_logos/cosyitalian.png',
  COSYportuguese: '/assets/icons/cosylanguages_logos/cosyportuguese.png',
  COSYrussian: '/assets/icons/cosylanguages_logos/cosyrussian.png',
  COSYspanish: '/assets/icons/cosylanguages_logos/cosyspanish.png',
  COSYtatar: '/assets/icons/cosylanguages_logos/cosytatar.png',
};

// Map des drapeaux pour chaque langue (ajouter selon les fichiers disponibles)
const flags = {
  COSYbashkir: '/assets/flags/Flag_of_Bashkortostan.png',
  COSYbreton: '/assets/flags/Flag_of_Brittany.png',
  COSYtatar: '/assets/flags/Flag_of_Tatarstan.png',
};

/**
 * A customized language selector component.
 * It uses react-select to provide a searchable dropdown with language logos.
 * @param {object} props - The component's props.
 * @param {string} props.selectedLanguage - The currently selected language.
 * @param {function} props.onLanguageChange - A callback function to handle language changes.
 * @returns {JSX.Element} The CosyLanguageSelector component.
 */
const CosyLanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const { allTranslations, t, currentLangKey } = useI18n();
  const location = useLocation();

  // Effect to synchronize the URL with the language state.
  useEffect(() => {
    const pathLang = location.pathname.split('/')[2];
    if (location.pathname.startsWith('/study/') && pathLang && pathLang !== currentLangKey) {
      // This is a failsafe for scenarios where the URL isn't the trigger for a language change.
    }
  }, [currentLangKey, location.pathname]);

  // Effect to update the body class based on the selected language.
  useEffect(() => {
    const body = document.body;
    const currentLanguageKeys = Object.keys(allTranslations || {});
    const classesToRemove = Array.from(body.classList).filter(cls =>
        cls.endsWith('-bg') ||
        cls === 'lang-bg' ||
        cls === 'lang-bg-fallback' ||
        currentLanguageKeys.some(key => cls.startsWith(key + '-bg')) ||
        cls.startsWith('COSY') ||
        cls.startsWith('ТАКОЙ') ||
        cls.startsWith('ΚΟΖΥ') ||
        cls.startsWith('ԾՈՍՅ') ||
        cls === 'no-language-selected-bg'
    );
    classesToRemove.forEach(cls => body.classList.remove(cls));

    if (currentLangKey && currentLangKey !== "null") {
        const langClassName = `${currentLangKey}-bg`;
        body.classList.add(langClassName);
        body.classList.add('lang-bg');
    } else {
        body.classList.add('no-language-selected-bg');
    }
  }, [currentLangKey, allTranslations]);

  // Get the list of available languages from the translations data.
  const availableLanguages = Object.keys(allTranslations)
    .map((langKey) => {
      if (langKey === 'null' || !allTranslations[langKey]) return null;

      const langData = allTranslations[langKey];
      const cosyName = langData?.cosyName;
      const logoKey = langKey;
      const logo = logos[logoKey];
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
    .sort((a, b) => a.label.localeCompare(b.label));

  /**
   * Handles the change of the selected language.
   * @param {object} selectedOption - The selected option from the dropdown.
   */
  const handleChange = (selectedOption) => {
    onLanguageChange(selectedOption ? selectedOption.value : null);
  };

  /**
   * Formats the label for each option in the dropdown.
   * @param {object} option - The option to format.
   * @returns {JSX.Element} The formatted option label.
   */
  const formatOptionLabel = ({ logo, label, value }) => (
    <div className="cosy-language-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src={logo} alt={`${label} logo`} className="language-logo" />
      {flags[value] && (
        <img src={flags[value]} alt={`${label} flag`} className="language-flag" style={{ width: '28px', height: '28px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} />
      )}
      <TransliterableText text={label} />
    </div>
  );

  // Find the selected language option.
  const selectedValue = availableLanguages.find(
    (option) => option.value === selectedLanguage
  );

  // Render the language selector.
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
