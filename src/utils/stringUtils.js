/**
 * Normalizes a string by converting it to lowercase, removing diacritics, and standardizing apostrophes.
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
export function normalizeString(str) {
  if (str === null || str === undefined) {
    return '';
  }
  let normalized = String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  normalized = normalized.replace(/[’‘ʼ]/g, "'");
  return normalized;
}

/**
 * Capitalizes the first letter of a word.
 * @param {string} word - The word to capitalize.
 * @param {boolean} [forceLowerCaseRest=true] - Whether to convert the rest of the word to lowercase.
 * @param {string} [lang='COSYenglish'] - The language of the word.
 * @returns {string} The capitalized word.
 */
export function capitalizeWord(word, forceLowerCaseRest = true, lang = 'COSYenglish') {
  if (typeof word !== 'string' || word.length === 0) {
    return word;
  }
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
 * @returns {string} The escaped string.
 */
export function escapeRegExp(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
