import { loadVocabularyData, fetchJsonData } from './exerciseDataService';

/**
 * Loads all vocabulary for a given language and flattens it into a single list.
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench', 'en').
 * @returns {Promise<Array>} A promise that resolves to an array of vocabulary items.
 */
export async function loadAllLevelsForLanguageAsFlatList(languageIdentifier) {
  // Handle English as a special case, loading from the root vocabulary.json
  if (languageIdentifier === 'en' || languageIdentifier === 'english' || languageIdentifier === 'COSYenglish') {
    const { data, error } = await fetchJsonData('/vocabulary.json');
    if (error) {
      console.error("Failed to load English vocabulary data:", error);
      return [];
    }
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).flat();
    }
    return [];
  }

  // Existing logic for other languages
  const { data, error } = await loadVocabularyData(languageIdentifier, null);

  if (error) {
    console.error(`Failed to load vocabulary data for ${languageIdentifier}:`, error);
    return [];
  }

  if (Array.isArray(data)) {
    // This case is for data that is already a flat list of strings.
    return data.map(term => ({ term }));
  }

  if (typeof data === 'object' && data !== null) {
    // This is for languages where data is structured by day
    const flattenedData = Object.values(data).flat();
    return flattenedData.map(term => (typeof term === 'string' ? { term } : term));
  }

  return [];
}
