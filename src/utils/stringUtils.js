/**
 * Normalizes a string by converting to lowercase, removing diacritics,
 * and standardizing apostrophes.
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
export function normalizeString(str) {
  if (str === null || str === undefined) {
    return '';
  }
  // Normalize to NFD (Normalization Form Canonical Decomposition) to separate base characters from diacritics
  // Then remove diacritics (Unicode range U+0300 to U+036F)
  let normalized = String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  // Standardize various apostrophe-like characters to a single apostrophe
  normalized = normalized.replace(/[’‘ʼ]/g, "'");
  return normalized;
}

/**
 * Capitalizes the first letter of a word. Can optionally lowercase the rest of the word.
 * Handles specific cases like "i" in English.
 * @param {string} word - The word to capitalize.
 * @param {boolean} [forceLowerCaseRest=true] - Whether to convert the rest of the word to lowercase.
 * @param {string} [lang='COSYenglish'] - The language context, used for special casing (e.g., "i" in English).
 * @returns {string} The capitalized word.
 */
export function capitalizeWord(word, forceLowerCaseRest = true, lang = 'COSYenglish') {
  if (typeof word !== 'string' || word.length === 0) {
    return word;
  }
  // Handle "I" specifically for English.
  if (lang === 'COSYenglish' && word.toLowerCase() === 'i') {
    return 'I';
  }
  const firstLetter = word.charAt(0).toUpperCase();
  const rest = forceLowerCaseRest ? word.slice(1).toLowerCase() : word.slice(1);
  return firstLetter + rest;
}

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param {string} string - The string to escape.
 * @returns {string} The string with regex special characters escaped.
 */
export function escapeRegExp(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
