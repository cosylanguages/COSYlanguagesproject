// Import necessary libraries and components.
import React, { useEffect } from 'react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './CosyLanguageSelector.css';

// A map of language keys to their corresponding logo images.
const logos = {
  armenian: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyarmenian.png',
  bashkir: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosybachkir.png',
  breton: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosybreton.png',
  english: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyenglish.png',
  french: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyfrench.png',
  georgian: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosygeorgian.png',
  german: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosygerman.png',
  greek: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosygreek.png',
  italian: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyitalian.png',
  portuguese: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyportuguese.png',
  russian: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyrussian.png',
  spanish: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosyspanish.png',
  tatar: '/COSYlanguagesproject/assets/icons/cosylanguages_logos/cosytatar.png',
};

// Map des drapeaux pour chaque langue (ajouter selon les fichiers disponibles)
const flags = {
  bashkir: '/COSYlanguagesproject/assets/flags/Flag_of_Bashkortostan.png',
  breton: '/COSYlanguagesproject/assets/flags/Flag_of_Brittany.png',
  tatar: '/COSYlanguagesproject/assets/flags/Flag_of_Tatarstan.png',
  armenian: '/COSYlanguagesproject/assets/flags/Flag_of_Armenia.png',
  georgian: '/COSYlanguagesproject/assets/flags/Flag_of_Georgia.png',
  greek: '/COSYlanguagesproject/assets/flags/Flag_of_Greece.png',
  italian: '/COSYlanguagesproject/assets/flags/Flag_of_Italy.png',
  russian: '/COSYlanguagesproject/assets/flags/Flag_of_Russia.png',
  spanish: '/COSYlanguagesproject/assets/flags/Flag_of_Spain.png',
  french: '/COSYlanguagesproject/assets/flags/Flag_of_France.png',
  german: '/COSYlanguagesproject/assets/flags/Flag_of_Germany.png',
  portuguese: '/COSYlanguagesproject/assets/flags/Flag_of_Portugal.png',
  english: '/COSYlanguagesproject/assets/flags/Flag_of_the_United_Kingdom.png',
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
    if (currentLangKey && flags[currentLangKey]) {
      body.style.backgroundImage = `url(${flags[currentLangKey]})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
    } else {
      body.style.backgroundImage = 'none';
    }
  }, [currentLangKey]);

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
        <img src={flags[value]} alt={`${label} flag`} className="language-flag" />
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
