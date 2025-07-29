import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from './TransliterableText';

const LanguageHeader = ({ selectedLanguage }) => {
  const { i18n } = useI18n();
  const { allTranslations } = i18n || { allTranslations: {} };

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

  const flags = {
    COSYbashkir: '/assets/flags/Flag_of_Bashkortostan.png',
    COSYbreton: '/assets/flags/Flag_of_Brittany.png',
    COSYtatar: '/assets/flags/Flag_of_Tatarstan.png',
  };

  const languageName = allTranslations[selectedLanguage]?.cosyName || selectedLanguage;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
      {logos[selectedLanguage] && (
        <img src={logos[selectedLanguage]} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
      )}
      {flags[selectedLanguage] && (
        <img src={flags[selectedLanguage]} alt="Drapeau" style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
      )}
      <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
        <TransliterableText text={languageName} />
      </span>
    </div>
  );
};

export default LanguageHeader;
