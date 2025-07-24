/**
 * Processes raw conjugation data to make it more accessible for exercises.
 * @param {object} rawConjugationData - The raw data loaded from conjugation JSON files.
 * @param {string} language - The current COSYlanguage code.
 * @returns {Array<object>} A processed and structured list of verbs with their conjugations.
 */
export function processConjugationData(rawConjugationData, language) {
    // If the raw data is invalid, log an error and return an empty array.
    if (!rawConjugationData || !rawConjugationData.verbs || !Array.isArray(rawConjugationData.verbs)) {
        console.error(`processConjugationData: Invalid rawConjugationData for language ${language}. Expected an object with a 'verbs' array. Received:`, rawConjugationData);
        return [];
    }

    // Process each verb in the raw data.
    const processedVerbs = rawConjugationData.verbs.map(verb => {
        // If the verb is invalid, log a warning and skip it.
        if (!verb || typeof verb.infinitive !== 'string') {
            console.warn(`processConjugationData: Skipping a verb entry due to missing or invalid infinitive for language ${language}. Entry:`, verb);
            return null;
        }

        // Process each tense for the verb.
        const processedTenses = {};
        if (verb.tenses && typeof verb.tenses === 'object') {
            for (const tenseName in verb.tenses) {
                const tenseData = verb.tenses[tenseName];
                if (tenseData && tenseData.forms && typeof tenseData.forms === 'object') {
                    // Standardize the tense name to lowercase for consistent access.
                    const standardizedTenseName = tenseName.toLowerCase();
                    processedTenses[standardizedTenseName] = {
                        mood: tenseData.mood || 'N/A',
                        forms: tenseData.forms,
                        // Conditionally add optional properties if they exist.
                        ...(tenseData.auxiliary_verb && { auxiliary_verb: tenseData.auxiliary_verb }),
                        ...(tenseData.past_participle && { past_participle: tenseData.past_participle }),
                        ...(tenseData.agreement_rules && { agreement_rules: tenseData.agreement_rules }),
                    };
                }
            }
        }

        // Return the processed verb data.
        return {
            infinitive: verb.infinitive,
            translation_en: verb.translation_en || verb.infinitive,
            tags: Array.isArray(verb.tags) ? verb.tags : [],
            verb_group: verb.verb_group || null,
            tenses: processedTenses,
        };
    }).filter(verb => verb !== null); // Filter out any skipped verbs.

    return processedVerbs;
}
