import React from 'react';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import { useI18n } from '../../i18n/I18nContext'; // Assuming useI18n provides 't' function

const ToggleLatinizationButton = ({ currentDisplayLanguage }) => {
  const { isLatinized, toggleLatinization, latinizableLanguageIds } = useLatinizationContext();
  const { t } = useI18n(); // For button text localization

  // Determine if the button should be visible
  // Based on whether the currentDisplayLanguage (passed as prop) is in the latinizable list
  // The latinizableLanguageIds from context now contains the exact COSY-style language keys.
  const isCurrentLanguageLatinizable = currentDisplayLanguage && latinizableLanguageIds.includes(currentDisplayLanguage);

  if (!isCurrentLanguageLatinizable) {
    return null; // Don't render the button if the current language isn't latinizable
  }

  const buttonText = isLatinized 
    ? (t('buttons.showOriginal', 'Show Original')) 
    : (t('buttons.showLatin', 'Show Latin'));

  return (
    <button
      onClick={toggleLatinization}
      className="toggle-latinization-btn" // Apply the CSS class
      title={isLatinized ? t('tooltips.showOriginalScript', 'Show text in its original script') : t('tooltips.showLatinScript', 'Show text in Latin script (transliterated)')}
    >
      {buttonText}
    </button>
  );
};

export default ToggleLatinizationButton;
