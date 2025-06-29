import { shuffleArray } from './arrayUtils';
import { capitalizeWord, escapeRegExp } from './stringUtils';
import { loadVocabularyData } from './exerciseDataService'; // For fetching vocabulary for objects

// This will hold translations, to be populated ideally by I18nContext or similar
// For now, using a simple placeholder. In a real app, this should be managed by an i18n solution.
let currentTranslations = {
    COSYenglish: {
        defaultAdjective: "happy",
        defaultNounWithArticle: "a cat",
        defaultNoun: "cat",
        defaultAdverb: "well",
        infinitiveMarker: "to ",
        verbToBe: "to be",
        verbToHave: "to have",
        negationParticle: "not",
        pronoun_they: "they",
        pronoun_he: "he",
        pronoun_she: "she",
        pronoun_it: "it",
        conjunction_and: "and",
        commonNames: ["Alex", "Maria", "Sam", "Lee", "Jordan", "Taylor", "Chris", "Pat"],
        genericObjectFallback: "something",
        pluralPronounsList: ['we', 'they', 'you'], // Simplified for example
        sentenceEndingAdjective: "happy.",
        sentenceEndingAdverb: "well.",
        errorFallbackWord: "error",
    }
};

// Function to update translations if needed (e.g., from context)
export function setGrammarGeneratorTranslations(translations) {
    currentTranslations = translations;
}

const COMMON_NAMES_EN = ["Alex", "Maria", "Sam", "Lee", "Jordan", "Taylor", "Chris", "Pat"];

function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

// Adapted from old grammar.js - specific to English for now
function addIndefiniteArticle(nounStr, language) {
    const t = currentTranslations[language] || currentTranslations.COSYenglish || {};
    if (language !== 'COSYenglish' || typeof nounStr !== 'string' || nounStr.trim() === '') {
        return nounStr;
    }
    const trimmedNoun = nounStr.trim();
    const articleRegex = /^(a|an|the)\s/i;
    if (articleRegex.test(trimmedNoun)) { return nounStr; }
    const lowerNoun = trimmedNoun.toLowerCase();
    const pronounsAndSomeNames = ['i', 'you', 'he', 'she', 'it', 'we', 'they', ...(t.commonNames || COMMON_NAMES_EN).map(n => n.toLowerCase())];
    if (pronounsAndSomeNames.includes(lowerNoun)) { return nounStr; }
    if (trimmedNoun.endsWith('s') && !trimmedNoun.endsWith('ss')) {
        const knownSingularSEndings = ['bus', 'gas', 'lens', 'plus', 'status', 'species', 'series', 'news'];
        if (!knownSingularSEndings.includes(lowerNoun)) { return nounStr; }
    }
    const firstLetter = trimmedNoun.charAt(0).toLowerCase();
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const exceptionsAn = ['hour', 'honest', 'honor', 'heir'];
    const exceptionsA = ['user', 'university', 'uniform', 'european', 'one', 'unit'];
    if (exceptionsAn.some(ex => lowerNoun.startsWith(ex))) return `an ${trimmedNoun}`;
    if (exceptionsA.some(ex => lowerNoun.startsWith(ex))) return `a ${trimmedNoun}`;
    if (vowels.includes(firstLetter)) { return `an ${trimmedNoun}`; }
    else { return `a ${trimmedNoun}`; }
}

async function selectSubject(language, verbData, vocabularyList, allowCompound = true) {
    const t = currentTranslations[language] || currentTranslations.COSYenglish || {};
    const typeRoll = Math.random();
    let subject = { text: "it", type: "pronoun", isPlural: false, representativePronoun: "it" };

    const availablePronouns = [...new Set(verbData.map(vd => vd.pronoun).filter(p => p && !p.includes('/')))];
    const simpleNouns = vocabularyList.filter(v => typeof v === 'string' && v.length > 1 && v.split(' ').length === 1);
    const knownVerbForms = new Set(verbData.map(vd => vd.form.toLowerCase()));
    const potentialNouns = simpleNouns.filter(n => !knownVerbForms.has(n.toLowerCase()));
    let namesForLang = (t.commonNames && t.commonNames.length > 0) ? t.commonNames : (language === 'COSYenglish' ? COMMON_NAMES_EN : []);

    if (typeRoll < 0.4 && availablePronouns.length > 0) {
        const chosenPronoun = getRandomElement(availablePronouns);
        subject.text = chosenPronoun;
        subject.type = "pronoun";
        const pluralPronouns = t.pluralPronounsList || ['we', 'they', 'you', 'nous', 'vous', 'ils', 'elles', 'wir', 'ihr', 'sie', 'voi', 'loro', 'nosotros', 'vosotros', 'ellos', 'ellas', 'ustedes', 'nós', 'vós', 'eles', 'elas', 'мы', 'вы', 'они', 'me', 'te', 'he'];
        const singularPronouns = ['i', 'he', 'she', 'it', 'je', 'tu', 'il', 'elle', 'on', 'ich', 'du', 'er', 'es', 'io', 'lui', 'lei', 'yo', 'tú', 'él', 'ella', 'usted', 'eu', 'ele', 'ela', 'você', 'я', 'ты', 'он', 'она', 'оно', 'minä', 'sinä', 'hän'];
        if (pluralPronouns.includes(chosenPronoun?.toLowerCase())) subject.isPlural = true;
        if (singularPronouns.includes(chosenPronoun?.toLowerCase())) subject.isPlural = false;
        subject.representativePronoun = chosenPronoun.toLowerCase();
    } else if (typeRoll < 0.8 && (potentialNouns.length > 0 || namesForLang.length > 0)) {
        const nounSourceRoll = Math.random();
        let chosenNoun;
        if (nounSourceRoll < 0.7 && potentialNouns.length > 0) {
            chosenNoun = getRandomElement(potentialNouns);
        } else if (namesForLang.length > 0) {
            chosenNoun = getRandomElement(namesForLang);
        } else {
            chosenNoun = getRandomElement(potentialNouns);
        }
        subject.text = namesForLang.includes(chosenNoun) ? chosenNoun : chosenNoun.toLowerCase();
        subject.type = "noun";
        subject.isPlural = false;
        if (subject.text.endsWith('s') && !subject.text.endsWith('ss') && !namesForLang.includes(subject.text)) {
            const knownSingularSEndings = ['bus', 'gas', 'lens', 'plus', 'status', 'species', 'series', 'news', 'always', 'this', 'is', 'has', 'does', 'goes'];
            if (!knownSingularSEndings.includes(subject.text.toLowerCase())) {
                subject.isPlural = true;
            }
        }
        subject.representativePronoun = subject.isPlural ? (t.pronoun_they || "they") : (namesForLang.includes(subject.text) ? (Math.random() < 0.5 ? (t.pronoun_he || "he") : (t.pronoun_she || "she")) : (t.pronoun_it || "it"));
    } else if (allowCompound && potentialNouns.length >= 2 && typeRoll < 0.95) {
        let noun1Raw = getRandomElement(potentialNouns);
        let noun2Raw = getRandomElement(potentialNouns.filter(n => n !== noun1Raw));
        if (!noun2Raw) noun2Raw = getRandomElement(namesForLang.filter(n => n !== noun1Raw)) || (potentialNouns.length > 0 ? potentialNouns[0] : (t.noun_friends || "friends"));
        const noun1 = namesForLang.includes(noun1Raw) ? noun1Raw : noun1Raw.toLowerCase();
        const noun2 = namesForLang.includes(noun2Raw) ? noun2Raw : noun2Raw.toLowerCase();
        subject.text = `${noun1} ${t.conjunction_and || 'and'} ${noun2}`;
        subject.type = "noun_compound_and";
        subject.isPlural = true;
        subject.representativePronoun = (t.pronoun_they || "they");
    } else {
        const chosenPronoun = getRandomElement(availablePronouns) || (t.pronoun_they || (language === 'COSYenglish' ? "they" : "ils"));
        subject.text = chosenPronoun;
        subject.type = "pronoun";
        const pluralPronouns = t.pluralPronounsList || ['we', 'they', 'you'];
        subject.isPlural = pluralPronouns.includes(chosenPronoun.toLowerCase());
        subject.representativePronoun = chosenPronoun.toLowerCase();
    }
    if (subject.type === "noun") {
         subject.representativePronoun = subject.isPlural ? (t.pronoun_they || "they") : (namesForLang.includes(subject.text) ? (Math.random() < 0.5 ? (t.pronoun_he || "he") : (t.pronoun_she || "she")) : (t.pronoun_it || "it"));
    }
    return subject;
}

async function selectObject(language, vocabularyList, subjectText = "") {
    const t = currentTranslations[language] || currentTranslations.COSYenglish || {};
    const potentialObjects = vocabularyList.filter(v => typeof v === 'string' && v.length > 1 && v.toLowerCase() !== subjectText.toLowerCase());
    if (potentialObjects.length === 0) {
        return t.genericObjectFallback || "something";
    }
    const chosenObject = getRandomElement(potentialObjects);
    const namesForLang = (t.commonNames && t.commonNames.length > 0) ? t.commonNames : (language === 'COSYenglish' ? COMMON_NAMES_EN : []);
    return namesForLang.includes(chosenObject) ? chosenObject : chosenObject.toLowerCase();
}


/**
 * Processes raw verb data items to derive necessary fields like pronoun, form, verb,
 * full_sentence, and sentence_template. This mirrors the processing logic from the
 * old `loadVerbGrammar` function in `grammar.js`.
 * @param {Array<Object>} rawVerbItems - Array of verb items as loaded from JSON.
 * @param {string} language - The current COSYlanguage code.
 * @returns {Array<Object>} Processed verb items.
 */
export function processVerbData(rawVerbItems, language) {
    const t = currentTranslations[language] || currentTranslations.COSYenglish || {};
    let processedVerbData = [];
    let seenItems = new Set();

    rawVerbItems.forEach(rawItem => {
        let item = { ...rawItem };
        let sPrompt = rawItem.prompt;
        if (Array.isArray(sPrompt)) sPrompt = sPrompt.join('/');
        sPrompt = (sPrompt === null || sPrompt === undefined) ? "" : String(sPrompt);

        let sAnswer = rawItem.answer;
        if (Array.isArray(sAnswer)) sAnswer = sAnswer.join('/');
        sAnswer = (sAnswer === null || sAnswer === undefined) ? "" : String(sAnswer);
        
        item.promptType = 'pronoun_verb_expects_form'; // Default

        if (sPrompt && sAnswer) {
            const commonPronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'yo', 'tú', 'él', 'ella', 'usted', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'ustedes', 'eu', 'tu', 'ele', 'ela', 'você', 'nós', 'vós', 'eles', 'elas', 'vocês', 'я', 'ты', 'он', 'она', 'оно', 'мы', 'вы', 'они', 'minä', 'sinä', 'hän'];
            let langSpecificLength = 3; // Default pronoun max length for check
            if (language === 'COSYfrançais' || language === 'COSYitaliano') langSpecificLength = 2;
            
            const isPromptPronounLike = commonPronouns.includes(sPrompt.toLowerCase()) || sPrompt.length <= langSpecificLength;

            if (isPromptPronounLike) {
                item.pronoun = sPrompt;
                item.form = sAnswer; // This is the conjugated verb form
                item.promptType = 'pronoun_expects_form';
            } else {
                const isAnswerPronounLike = commonPronouns.includes(sAnswer.toLowerCase()) || sAnswer.length <= langSpecificLength || sAnswer.includes('/');
                if (isAnswerPronounLike) {
                    item.form = sPrompt; // This is the conjugated verb form
                    item.pronoun = sAnswer;
                    item.promptType = 'form_expects_pronoun';
                } else { 
                    // Default assumption if neither looks like a pronoun
                    item.pronoun = sPrompt; // Assume prompt is pronoun-like
                    item.form = sAnswer;   // Assume answer is verb form
                }
            }
        } else { // If prompt or answer is missing, try to assign directly
            item.pronoun = sPrompt;
            item.form = sAnswer;
        }

        if (!item.verb) { // Infer verb if not present
            let baseWordForVerbInference = item.form; // Usually the conjugated form helps infer infinitive
            if (baseWordForVerbInference) {
                const toBeForms = ['am', 'is', 'are', 'was', 'were', 'est', 'sont', 'être', 'es', 'son', 'ser', 'είμαι', 'είσαι', 'είναι', 'быть', 'был', 'была', 'было', 'были'];
                const toHaveForms = ['have', 'has', 'had', 'a', 'ont', 'avoir', 'tiene', 'tienen', 'tener', 'tem', 'têm', 'ter', 'έχω', 'έχει', 'иметь', 'имел', 'имела'];
                const infinitiveMarker = t.infinitiveMarker || (language === 'COSYenglish' ? 'to ' : '');
                const verbToBe = t.verbToBe || 'to be';
                const verbToHave = t.verbToHave || 'to have';

                if (toBeForms.includes(baseWordForVerbInference.toLowerCase())) item.verb = verbToBe;
                else if (toHaveForms.includes(baseWordForVerbInference.toLowerCase())) item.verb = verbToHave;
                else { // Basic inference for other verbs (language-specific rules would be better)
                    let potentialInfinitive = baseWordForVerbInference.toLowerCase();
                    if (language === 'COSYenglish') {
                        if (potentialInfinitive.endsWith('s') && !['is', 'was', 'has', 'does', 'goes'].includes(potentialInfinitive) && !potentialInfinitive.endsWith('ss')) {
                           potentialInfinitive = potentialInfinitive.slice(0, -1);
                        } else if (potentialInfinitive.endsWith('ed')) {
                           potentialInfinitive = potentialInfinitive.slice(0, -2);
                        } else if (potentialInfinitive.endsWith('ing')) {
                           potentialInfinitive = potentialInfinitive.slice(0, -3);
                        }
                    }
                    item.verb = `${infinitiveMarker}${potentialInfinitive}`;
                }
            }
        }
        
        // Ensure crucial fields are present
        if (!item.pronoun || !item.verb || !item.form) {
            // console.warn("Skipping verb item due to missing core fields:", rawItem);
            return; // Skips this iteration of forEach
        }
        
        if (!item.full_sentence) {
            let objectPart = t.defaultAdjective || "happy";
            if (item.verb && (item.verb.toLowerCase() === (t.verbToHave || 'to have').toLowerCase())) objectPart = t.defaultNounWithArticle || (language === 'COSYenglish' ? "a cat" : (t.defaultNoun || "cat"));
            else if (item.verb && (item.verb.toLowerCase() !== (t.verbToBe || 'to be').toLowerCase())) objectPart = t.defaultAdverb || "well";
            item.full_sentence = `${item.pronoun} ${item.form} ${objectPart}.`;
        }

        if (!item.sentence_template) {
             const formEscaped = escapeRegExp(item.form);
             const formRegex = new RegExp(`\\b${formEscaped}\\b`, 'i');
             item.sentence_template = item.full_sentence.replace(formRegex, "___");
             if (!item.sentence_template.includes("___")) { // Fallback if regex replace failed
                let parts = item.full_sentence.split(' ');
                let formIndex = parts.findIndex(p => p.toLowerCase() === item.form.toLowerCase());
                if (formIndex !== -1) {
                    parts[formIndex] = "___";
                    item.sentence_template = parts.join(' ');
                } else { 
                    // More robust fallback: place blank after pronoun if form not found
                    item.sentence_template = `${item.pronoun} ___ .`; 
                }
             }
        }
        // Use a consistent key for uniqueness check
        const stringifiedItemKey = JSON.stringify({pronoun: item.pronoun, verb: item.verb, form: item.form, promptType: item.promptType});
        if (!seenItems.has(stringifiedItemKey)) {
            seenItems.add(stringifiedItemKey);
            processedVerbData.push(item); 
        }
    });
    return processedVerbData;
}


export async function generateGrammarExerciseSentence(language, days, allProcessedVerbData, dailyVocab) {
    const t = currentTranslations[language] || currentTranslations.COSYenglish || {};
    if (!allProcessedVerbData || allProcessedVerbData.length === 0) {
        console.error("generateGrammarExerciseSentence: No processed verb data provided for language " + language);
        return null;
    }
    
    let currentDailyVocab = dailyVocab;
    if (!currentDailyVocab || currentDailyVocab.length === 0) {
        // console.warn(`generateGrammarExerciseSentence: No daily vocabulary for ${language}. Fetching fallback.`);
        // In a real scenario, TypeVerbExercise would fetch this. For the util, we assume it's passed or use very basic fallbacks.
        const {data: vocabWords } = await loadVocabularyData(language, days); // Fetch if not provided
        currentDailyVocab = vocabWords.length > 0 ? vocabWords : [t.genericNoun1 || "book", t.genericNoun2 || "pen", t.genericAdjective1 || "interesting"];
    }

    const sentencePatterns = [
        { type: "SVO", structure: ["S", "V", "O"], needsAux: false, isQuestion: false },
        { type: "SVNegO", structure: ["S", "V(neg)", "O"], needsAux: true, isQuestion: false },
        { type: "Q_AuxSVO", structure: ["Aux", "S", "V_base", "O?"], needsAux: true, isQuestion: true },
        { type: "Q_BeSVO", structure: ["V_be", "S", "O?"], needsAux: false, isQuestion: true }
    ];

    let selectedPattern = getRandomElement(sentencePatterns);
    if (!selectedPattern) return null;

    const subjectDetails = await selectSubject(language, allProcessedVerbData, currentDailyVocab);
    let objectText = await selectObject(language, currentDailyVocab, subjectDetails.text);

    let verbInfo = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts && !verbInfo) {
        const randomVerbEntry = getRandomElement(allProcessedVerbData);
        if (!randomVerbEntry || !randomVerbEntry.verb || !randomVerbEntry.pronoun || !randomVerbEntry.form) {
            attempts++; continue;
        }
        const verbPronouns = randomVerbEntry.pronoun.toLowerCase().split('/');
        const representativePronoun = subjectDetails.representativePronoun.toLowerCase();

        if (verbPronouns.includes(representativePronoun)) {
            let suitableForPattern = true;
            if (selectedPattern.type === "Q_BeSVO" && randomVerbEntry.verb.toLowerCase() !== (t.verbToBe || 'to be').toLowerCase()) {
                suitableForPattern = false;
            } else if (selectedPattern.type === "Q_AuxSVO" && randomVerbEntry.verb.toLowerCase() === (t.verbToBe || 'to be').toLowerCase()) {
                suitableForPattern = false;
            }
            if (suitableForPattern) {
                verbInfo = { base: randomVerbEntry.verb, conjugated: randomVerbEntry.form, isBeOrHave: randomVerbEntry.verb.toLowerCase() === (t.verbToBe || 'to be').toLowerCase() || randomVerbEntry.verb.toLowerCase() === (t.verbToHave || 'to have').toLowerCase(), fullItem: randomVerbEntry };
                break;
            }
        }
        attempts++;
    }
    
    if (!verbInfo) { // Fallback: pick any verb and adjust subject
        const anyVerbFromPool = getRandomElement(allProcessedVerbData);
        if (anyVerbFromPool) {
            verbInfo = { base: anyVerbFromPool.verb, conjugated: anyVerbFromPool.form, isBeOrHave: anyVerbFromPool.verb.toLowerCase() === (t.verbToBe || 'to be').toLowerCase() || anyVerbFromPool.verb.toLowerCase() === (t.verbToHave || 'to have').toLowerCase(), fullItem: anyVerbFromPool };
            subjectDetails.text = anyVerbFromPool.pronoun.split('/')[0];
            subjectDetails.representativePronoun = subjectDetails.text.toLowerCase();
            const pluralPronouns = t.pluralPronounsList || ['we', 'they', 'you'];
            subjectDetails.isPlural = pluralPronouns.includes(subjectDetails.representativePronoun);
        } else {
            console.error("generateGrammarExerciseSentence: Could not find any verb even after fallback.");
            return null;
        }
    }

    let sentenceComponents = [];
    let S_final = subjectDetails.text;
    let O_final = objectText;

    if (selectedPattern.type === "Q_BeSVO" && language === 'COSYenglish') {
        const namesForLangLower = ((t.commonNames || COMMON_NAMES_EN).map(n => n.toLowerCase()));
        if (subjectDetails.type === "noun" && !namesForLangLower.includes(S_final.toLowerCase())) {
            S_final = addIndefiniteArticle(S_final, language);
        }
        const isObjectLikelySimpleNounForArticle = (currentDailyVocab.map(w => w.toLowerCase()).includes(objectText.toLowerCase()) || (t.exampleNounsForArticle || ["book", "cat", "pen", "apple"]).includes(objectText.toLowerCase())) && objectText.split(' ').length === 1 && !namesForLangLower.includes(objectText.toLowerCase());
        if (isObjectLikelySimpleNounForArticle) {
            O_final = addIndefiniteArticle(objectText, language);
        }
    }
    
    const V_conj = verbInfo.conjugated;
    const V_base_inf = verbInfo.base.startsWith(t.infinitiveMarker || (language === 'COSYenglish' ? 'to ' : '')) ? verbInfo.base.substring((t.infinitiveMarker || (language === 'COSYenglish' ? 'to ' : '')).length) : verbInfo.base;
    let aux = "";

    if (language === 'COSYenglish') { // Language-specific auxiliary logic
        if (selectedPattern.type === "SVNegO") {
            if (!verbInfo.isBeOrHave) { // "do not" / "does not"
                aux = subjectDetails.isPlural || ['i', 'you'].includes(subjectDetails.representativePronoun.toLowerCase()) ? "do" : "does";
            } // For "be/have", negation is direct: "is not", "has not"
        } else if (selectedPattern.type === "Q_AuxSVO") {
            aux = subjectDetails.isPlural || ['i', 'you'].includes(subjectDetails.representativePronoun.toLowerCase()) ? "Do" : "Does";
        }
    }
    // Simplified sentence construction based on pattern
    // This part needs careful porting of the logic from grammar.js's generateSentenceForExercise
    switch (selectedPattern.type) {
        case "SVO":
            sentenceComponents = [S_final, V_conj, O_final];
            break;
        case "SVNegO":
            if (language === 'COSYenglish' && aux) { // e.g. "They do not like cats"
                sentenceComponents = [S_final, aux, (t.negationParticle || "not"), V_base_inf, O_final];
            } else if (verbInfo.isBeOrHave) { // e.g. "He is not happy"
                 sentenceComponents = [S_final, V_conj, (t.negationParticle || "not"), O_final];
            } else { // Non-english or verbs that don't use "do" aux for negation
                sentenceComponents = [S_final, V_conj, (t.negationParticle || "not"), O_final]; // Fallback or other languages
            }
            break;
        case "Q_AuxSVO": // e.g. "Do they like cats?"
            if (language === 'COSYenglish' && aux) {
                sentenceComponents = [aux, S_final, V_base_inf, O_final];
            } else { // Fallback for non-english or if aux logic is different
                sentenceComponents = [V_conj, S_final, O_final]; 
            }
            break;
        case "Q_BeSVO": // e.g. "Is he happy?"
            sentenceComponents = [V_conj, S_final, O_final];
            break;
        default: return null;
    }

    let finalCasedComponents = sentenceComponents.filter(c => c).map((word, index) => { // filter out null/empty aux
        if (typeof word !== 'string') return word;
        const namesForLang = (t.commonNames && t.commonNames.length > 0) ? t.commonNames : (language === 'COSYenglish' ? COMMON_NAMES_EN : []);
        if (namesForLang.includes(word)) return word;
        if (language === 'COSYenglish' && word.toLowerCase() === 'i') return 'I';
        return (index === 0) ? capitalizeWord(word, true, language) : word;
    });

    const finalPunctuation = selectedPattern.isQuestion ? "?" : ".";
    let correctSentence = finalCasedComponents.join(" ") + finalPunctuation;
    
    // Determine what to blank out
    let wordToBlankOriginal = '';
    let indexOfBlankInCased = -1;
    const blankTypeRoll = Math.random();

    if (blankTypeRoll < 0.5 && V_conj) { // Blank the main verb (conjugated or base)
        wordToBlankOriginal = (selectedPattern.type === "SVNegO" && language === 'COSYenglish' && aux) || (selectedPattern.type === "Q_AuxSVO" && language === 'COSYenglish' && aux) ? V_base_inf : V_conj;
    } else if (blankTypeRoll < 0.75 && subjectDetails.type !== "pronoun" && S_final) { // Blank subject if not pronoun
        wordToBlankOriginal = S_final;
    } else if (O_final) { // Blank object
        wordToBlankOriginal = O_final;
    } else if (V_conj) { // Fallback to verb if object was blanked but missing
        wordToBlankOriginal = (selectedPattern.type === "SVNegO" && language === 'COSYenglish' && aux) || (selectedPattern.type === "Q_AuxSVO" && language === 'COSYenglish' && aux) ? V_base_inf : V_conj;
    } else { // Ultimate fallback
        wordToBlankOriginal = finalCasedComponents.length > 1 ? finalCasedComponents[1] : finalCasedComponents[0];
    }
    
    // Find the cased version of the word to blank
    let tempSentenceForTemplate = [...finalCasedComponents];
    const casedWordToBlank = finalCasedComponents.find(w => w.toLowerCase() === wordToBlankOriginal.toLowerCase());
    
    if(casedWordToBlank){
        indexOfBlankInCased = finalCasedComponents.indexOf(casedWordToBlank);
        tempSentenceForTemplate[indexOfBlankInCased] = "___";
    } else if (finalCasedComponents.length > 0) { // Fallback if exact cased match not found
        indexOfBlankInCased = finalCasedComponents.length > 1 ? 1 : 0;
        wordToBlankOriginal = finalCasedComponents[indexOfBlankInCased]; // update original to what's actually blanked
        tempSentenceForTemplate[indexOfBlankInCased] = "___";
    } else {
        return { questionPrompt: "___" + finalPunctuation, answer: t.errorFallbackWord || "error", correctSentence: t.errorFallbackWord + finalPunctuation };
    }

    let sentenceTemplate = tempSentenceForTemplate.join(" ") + finalPunctuation;

    return {
        questionPrompt: sentenceTemplate.trim(),
        answer: wordToBlankOriginal.trim(), // This should be the non-cased, original form intended for the blank
        correctSentence: correctSentence.trim(),
        // For debugging or more complex hints:
        // rawSubject: subjectDetails,
        // rawVerb: verbInfo,
        // rawObject: objectText,
        // sentenceComponents: finalCasedComponents,
    };
}
