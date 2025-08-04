// Import necessary utility functions.
import { fetchJsonData, getLanguageFileKey } from './exerciseDataService';

/**
 * Loads the conjugation data for a given language.
 * @param {string} languageIdentifier - The identifier for the language (e.g., 'COSYfrench').
 * @returns {Promise<{data: object|null, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the conjugation data, or an error if the data could not be loaded.
 */
export async function loadConjugationData(languageIdentifier) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/grammar/verbs/conjugations/conjugations_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: null, error, errorType };
  return { data, error: null, errorType: null };
}

/**
 * Loads the data for English irregular verbs.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the English irregular verbs data, or an error if the data could not be loaded.
 */
export async function loadEnglishIrregularVerbsData() {
  const filePath = `/data/grammar/verbs/irregular/irregular_verbs_english.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: data || [], error: null, errorType: null };
}
