import { loadVocabularyData } from './exerciseDataService';

/**
 * Loads all vocabulary for a given language and flattens it into a single list.
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @returns {Promise<Array>} A promise that resolves to an array of vocabulary items.
 */
export async function loadAllLevelsForLanguageAsFlatList(languageIdentifier) {
  const { data, error } = await loadVocabularyData(languageIdentifier, null);

  if (error) {
    console.error("Failed to load vocabulary data:", error);
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    // If the data is an object of days, flatten it into a single array.
    return Object.values(data).flat();
  }

  return [];
}
