import { useMemo } from 'react';
import { useLatinizationContext } from '../contexts/LatinizationContext';
import { getLatinization as utilGetLatinization } from '../utils/transliteration';

/**
 * A custom hook that returns the transliterated version of a text if latinization is active.
 * @param {string} originalText - The original text to transliterate.
 * @param {string} textLanguageIdentifier - The language identifier for the text.
 * @returns {string} The transliterated text, or the original text if latinization is not active or not applicable.
 */
const useLatinization = (originalText, textLanguageIdentifier) => {
  const { isLatinized, latinizableLanguageIds } = useLatinizationContext();

  const displayText = useMemo(() => {
    if (!isLatinized || !originalText || !textLanguageIdentifier) {
      return originalText;
    }

    const isTextLanguageLatinizable = latinizableLanguageIds.includes(textLanguageIdentifier);

    if (isTextLanguageLatinizable) {
      return utilGetLatinization(originalText, textLanguageIdentifier);
    }

    return originalText;
  }, [originalText, textLanguageIdentifier, isLatinized, latinizableLanguageIds]);

  return displayText;
};

export default useLatinization;
