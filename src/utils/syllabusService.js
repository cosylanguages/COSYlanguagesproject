// src/utils/syllabusService.js
import * as ExerciseDataService from './exerciseDataService'; // Import all as a namespace

const MAX_PROBE_DAYS = 30; // Max number of days to check for syllabus files

/**
 * Probes for available syllabus days for a given language.
 * It checks for the existence of syllabus files like en_day1_syllabus.json.
 * @param {string} languageCode - The language code (e.g., 'en', 'fr').
 * @returns {Promise<Array<{ dayNumber: number, lessonName: string, fileName: string }>>} An array of available days.
 */
export async function getAvailableSyllabusDays(languageCode) {
  if (!languageCode) {
    console.error("SyllabusService: languageCode is required for getAvailableSyllabusDays.");
    return [];
  }
  const availableDays = [];
  for (let i = 1; i <= MAX_PROBE_DAYS; i++) {
    const fileName = `${languageCode}_day${i}_syllabus.json`;
    const filePath = `/data/custom_syllabus/${fileName}`;
    try {
      const { data, error, errorType } = await ExerciseDataService.fetchJsonData(filePath); // Corrected
      if (!error && data && data.lesson_name) {
        availableDays.push({
          dayNumber: i,
          lessonName: data.lesson_name,
          fileName: fileName
        });
      } else if (!error && data && !data.lesson_name) {
         availableDays.push({
          dayNumber: i,
          lessonName: `Day ${i} (Name TBD)`,
          fileName: fileName
        });
      } else if (error && errorType !== 'fileNotFound' && errorType !== 'jsonError') {
        // console.error(`Error probing syllabus file ${filePath}:`, error);
      }
    } catch (e) {
      console.error(`Unexpected error while probing ${filePath}:`, e);
    }
  }
  return availableDays;
}

/**
 * Fetches the full syllabus content for a specific day and language.
 * @param {string} languageCode - The language code (e.g., 'en', 'fr').
 * @param {number|string} dayNumber - The day number to fetch.
 * @returns {Promise<object|null>} The syllabus data object, or null if not found or error.
 */
export async function fetchSyllabusForDay(languageCode, dayNumber) {
  if (!languageCode || dayNumber === undefined || dayNumber === null) {
    console.error("SyllabusService: languageCode and dayNumber are required for fetchSyllabusForDay.");
    return null;
  }
  const fileName = `${languageCode}_day${dayNumber}_syllabus.json`;
  const filePath = `/data/custom_syllabus/${fileName}`;
  
  const { data, error } = await ExerciseDataService.fetchJsonData(filePath); // Corrected
  
  if (error) {
    console.error(`Error fetching syllabus ${filePath}:`, error);
    return null;
  }
  return data;
}

/**
 * Fetches the syllabus content using a direct filename.
 * Useful if the filename is already known (e.g., from getAvailableSyllabusDays).
 * @param {string} syllabusFileName - The exact name of the syllabus file (e.g., 'en_day1_syllabus.json').
 * @returns {Promise<object|null>} The syllabus data object, or null if not found or error.
 */
export async function fetchSyllabusByFileName(syllabusFileName) {
    if (!syllabusFileName) {
        console.error("SyllabusService: syllabusFileName is required for fetchSyllabusByFileName.");
        return null;
    }
    const filePath = `/data/custom_syllabus/${syllabusFileName}`;
    const { data, error } = await ExerciseDataService.fetchJsonData(filePath); // Corrected

    if (error) {
        console.error(`Error fetching syllabus ${filePath}:`, error);
        return null;
    }
    return data;
}
