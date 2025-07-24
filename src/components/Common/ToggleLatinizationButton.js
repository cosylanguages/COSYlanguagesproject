// Import necessary libraries and components.
import React from 'react';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from './Button';

/**
 * A button that toggles the latinization of text.
 * It is only displayed if the current language is latinizable.
 * @param {object} props - The component's props.
 * @param {string} props.currentDisplayLanguage - The current display language.
 * @returns {JSX.Element|null} The ToggleLatinizationButton component, or null if the language is not latinizable.
 */
const ToggleLatinizationButton = ({ currentDisplayLanguage }) => {
  const { isLatinized, toggleLatinization, latinizableLanguageIds } = useLatinizationContext();
  const { t } = useI18n();

  // Check if the current language is latinizable.
  const isCurrentLanguageLatinizable = currentDisplayLanguage && latinizableLanguageIds.includes(currentDisplayLanguage);

  // If the language is not latinizable, don't render the button.
  if (!isCurrentLanguageLatinizable) {
    return null;
  }

  // Determine the button text and title based on the current latinization state.
  const buttonText = isLatinized
    ? (t('buttons.showOriginal', 'Show Original'))
    : (t('buttons.showLatin', 'Show Latin'));

  const buttonTitle = isLatinized
    ? t('tooltips.showOriginalScript', 'Show text in its original script')
    : t('tooltips.showLatinScript', 'Show text in Latin script (transliterated)');

  // Render the button.
  return (
    <Button
      onClick={toggleLatinization}
      className="toggle-latinization-btn"
      title={buttonTitle}
    >
      {buttonText}
    </Button>
  );
};

export default ToggleLatinizationButton;
