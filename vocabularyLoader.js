/**
 * Dynamically loads vocabulary data for a given language.
 *
 * @param {string} languageCode - The language code (e.g., "en", "es") corresponding to the JSON file name.
 * @returns {Promise<Array<object>>} A Promise that resolves with an array of vocabulary objects
 *                                     (each with 'phrase' and 'level' properties), or rejects with an error.
 */
async function loadLanguageVocabulary(languageCode) {
  // Validate languageCode to prevent directory traversal or unexpected behavior
  // Simple validation: allow only alphanumeric characters (and maybe hyphens/underscores if needed for codes like en-US)
  if (!/^[a-zA-Z0-9_-]+$/.test(languageCode)) {
    return Promise.reject(new Error(`Invalid language code format: ${languageCode}`));
  }

  const filePath = `./locales/${languageCode}.json`; // Assumes loader is in the root or paths are adjusted accordingly.

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      // Handles HTTP errors like 404 Not Found
      throw new Error(`Failed to fetch vocabulary for ${languageCode}. Status: ${response.status}`);
    }

    const vocabularyData = await response.json();
    return vocabularyData;
  } catch (error) {
    // Handles network errors or issues with response.json() (e.g., invalid JSON)
    console.error(`Error loading vocabulary for ${languageCode}:`, error);
    return Promise.reject(error); // Re-throw the error or return a specific error object
  }
}

// Example usage (optional, for testing or demonstration):
/*
async function testLoader() {
  try {
    console.log("Loading English vocabulary...");
    const enVocab = await loadLanguageVocabulary('en');
    console.log("English Vocabulary (first 5 entries):", enVocab.slice(0, 5));
    // console.log(`Total English phrases: ${enVocab.length}`);

    // Example of loading a non-existent language
    // console.log("\\nLoading Spanish vocabulary (expected to fail)...");
    // await loadLanguageVocabulary('es');

  } catch (error) {
    console.error("Test loader failed:", error.message);
  }
}

// To run the test if this script is executed directly (e.g., in Node.js for testing)
// or if you want to test in a browser console:
// testLoader();
*/

// Export the function if using modules (e.g., ES modules or CommonJS)
// For ES Modules (if your project is set up for it, e.g., in package.json "type": "module"):
// export { loadLanguageVocabulary };

// For CommonJS (typical in Node.js environments if not using ES Modules):
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = { loadLanguageVocabulary };
// }
// If this script is directly included in an HTML page via <script> tag,
// loadLanguageVocabulary will become a global function.
// For simplicity in this context, I'll assume it might be used globally or imported as needed.
