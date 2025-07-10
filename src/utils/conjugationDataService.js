// frontend/src/utils/conjugationDataService.js

// Assuming fetchJsonData and getLanguageFileKey are either duplicated here or imported
// For now, let's duplicate the minimal needed parts if direct import is complex from here.

// Minimal fetchJsonData (consider refactoring to a shared util if not already)
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

// Minimal langFileMap (consider refactoring to a shared util)
const langFileMap = {
  'COSYenglish': 'english',
  'COSYfrench': 'french',
  'COSYespañol': 'spanish',
  'COSYitalian': 'italian',
  'COSYdeutsch': 'german',
  'COSYportugese': 'portuguese',
  'COSYgreek': 'greek',
  'COSYrussian': 'russian',
  'COSYarmenian': 'armenian',
  'COSYbrezhoneg': 'breton',
  'COSYtatar': 'tatar',
  'COSYbachkir': 'bashkir'
};

function getLanguageFileKey(languageIdentifier) {
  return langFileMap[languageIdentifier] || 'english'; // Default to English
}

export async function loadConjugationData(languageIdentifier) {
  const langKey = getLanguageFileKey(languageIdentifier);
  const filePath = `/data/grammar/verbs/conjugations/conjugations_${langKey}.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  // Conjugation data is typically an object with a "verbs" array, not filtered by day.
  if (error) return { data: null, error, errorType }; // Return null for data on error
  return { data, error: null, errorType: null }; // Return the whole data object
}

export async function loadEnglishIrregularVerbsData() {
  const filePath = `/data/grammar/verbs/irregular/irregular_verbs_COSYenglish.json`;
  const { data, error, errorType } = await fetchJsonData(filePath);
  // irregular_verbs_COSYenglish.json is an array of objects.
  if (error) return { data: [], error, errorType }; // Return empty array on error
  return { data: data || [], error: null, errorType: null }; // Ensure data is an array
}
