// src/utils/syllabusService.js
import { fetchJsonData } from './exerciseDataService';

let syllabusIndexCache = null;

/**
 * Fetches the main syllabus index which contains information about available days for each language.
 * Caches the result to avoid repeated network requests.
 * @returns {Promise<object|null>} A promise that resolves to the syllabus index data.
 */
export async function getSyllabusIndex() {
  if (syllabusIndexCache) {
    return syllabusIndexCache;
  }
  const filePath = '/data/syllabus_index.json';
  const { data, error } = await fetchJsonData(filePath);
  if (error) {
    console.error("SyllabusService: Failed to fetch syllabus index.", error);
    return null;
  }
  syllabusIndexCache = data;
  return data;
}
