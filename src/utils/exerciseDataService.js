// frontend/src/utils/exerciseDataService.js

/**
 * Generic function to fetch JSON data from a given file path.
 * Assumes paths are relative to the public folder or served from the root.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<{data: any, error: string|null, errorType: string|null}>}
 */
async function fetchJsonData(filePath) {
  try {
    // Prepend PUBLIC_URL to ensure correct pathing, especially in production builds or subfolder deployments.
    // filePath is expected to start with a leading slash like '/data/...'
    const fullPath = `${process.env.PUBLIC_URL || ''}${filePath}`;
    const response = await fetch(fullPath);
    if (response.ok) {
      try {
        const data = await response.json();
        return { data, error: null, errorType: null };
      } catch (jsonError) {
        console.error(`Error parsing JSON from ${filePath}:`, jsonError);
        return { data: null, error: 'Invalid JSON format', errorType: 'jsonError' };
      }
    } else {
      const errorContext = `HTTP error ${response.status} while fetching ${filePath}`;
      console.error(errorContext);
      if (response.status === 404) {
        return { data: null, error: `File not found: ${filePath}`, errorType: 'fileNotFound' };
      }
      return { data: null, error: `Failed to load data: ${errorContext}`, errorType: 'httpError' };
    }
  } catch (networkError) {
    console.error(`Network error or other exception while loading data from ${filePath}:`, networkError);
    return { data: null, error: `Network error: ${networkError.message}`, errorType: 'networkError' };
  }
}

// Corrected langFileMap to align with keys from translationsData.js / I18nContext
const langFileMap = {
  'COSYenglish': 'en',
  'COSYfrench': 'fr',
  'COSYespañol': 'es',
  'COSYitalian': 'it',
  'COSYdeutsch': 'de',
  'COSYportugese': 'pt',
  'COSYgreek': 'el',
  'COSYrussian': 'ru',
  'COSYarmenian': 'hy',
  'COSYbrezhoneg': 'br',
  'COSYtatar': 'tt',
  'COSYbachkir': 'ba'
};

export function getLanguageFileKey(languageIdentifier) {
  return langFileMap[languageIdentifier] || 'english'; // Default to English
}

/**
 * Processes fetched data based on selected day(s).
 * @param {object} allData - The entire data object fetched from JSON.
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Array|Object} - The filtered data for the selected day(s).
 */
function filterDataByDays(allData, days) {
  if (!allData) return Array.isArray(days) ? [] : {}; // Return empty array for multiple days, object for single/opposites

  let dayData;
  if (Array.isArray(days)) {
    dayData = [];
    days.forEach(d => {
      if (allData[d]) dayData = dayData.concat(allData[d]);
    });
  } else { // Single day or data structure not an array (like opposites)
    if (typeof days === 'string' || typeof days === 'number') { // Ensure 'days' is a valid key
        dayData = allData[days] || (typeof allData === 'object' && !Array.isArray(allData) ? {} : []);
    } else { // If days is not a string/number (e.g. undefined, null), return all data or empty if not applicable
        dayData = allData; // This might be the case for data not structured by day, like images.json root
    }
  }
  return dayData;
}


export async function loadVocabularyData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/vocabulary/words/${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType }; // Ensure consistent error structure
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

export async function loadImageData(languageIdentifier, days) {
  const filePath = `/data/vocabulary/images/images.json`; // Single file for all image metadata
  const { data: allImageData, error, errorType } = await fetchJsonData(filePath);

  if (error) return { data: [], error, errorType };

  const imageDataForDays = filterDataByDays(allImageData, days);

  // Filter images that have a translation for the current language
  const filteredImages = Array.isArray(imageDataForDays)
    ? imageDataForDays.filter(img => img.translations && img.translations[languageIdentifier])
    : []; // If not an array (e.g. error or unexpected structure), return empty

  return { data: filteredImages, error: null, errorType: null };
}

export async function loadOppositesData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/vocabulary/opposites/${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: {}, error, errorType };
  const dayData = filterDataByDays(data, days);
  if (Array.isArray(days) && Array.isArray(dayData)) {
    const mergedOpposites = dayData.reduce((acc, dayObj) => ({ ...acc, ...dayObj }), {});
    return { data: mergedOpposites, error: null, errorType: null };
  }
  return { data: dayData, error: null, errorType: null };
}

export async function loadGenderGrammarData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/grammar/gender/grammar_gender_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

export async function loadPossessivesData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filenameLangKey = langKey === 'french' ? 'francais' : langKey;
  const filePath = `/data/grammar/possessives/${filenameLangKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: {}, error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

export async function loadVerbGrammarData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/grammar/verbs/grammar_verbs_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

export async function loadReadingData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/reading/reading_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

export async function loadSpeakingPromptsData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/speaking/question/question_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

export async function loadWritingPromptsData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/writing/story_prompts_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  const defaultData = { what_happens_next: [], what_happened_before: [] };
  if (error) return { data: defaultData, error, errorType };
  const dayFilteredData = filterDataByDays(data, days);
  if (Array.isArray(days) && Array.isArray(dayFilteredData)) {
    const mergedPrompts = { what_happens_next: [], what_happened_before: [] };
    dayFilteredData.forEach(dayObj => {
      if (dayObj && dayObj.what_happens_next) mergedPrompts.what_happens_next.push(...dayObj.what_happens_next);
      if (dayObj && dayObj.what_happened_before) mergedPrompts.what_happened_before.push(...dayObj.what_happened_before);
    });
    return { data: mergedPrompts, error: null, errorType: null };
  }
  return {
    data: (dayFilteredData && typeof dayFilteredData === 'object' && !Array.isArray(dayFilteredData)) ? dayFilteredData : defaultData,
    error: null,
    errorType: null
  };
}

export async function loadSentenceUnscrambleData(languageIdentifier) {
  const filePath = `/data/exercises/sentenceUnscramble.json`;
  const { data: allLanguageData, error, errorType } = await fetchJsonData(filePath);
  if (error) {
    return { data: [], error, errorType };
  }
  if (allLanguageData && allLanguageData[languageIdentifier]) {
    return { data: allLanguageData[languageIdentifier], error: null, errorType: null };
  } else {
    console.warn(`Sentence unscramble data for language ${languageIdentifier} not found in ${filePath}.`);
    return { data: [], error: `No sentence unscramble data for ${languageIdentifier}.`, errorType: 'dataNotFound' };
  }
}

/**
 * Loads Fill in the Blanks exercise data for a given language.
 * Data is expected to be an object where keys are language codes (e.g., "COSYfrench")
 * and values are arrays of exercise items for that language.
 * @param {string} languageIdentifier - The language identifier (e.g., "COSYfrench").
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>}
 */
export async function loadFillInTheBlanksData(languageIdentifier) {
  const filePath = `/data/exercises/fillInTheBlanks.json`;
  const { data: allLanguageData, error, errorType } = await fetchJsonData(filePath);

  if (error) {
    return { data: [], error, errorType };
  }

  if (allLanguageData && allLanguageData[languageIdentifier]) {
    return { data: allLanguageData[languageIdentifier], error: null, errorType: null };
  } else {
    console.warn(`Fill in the Blanks data for language ${languageIdentifier} not found in ${filePath}.`);
    return { data: [], error: `No Fill in the Blanks data for ${languageIdentifier}.`, errorType: 'dataNotFound' };
  }
}

export { fetchJsonData };

console.log('[ExerciseDataService] Service loaded.');
