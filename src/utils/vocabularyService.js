// Import the dictionary data.
import { dictionary } from '../data/dictionary.js';

export const CEFR_LEVELS = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
const vocabularyCache = new Map();

/**
 * Gets the vocabulary for a given language.
 * @param {string} lang - The language code.
 * @returns {object|null} The vocabulary for the language, or null if it is not found.
 */
function getVocabularyForLanguage(lang) {
  return dictionary[lang.toLowerCase()] || null;
}

/**
 * Retrieves all vocabulary items for a given language and level, flattened into a single list.
 * @param {string} lang - The language code.
 * @param {string} level - The CEFR level.
 * @returns {Promise<Array<object>>} A promise that resolves to a flat array of vocabulary items.
 */
export async function getAllVocabularyAsFlatList(lang, level) {
    const themedVocabulary = getVocabularyForLanguage(lang);
    if (!themedVocabulary) {
        return [];
    }

    const flatList = [];
    for (const theme in themedVocabulary) {
        if (Object.hasOwnProperty.call(themedVocabulary, theme)) {
            const items = themedVocabulary[theme];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    if (item.level === level) {
                        flatList.push({
                            ...item,
                            theme: item.theme || theme,
                        });
                    }
                });
            }
        }
    }
    return flatList;
}

/**
 * Retrieves all vocabulary items for a specific theme within a given language and level.
 * @param {string} lang - The language code.
 * @param {string} level - The CEFR level.
 * @param {string} themeName - The name of the theme.
 * @returns {Promise<Array<object>|null>} A promise that resolves to an array of vocabulary items for the theme, or null if the theme is not found.
 */
export async function getVocabularyByTheme(lang, level, themeName) {
    const themedVocabulary = getVocabularyForLanguage(lang);
    if (!themedVocabulary || !themedVocabulary[themeName]) {
        return null;
    }
    return themedVocabulary[themeName]
        .filter(item => item.level === level)
        .map(item => ({
            ...item,
            theme: item.theme || themeName,
        }));
}

/**
 * Loads and flattens the vocabulary for all CEFR levels for a given language.
 * @param {string} lang - The language code.
 * @returns {Promise<Array<object>>} A promise that resolves to a flat array of all vocabulary items for the language.
 */
export async function loadAllLevelsForLanguageAsFlatList(lang) {
    const themedVocabulary = getVocabularyForLanguage(lang);
    if (!themedVocabulary) {
        return [];
    }

    const flatList = [];
    for (const theme in themedVocabulary) {
        if (Object.hasOwnProperty.call(themedVocabulary, theme)) {
            const items = themedVocabulary[theme];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    flatList.push({
                        ...item,
                        theme: item.theme || theme,
                    });
                });
            }
        }
    }
    return flatList;
}

/**
 * Clears the vocabulary cache.
 */
export function clearVocabularyCache() {
    vocabularyCache.clear();
}
