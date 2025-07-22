// src/utils/vocabularyService.js

import { dictionary } from '../../public/data/dictionary.js';

export const CEFR_LEVELS = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
const vocabularyCache = new Map(); // Cache to store loaded vocabulary data: Map<"lang-level", themedVocabularyObject>

function getVocabularyForLanguage(lang) {
  return dictionary[lang.toLowerCase()] || null;
}

/**
 * Retrieves all vocabulary items for a given language and level, flattened into a single list.
 * Each item in the list is augmented with 'level' and 'theme' properties.
 *
 * @param {string} lang - The language code.
 * @param {string} level - The CEFR level.
 * @returns {Promise<Array<object>>} A promise that resolves to a flat array of vocabulary items.
 *                                    Returns an empty array if loading fails or no data.
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
                            theme: item.theme || theme, // Ensure theme is present
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
 *
 * @param {string} lang - The language code.
 * @param {string} level - The CEFR level.
 * @param {string} themeName - The name of the theme.
 * @returns {Promise<Array<object>|null>} A promise that resolves to an array of vocabulary items for the theme,
 *                                         or null if the theme or level data is not found.
 */
export async function getVocabularyByTheme(lang, level, themeName) {
    const themedVocabulary = getVocabularyForLanguage(lang);
    if (!themedVocabulary || !themedVocabulary[themeName]) {
        // console.warn(`VocabularyService: Theme "${themeName}" not found for ${lang} ${level}.`);
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
 * Loads and flattens vocabulary for all CEFR levels for a given language.
 * Primarily intended for tools like a comprehensive dictionary.
 *
 * @param {string} lang - The language code.
 * @returns {Promise<Array<object>>} A promise that resolves to a flat array of all vocabulary items
 *                                    for the language across all levels.
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
                        theme: item.theme || theme, // Ensure theme is present
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
    // console.log("VocabularyService: Cache cleared.");
}
