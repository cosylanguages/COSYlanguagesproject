// frontend/src/utils/latinizer.js
import { getLatinization as applyTransliteration } from './transliteration';

export const LATINIZABLE_LANGUAGES = Object.freeze([
    'ΚΟΖΥελληνικά', // Greek
    'ТАКОЙрусский', // Russian
    'ԾՈՍՅհայկական', // Armenian
    'COSYtatarça',  // Tatar
    'COSYbashkort'  // Bashkir
    // Add any other languages that have specific transliteration rules in transliteration.js
]);

/**
 * Checks if a given COSYlanguage code is one that should be considered for latinization.
 * @param {string} languageCode - The COSYlanguage code (e.g., 'COSYenglish', 'ТАКОЙрусский').
 * @returns {boolean} True if the language is in the latinizable list.
 */
export const isLatinizableLanguage = (languageCode) => {
    return LATINIZABLE_LANGUAGES.includes(languageCode);
};

/**
 * Applies latinization to text if the language is latinizable.
 * This function also needs to handle the "isCyrillicAlreadyLatin" concept if it's to be fully equivalent
 * to the old system. The old `LanguageHandler.js` had `isCyrillicAlreadyLatin(text, language)` which
 * `CosyLatinizer.latinize` (old) expected as a third argument.
 * For simplicity now, we'll assume the core `applyTransliteration` handles this or it's less critical.
 * A more robust solution might involve passing this check to `applyTransliteration` if needed.
 *
 * @param {string} text - The text to potentially latinize.
 * @param {string} languageCode - The COSYlanguage code of the text.
 * @returns {string} The latinized text or original text.
 */
export const latinizeIfNeeded = (text, languageCode) => {
    if (!text || typeof text !== 'string') return text;
    if (isLatinizableLanguage(languageCode)) {
        // The old system's CosyLatinizer.latinize had a third param: isCyrillicAlreadyLatin
        // The current getLatinization (ported from transliteration.js) does not.
        // If that check is important, it needs to be re-integrated here or in getLatinization.
        // For now, direct call:
        return applyTransliteration(text, languageCode);
    }
    return text;
};

// This function is a more direct replacement for the old CosyLatinizer.latinize behavior,
// assuming the check for already latinized text is important for Cyrillic.
// This would require isCyrillicAlreadyLatin function to be ported as well.
/*
import { isCyrillicAlreadyLatin } from './languageUtils'; // Assuming this utility exists

export const fullLatinize = (text, languageCode) => {
    if (!text || typeof text !== 'string') return text;

    if (isLatinizableLanguage(languageCode)) {
        let performLatinization = true;
        if (['ТАКОЙрусский', 'COSYbashkort', 'COSYtatarça'].includes(languageCode)) {
            if (isCyrillicAlreadyLatin(text, languageCode)) {
                performLatinization = false; // Don't double-latinize
            }
        }
        if (performLatinization) {
            return applyTransliteration(text, languageCode);
        }
    }
    return text;
}
*/
