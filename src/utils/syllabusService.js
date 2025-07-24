// Import the exercise data service.
import * as ExerciseDataService from './exerciseDataService';

const MAX_PROBE_DAYS = 30;

/**
 * Probes for available syllabus days for a given language.
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @returns {Promise<Array<{ dayNumber: number, lessonName: string, fileName: string }>>} A promise that resolves to an array of available days.
 */
export async function getAvailableSyllabusDays(languageIdentifier) {
  if (!languageIdentifier) {
    console.error("SyllabusService: languageIdentifier is required for getAvailableSyllabusDays.");
    return [];
  }
  const languageCode = ExerciseDataService.getLanguageFileKey(languageIdentifier);
  const availableDays = [];
  for (let i = 1; i <= MAX_PROBE_DAYS; i++) {
    const fileName = `a${i-1}.js`;
    const filePath = `/data/dictionary/${languageCode}/${fileName}`;
    try {
      const { data, error, errorType } = await ExerciseDataService.fetchJsonData(filePath);
      if (!error && data) {
        availableDays.push({
          dayNumber: i,
          lessonName: data.lesson_name || `Day ${i} (Name TBD)`,
          fileName: fileName
        });
      } else if (error && errorType !== 'fileNotFound' && errorType !== 'jsonError') {
      }
    } catch (e) {
      console.error(`Unexpected error while probing ${filePath}:`, e);
    }
  }
  return availableDays;
}

/**
 * Fetches the full syllabus content for a specific day and language.
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {number|string} dayNumber - The day number to fetch.
 * @returns {Promise<object|null>} A promise that resolves to the syllabus data, or null if it is not found.
 */
export async function fetchSyllabusForDay(languageIdentifier, dayNumber) {
  if (!languageIdentifier || dayNumber === undefined || dayNumber === null) {
    console.error("SyllabusService: languageIdentifier and dayNumber are required for fetchSyllabusForDay.");
    return null;
  }
  const languageCode = ExerciseDataService.getLanguageFileKey(languageIdentifier);
  const fileName = `a${dayNumber-1}.js`;
  const filePath = `/data/dictionary/${languageCode}/${fileName}`;
  
  const { data, error } = await ExerciseDataService.fetchJsonData(filePath);
  
  if (error) {
    console.error(`Error fetching syllabus ${filePath}:`, error);
    return null;
  }
  return data;
}

/**
 * Fetches the syllabus content using a direct filename.
 * @param {string} syllabusFileName - The name of the syllabus file.
 * @returns {Promise<object|null>} A promise that resolves to the syllabus data, or null if it is not found.
 */
export async function fetchSyllabusByFileName(syllabusFileName) {
    if (!syllabusFileName) {
        console.error("SyllabusService: syllabusFileName is required for fetchSyllabusByFileName.");
        return null;
    }
    const languageCode = syllabusFileName.split('_')[0];
    const filePath = `/data/dictionary/${languageCode}/${syllabusFileName}`;
    const { data, error } = await ExerciseDataService.fetchJsonData(filePath);

    if (error) {
        console.error(`Error fetching syllabus ${filePath}:`, error);
        return null;
    }
    return data;
}
