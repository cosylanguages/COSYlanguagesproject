import React from 'react';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import { useI18n } from '../../i18n/I18nContext'; // Assuming useI18n provides 't' function

const ToggleLatinizationButton = ({ currentDisplayLanguage }) => {
  const { isLatinized, toggleLatinization, latinizableLanguageIds } = useLatinizationContext();
  const { t } = useI18n(); // For button text localization

  // Determine if the button should be visible
  // Based on whether the currentDisplayLanguage (passed as prop) is in the latinizable list
  const isCurrentLanguageLatinizable = latinizableLanguageIds.some(id =>
    currentDisplayLanguage && (
      currentDisplayLanguage.toLowerCase().includes(id.toLowerCase()) ||
      (id === 'ΚΟΖΥελληνικά' && currentDisplayLanguage.toLowerCase().includes('greek')) ||
      (id === 'ТАКОЙрусский' && currentDisplayLanguage.toLowerCase().includes('russian')) ||
      (id === 'ԾՈՍՅհայկական' && currentDisplayLanguage.toLowerCase().includes('armenian'))
    )
  );

  if (!isCurrentLanguageLatinizable) {
    return null; // Don't render the button if the current language isn't latinizable
  }

  const buttonText = isLatinized 
    ? (t('buttons.showOriginal', 'Show Original')) 
    : (t('buttons.showLatin', 'Show Latin'));

  return (
    <button
      onClick={toggleLatinization}
      style={{
        padding: '5px 10px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        backgroundColor: '#6c757d',
        color: 'white',
        border: '1px solid #5a6268',
        borderRadius: '4px',
        marginLeft: '10px', // Example styling
      }}
      title={isLatinized ? t('tooltips.showOriginalScript', 'Show text in its original script') : t('tooltips.showLatinScript', 'Show text in Latin script (transliterated)')}
    >
      {buttonText}
    </button>
  );
};

export default ToggleLatinizationButton;
