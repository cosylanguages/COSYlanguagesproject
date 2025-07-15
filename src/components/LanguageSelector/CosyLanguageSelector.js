import React, { useEffect } from 'react';
import Select from 'react-select';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './CosyLanguageSelector.css';
import cosyarmenian from '../../assets/icons/cosylanguages_logos/cosyarmenian.png';
import cosybachkir from '../../assets/icons/cosylanguages_logos/cosybachkir.png';
import cosybreton from '../../assets/icons/cosylanguages_logos/cosybreton.png';
import cosyenglish from '../../assets/icons/cosylanguages_logos/cosyenglish.png';
import cosyfrench from '../../assets/icons/cosylanguages_logos/cosyfrench.png';
import cosygeorgian from '../../assets/icons/cosylanguages_logos/cosygeorgian.png';
import cosygerman from '../../assets/icons/cosylanguages_logos/cosygerman.png';
import cosygreek from '../../assets/icons/cosylanguages_logos/cosygreek.png';
import cosyitalian from '../../assets/icons/cosylanguages_logos/cosyitalian.png';
import cosyportuguese from '../../assets/icons/cosylanguages_logos/cosyportuguese.png';
import cosyrussian from '../../assets/icons/cosylanguages_logos/cosyrussian.png';
import cosyspanish from '../../assets/icons/cosylanguages_logos/cosyspanish.png';
import cosytatar from '../../assets/icons/cosylanguages_logos/cosytatar.png';

const logos = {
  COSYarmenian: cosyarmenian,
  COSYbashkir: cosybachkir,
  COSYbreton: cosybreton,
  COSYenglish: cosyenglish,
  COSYfrench: cosyfrench,
  COSYgeorgian: cosygeorgian,
  COSYgerman: cosygerman,
  COSYgreek: cosygreek,
  COSYitalian: cosyitalian,
  COSYportuguese: cosyportuguese,
  COSYrussian: cosyrussian,
  COSYspanish: cosyspanish,
  COSYtatar: cosytatar,
};


const CosyLanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const { allTranslations, t, currentLangKey } = useI18n();

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
