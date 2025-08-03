/**
 * A generic function to fetch JSON data from a given file path.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<{data: any, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the data, or an error if the data could not be loaded.
 */
async function fetchJsonData(filePath) {
  try {
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

// A map that associates COSYlanguage identifiers with their corresponding file keys.
// NOTE: The file naming conventions in the /public/data directory are inconsistent.
// - Most files use the full English language name (e.g., "english.json", "grammar_verbs_english.json").
// - Some files in grammar/possessives use a "COSY" prefix (e.g., "COSYenglish.json").
// - This map uses the full language name, which is the most common convention.
//   Services that use this map may need to handle exceptions.
const langFileMap = {
  'COSYenglish': 'english',
  'COSYfrench': 'french',
  'COSYespañol': 'spanish',
  'COSYitalian': 'italian',
  'COSYdeutsch': 'german',
  'COSYportugese': 'portuguese', // The key is misspelled ('portugese') in the codebase.
  'COSYgreek': 'greek',
  'COSYrussian': 'russian',
  'COSYarmenian': 'armenian',
  'COSYbrezhoneg': 'breton',
  'COSYtatar': 'tatar',
  'COSYbachkir': 'bashkir' // The key has 'bachkir', filename has 'bashkir'.
};

/**
 * Gets the language file key for a given language identifier.
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @returns {string} The language file key.
 */
export function getLanguageFileKey(languageIdentifier) {
  return langFileMap[languageIdentifier] || 'english';
}

/**
 * Filters the fetched data based on the selected day(s).
 * @param {object} allData - The entire data object fetched from the JSON file.
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Array|Object} The filtered data for the selected day(s).
 */
function filterDataByDays(allData, days) {
  if (!allData) return Array.isArray(days) ? [] : {};

  let dayData;
  if (Array.isArray(days)) {
    dayData = [];
    days.forEach(d => {
      if (allData[d]) dayData = dayData.concat(allData[d]);
    });
  } else {
    if (typeof days === 'string' || typeof days === 'number') {
        dayData = allData[days] || (typeof allData === 'object' && !Array.isArray(allData) ? {} : []);
    } else {
        dayData = allData;
    }
  }
  return dayData;
}

/**
 * Loads the vocabulary data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the vocabulary data, or an error if the data could not be loaded.
 */
export async function loadVocabularyData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/vocabulary/words/${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

/**
 * Loads the image data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the image data, or an error if the data could not be loaded.
 */
export async function loadImageData(languageIdentifier, days) {
  const filePath = `/data/vocabulary/images/images.json`;
  const { data: allImageData, error, errorType } = await fetchJsonData(filePath);

  if (error) return { data: [], error, errorType };

  const imageDataForDays = filterDataByDays(allImageData, days);

  const filteredImages = Array.isArray(imageDataForDays)
    ? imageDataForDays.filter(img => img.translations && img.translations[languageIdentifier])
    : [];

  return { data: filteredImages, error: null, errorType: null };
}

/**
 * Loads the opposites data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: object, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the opposites data, or an error if the data could not be loaded.
 */
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

/**
 * Loads the gender grammar data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the gender grammar data, or an error if the data could not be loaded.
 */
export async function loadGenderGrammarData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/grammar/gender/grammar_gender_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

/**
 * Loads the possessives data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: object, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the possessives data, or an error if the data could not be loaded.
 */
export async function loadPossessivesData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filenameLangKey = langKey === 'french' ? 'francais' : langKey;
  const filePath = `/data/grammar/possessives/${filenameLangKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: {}, error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

/**
 * Loads the verb grammar data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the verb grammar data, or an error if the data could not be loaded.
 */
export async function loadVerbGrammarData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/grammar/verbs/grammar_verbs_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

/**
 * Loads the reading data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the reading data, or an error if the data could not be loaded.
 */
export async function loadReadingData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/reading/reading_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

/**
 * Loads the speaking prompts data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the speaking prompts data, or an error if the data could not be loaded.
 */
export async function loadSpeakingPromptsData(languageIdentifier, days) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/speaking/question/question_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  if (error) return { data: [], error, errorType };
  return { data: filterDataByDays(data, days), error: null, errorType: null };
}

/**
 * Loads the writing prompts data for a given language and day(s).
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @param {string|string[]} days - The selected day or array of days.
 * @returns {Promise<{data: object, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the writing prompts data, or an error if the data could not be loaded.
 */
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

/**
 * Loads the sentence unscramble data for a given language.
 * @param {string} languageIdentifier - The language identifier (e.g., 'COSYfrench').
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the sentence unscramble data, or an error if the data could not be loaded.
 */
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
 * Loads the fill in the blanks data for a given language.
 * @param {string} languageIdentifier - The language identifier (e.g., "COSYfrench").
 * @returns {Promise<{data: Array, error: string|null, errorType: string|null}>} A promise that resolves to an object containing the fill in the blanks data, or an error if the data could not be loaded.
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
