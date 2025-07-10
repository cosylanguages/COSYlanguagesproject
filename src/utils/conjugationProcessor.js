// frontend/src/utils/conjugationProcessor.js

/**
 * Processes raw conjugation data to make it more accessible for exercises.
 * @param {Object} rawConjugationData - The raw data loaded from conjugation JSON files (e.g., conjugations_french.json).
 * @param {string} language - The current COSYlanguage code.
 * @returns {Array<Object>} Processed and structured list of verbs with their conjugations.
 *                          Each verb object will have:
 *                          - infinitive: string
 *                          - translation_en: string
 *                          - tags: Array<string> (e.g., ["irregular", "auxiliary"])
 *                          - verb_group: string (e.g., "-er") or null
 *                          - tenses: Object where keys are tense names (e.g., "présent")
 *                              and values are objects containing:
 *                              - mood: string (e.g., "indicatif")
 *                              - forms: Object where keys are pronouns (e.g., "je", "tu")
 *                                       and values are the conjugated verb forms (e.g., "suis", "es").
 *                              - (optional) auxiliary_verb: string
 *                              - (optional) past_participle: string
 *                              - (optional) agreement_rules: string
 */
export function processConjugationData(rawConjugationData, language) {
    if (!rawConjugationData || !rawConjugationData.verbs || !Array.isArray(rawConjugationData.verbs)) {
        console.error(`processConjugationData: Invalid rawConjugationData for language ${language}. Expected an object with a 'verbs' array. Received:`, rawConjugationData);
        return [];
    }

    const processedVerbs = rawConjugationData.verbs.map(verb => {
        if (!verb || typeof verb.infinitive !== 'string') {
            console.warn(`processConjugationData: Skipping a verb entry due to missing or invalid infinitive for language ${language}. Entry:`, verb);
            return null; // Skip this verb if essential info is missing
        }

        const processedTenses = {};
        if (verb.tenses && typeof verb.tenses === 'object') {
            for (const tenseName in verb.tenses) {
                const tenseData = verb.tenses[tenseName];
                if (tenseData && tenseData.forms && typeof tenseData.forms === 'object') {
                    // Standardize tense names to lowercase for consistent access
                    const standardizedTenseName = tenseName.toLowerCase();
                    processedTenses[standardizedTenseName] = {
                        mood: tenseData.mood || 'N/A',
                        forms: tenseData.forms,
                        // Conditionally add optional properties if they exist
                        ...(tenseData.auxiliary_verb && { auxiliary_verb: tenseData.auxiliary_verb }),
                        ...(tenseData.past_participle && { past_participle: tenseData.past_participle }),
                        ...(tenseData.agreement_rules && { agreement_rules: tenseData.agreement_rules }),
                    };
                } else {
                    // Optional: Log if a tense is malformed but still process the verb
                    // console.warn(`processConjugationData: Tense "${tenseName}" for verb "${verb.infinitive}" in ${language} is missing 'forms' or is invalid.`, tenseData);
                }
            }
        }

        return {
            infinitive: verb.infinitive,
            translation_en: verb.translation_en || verb.infinitive, // Fallback if translation_en is missing
            tags: Array.isArray(verb.tags) ? verb.tags : [], // Ensure tags is an array
            verb_group: verb.verb_group || null, // Include verb_group, defaulting to null
            tenses: processedTenses,
        };
    }).filter(verb => verb !== null); // Filter out any verbs that were skipped (returned as null)

    return processedVerbs;
}
