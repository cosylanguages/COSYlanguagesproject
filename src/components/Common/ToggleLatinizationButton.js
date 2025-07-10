import React from 'react';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import { useI18n } from '../../i18n/I18nContext'; // Assuming useI18n provides 't' function
import Button from './Button'; // Import the new Button component

const ToggleLatinizationButton = ({ currentDisplayLanguage }) => {
  const { isLatinized, toggleLatinization, latinizableLanguageIds } = useLatinizationContext();
  const { t } = useI18n(); // For button text localization

  const isCurrentLanguageLatinizable = currentDisplayLanguage && latinizableLanguageIds.includes(currentDisplayLanguage);

  if (!isCurrentLanguageLatinizable) {
    return null;
  }

  const buttonText = isLatinized
    ? (t('buttons.showOriginal', 'Show Original'))
    : (t('buttons.showLatin', 'Show Latin'));

  const buttonTitle = isLatinized
    ? t('tooltips.showOriginalScript', 'Show text in its original script')
    : t('tooltips.showLatinScript', 'Show text in Latin script (transliterated)');

  return (
    <Button
      onClick={toggleLatinization}
      className="toggle-latinization-btn" // Apply the specific CSS class
      title={buttonTitle}
      // No specific variant needed if className handles all styling
    >
      {buttonText}
    </Button>
  );
};

export default ToggleLatinizationButton;
