import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from './TransliterableText';
import { logos, flags } from '../../config/languageAssets';

const LanguageHeader = ({ selectedLanguage }) => {
  const { i18n, t } = useI18n();
  const { allTranslations } = i18n || { allTranslations: {} };

  const languageName = allTranslations[selectedLanguage]?.cosyName || selectedLanguage;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
      {logos[selectedLanguage] && (
        <img src={logos[selectedLanguage]} alt={t('languageSelector.logoAlt', 'Logo')} style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
      )}
      {flags[selectedLanguage] && (
        <img src={flags[selectedLanguage]} alt={t('languageSelector.flagAlt', 'Flag')} style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
      )}
      <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
        <TransliterableText text={languageName} />
      </span>
    </div>
  );
};

export default LanguageHeader;
