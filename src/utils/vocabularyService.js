// src/utils/vocabularyService.js

/**
 * @module vocabularyService
 * @description Service for loading and managing vocabulary data.
 * Vocabulary files are expected to be in: public/data/vocabulary/dictionary/{lang}/{level}.js
 * Each .js file should export a const named 'vocabulary' which is an object,
 * where keys are themes and values are arrays of vocabulary items.
 * Example el/a0.js:
 * export const vocabulary = {
 *   "Greetings": [ { id: "greet001", term: "Γεια", ... } ],
 *   "Numbers": [ { id: "num001", term: "Ένα", ... } ]
 * };
 */

const CEFR_LEVELS = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
const vocabularyCache = new Map(); // Cache to store loaded vocabulary data: Map<"lang-level", themedVocabularyObject>

/**
 * Loads vocabulary data for a specific language and CEFR level.
 * Uses dynamic import() to load the .js vocabulary files.
 * Handles caching to avoid redundant loads.
 *
 * @param {string} lang - The language code (e.g., 'el', 'en', 'fr').
 * @param {string} level - The CEFR level (e.g., 'a0', 'a1').
 * @returns {Promise<object|null>} A promise that resolves to the themed vocabulary object 
 *                                (e.g., { "Theme1": [item1, item2], "Theme2": [...] }) 
 *                                or null if loading fails or file doesn't exist.
 * @throws {Error} If language or level is not provided.
 */
export async function loadVocabularyForLanguageLevel(lang, level) {
    if (!lang || !level) {
        console.error('VocabularyService: Language and level are required.');
        throw new Error('Language and level are required.');
    }

    const langLower = lang.toLowerCase();
    const levelLower = level.toLowerCase();
    const cacheKey = `${langLower}-${levelLower}`;

    if (vocabularyCache.has(cacheKey)) {
        // console.log(`VocabularyService: Returning cached data for ${langLower} ${levelLower}`);
        return vocabularyCache.get(cacheKey);
    }

    // console.log(`VocabularyService: Attempting to load vocabulary for ${langLower} ${levelLower}`);
    try {
        // Note: Vite/Webpack handles public directory paths.
        // For dynamic imports from public, the path needs to be relative to the public folder.
        // If the dictionary files are in `public/data/vocabulary/dictionary/`,
        // and this service is in `src/utils/`, the relative path from the built `index.html` (root)
        // to the public assets would be something like `/data/vocabulary/dictionary/...`
        // The `import()` path is relative to the current file if it's a relative path,
        // but for assets intended to be served, absolute paths from the public root are better.
        // Vite specific: For assets in `public`, they are served from root.
        // So, the path should be like `/data/vocabulary/dictionary/${langLower}/${levelLower}.js`
        const module = await import(`/data/vocabulary/dictionary/${langLower}/${levelLower}.js`);
        
        if (module && module.vocabulary) {
            // console.log(`VocabularyService: Successfully loaded vocabulary for ${langLower} ${levelLower}`);
            vocabularyCache.set(cacheKey, module.vocabulary);
            return module.vocabulary;
        } else {
            console.warn(`VocabularyService: 'vocabulary' export not found in ${langLower}/${levelLower}.js`);
            vocabularyCache.set(cacheKey, null); // Cache null to avoid re-fetching known missing data
            return null;
        }
    } catch (error) {
        console.warn(`VocabularyService: Failed to load vocabulary for ${langLower} ${levelLower}.js. Error: ${error.message}`);
        // It's common for some levels not to exist, so we treat this as a non-critical warning for individual files.
        vocabularyCache.set(cacheKey, null); // Cache null to avoid re-fetching known missing data
        return null;
    }
}

/**
 * Retrieves all vocabulary items for a given language and level, flattened into a single list.
 * Each item in the list is augmented with 'level' and 'theme' properties.
 *
 * @param {string} lang - The language code.
 * @param {string} level - The CEFR level.
 * @returns {Promise<Array<object>>} A promise that resolves to a flat array of vocabulary items.
 *                                    Returns an empty array if loading fails or no data.
 */
export async function getAllVocabularyAsFlatList(lang, level) {
    const themedVocabulary = await loadVocabularyForLanguageLevel(lang, level);
    if (!themedVocabulary) {
        return [];
    }

    const flatList = [];
    for (const theme in themedVocabulary) {
        if (Object.hasOwnProperty.call(themedVocabulary, theme)) {
            const items = themedVocabulary[theme];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    flatList.push({
                        ...item,
                        level: item.level || level.toUpperCase(), // Ensure level is present
                        theme: item.theme || theme, // Ensure theme is present
                    });
                });
            }
        }
    }
    return flatList;
}

/**
 * Retrieves all vocabulary items for a specific theme within a given language and level.
 *
 * @param {string} lang - The language code.
 * @param {string} level - The CEFR level.
 * @param {string} themeName - The name of the theme.
 * @returns {Promise<Array<object>|null>} A promise that resolves to an array of vocabulary items for the theme,
 *                                         or null if the theme or level data is not found.
 */
export async function getVocabularyByTheme(lang, level, themeName) {
    const themedVocabulary = await loadVocabularyForLanguageLevel(lang, level);
    if (!themedVocabulary || !themedVocabulary[themeName]) {
        // console.warn(`VocabularyService: Theme "${themeName}" not found for ${lang} ${level}.`);
        return null;
    }
    return themedVocabulary[themeName].map(item => ({
        ...item,
        level: item.level || level.toUpperCase(),
        theme: item.theme || themeName,
    }));
}

/**
 * Loads and flattens vocabulary for all CEFR levels for a given language.
 * Primarily intended for tools like a comprehensive dictionary.
 *
 * @param {string} lang - The language code.
 * @returns {Promise<Array<object>>} A promise that resolves to a flat array of all vocabulary items
 *                                    for the language across all levels.
 */
export async function loadAllLevelsForLanguageAsFlatList(lang) {
    let combinedVocabulary = [];
    // console.log(`VocabularyService: Loading all levels for language ${lang}`);
    for (const level of CEFR_LEVELS) {
        try {
            // console.log(`VocabularyService: - Attempting level ${level} for ${lang}`);
            const levelVocab = await getAllVocabularyAsFlatList(lang, level);
            if (levelVocab && levelVocab.length > 0) {
                combinedVocabulary = [...combinedVocabulary, ...levelVocab];
                // console.log(`VocabularyService: - Loaded ${levelVocab.length} items for ${lang} ${level}. Total so far: ${combinedVocabulary.length}`);
            } else {
                // console.log(`VocabularyService: - No vocabulary found for ${lang} ${level} or already logged as failed.`);
            }
        } catch (error) {
            // Errors are logged by getAllVocabularyAsFlatList/loadVocabularyForLanguageLevel
            // console.warn(`VocabularyService: Error processing level ${level} for language ${lang}: ${error.message}`);
        }
    }
    // console.log(`VocabularyService: Finished loading all levels for ${lang}. Total items: ${combinedVocabulary.length}`);
    return combinedVocabulary;
}

/**
 * Clears the vocabulary cache.
 */
export function clearVocabularyCache() {
    vocabularyCache.clear();
    // console.log("VocabularyService: Cache cleared.");
}

// Example Usage (for testing in browser console or if run directly with a test harness)
/*
async function testService() {
    console.log("Testing Vocabulary Service...");

    try {
        console.log("\\n--- Loading Greek A0 ---");
        const grA0 = await loadVocabularyForLanguageLevel('el', 'a0');
        if (grA0) console.log("Greek A0 Themed:", JSON.stringify(Object.keys(grA0), null, 2));
        
        console.log("\\n--- Loading Greek A0 (cached) ---");
        await loadVocabularyForLanguageLevel('el', 'a0');


        console.log("\\n--- Loading Greek A1 Flat List ---");
        const grA1Flat = await getAllVocabularyAsFlatList('el', 'a1');
        if (grA1Flat.length > 0) console.log("Greek A1 Flat (first 2):", JSON.stringify(grA1Flat.slice(0, 2), null, 2));
        else console.log("Greek A1 Flat: No items found or error.");

        console.log("\\n--- Loading Greek A0, Theme 'Greetings' ---");
        const grA0Greetings = await getVocabularyByTheme('el', 'a0', 'Greetings');
        if (grA0Greetings) console.log("Greek A0 Greetings:", JSON.stringify(grA0Greetings, null, 2));
        else console.log("Greek A0 Greetings: Theme not found or error.");
        
        console.log("\\n--- Loading all levels for Greek (flat list) ---");
        const allGreek = await loadAllLevelsForLanguageAsFlatList('el');
        console.log(`Total Greek vocabulary items loaded: ${allGreek.length}`);
        if (allGreek.length > 0) console.log("Sample all Greek (first 2):", JSON.stringify(allGreek.slice(0,2), null, 2));

        console.log("\\n--- Loading non-existent level (el, c5) ---");
        const elC5 = await loadVocabularyForLanguageLevel('el', 'c5');
        if (!elC5) console.log("Correctly returned null for el-c5");

        console.log("\\n--- Clearing cache ---");
        clearVocabularyCache();
        const grA0_after_clear = await loadVocabularyForLanguageLevel('el', 'a0'); // Should re-fetch
        if (grA0_after_clear) console.log("Greek A0 Themed (after clear):", !!grA0_after_clear);


    } catch (error) {
        console.error("Error during service test:", error);
    }
}

// testService(); // Uncomment to run test in browser console after ensuring files exist
*/
