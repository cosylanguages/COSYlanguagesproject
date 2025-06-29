import { useMemo } from 'react';
import { useLatinizationContext } from '../contexts/LatinizationContext';
import { getLatinization as utilGetLatinization } from '../utils/transliteration'; // Corrected import path

/**
 * Custom hook to get transliterated text based on LatinizationContext.
 * @param {string} originalText The original text to potentially transliterate.
 * @param {string} textLanguageIdentifier The language identifier for the text (e.g., 'ТАКОЙрусский').
 * @returns {string} The transliterated text if latinization is active and applicable, otherwise original text.
 */
const useLatinization = (originalText, textLanguageIdentifier) => {
  const { isLatinized, latinizableLanguageIds } = useLatinizationContext();

  const displayText = useMemo(() => {
    if (!isLatinized || !originalText || !textLanguageIdentifier) {
      return originalText;
    }

    // Check if the text's language is in the list of latinizable languages from the context
    // This logic might need to be more robust if languageIdentifier formats vary greatly.
    // For now, it relies on the context's latinizableLanguageIds being the COSY-style IDs.
    const isTextLanguageLatinizable = latinizableLanguageIds.includes(textLanguageIdentifier);

    // The previous check was more complex:
    // const isTextLanguageLatinizable = latinizableLanguageIds.some(id =>
    //   textLanguageIdentifier.toLowerCase().includes(id.toLowerCase()) ||
    //   (id === 'ΚΟΖΥελληνικά' && textLanguageIdentifier.toLowerCase().includes('greek')) ||
    //   (id === 'ТАКОЙрусский' && textLanguageIdentifier.toLowerCase().includes('russian')) ||
    //   (id === 'ԾՈՍՅհայկական' && textLanguageIdentifier.toLowerCase().includes('armenian'))
    // );
    // Reverting to simpler check based on context providing the exact IDs.
    // If textLanguageIdentifier can be 'russian' instead of 'ТАКОЙрусский', the old logic was better.
    // For now, assuming textLanguageIdentifier will be the COSY ID from the data.

    if (isTextLanguageLatinizable) {
      return utilGetLatinization(originalText, textLanguageIdentifier);
    }

    return originalText;
  }, [originalText, textLanguageIdentifier, isLatinized, latinizableLanguageIds]);

  return displayText;
};

export default useLatinization;
