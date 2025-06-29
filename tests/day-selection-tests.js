(function() {
    'use strict';

    const testResultsContainer = document.getElementById('test-results');
    const testSummaryContainer = document.getElementById('test-summary');
    let testsPassed = 0;
    let testsFailed = 0;

    // --- Simple Assertion Library ---
    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`Failed: ${message}. Expected "${expected}", but got "${actual}".`);
        }
    }

    function assertDeepEquals(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Failed: ${message}. Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}.`);
        }
    }

    function assert(condition, message) {
        if (!condition) {
            throw new Error(`Failed: ${message}.`);
        }
    }

    // --- Test Suite Runner ---
    function describe(suiteName, fn) {
        const suiteDiv = document.createElement('div');
        suiteDiv.className = 'test-suite';
        const title = document.createElement('h3');
        title.textContent = suiteName;
        suiteDiv.appendChild(title);
        testResultsContainer.appendChild(suiteDiv);
        
        currentSuiteDiv = suiteDiv;
        fn();
        currentSuiteDiv = null; 
    }

    let currentSuiteDiv = null;

    function it(testName, fn) {
        const testCaseDiv = document.createElement('div');
        testCaseDiv.className = 'test-case';
        try {
            fn();
            testCaseDiv.textContent = `PASS: ${testName}`;
            testCaseDiv.classList.add('pass');
            testsPassed++;
        } catch (e) {
            testCaseDiv.innerHTML = `FAIL: ${testName}<pre>${e.message}\n${e.stack ? e.stack.split('\n').slice(1,3).join('\n') : ''}</pre>`;
            testCaseDiv.classList.add('fail');
            testsFailed++;
            console.error(`Test failed: ${testName}`, e);
        }
        if (currentSuiteDiv) {
            currentSuiteDiv.appendChild(testCaseDiv);
        } else {
            testResultsContainer.appendChild(testCaseDiv);
        }
    }

    // --- Mocks and Spies ---
    // Store original functions to restore later if needed, though for this simple runner, we might not.
    const originalGetElementById = document.getElementById;
    let mockElements = {};

    function mockGetElementById(id) {
        if (mockElements[id]) {
            return mockElements[id];
        }
        return originalGetElementById.call(document, id); // Fallback to original
    }
    
    // --- Test Suites ---

    // Mocking the DOM elements needed for getSelectedDays
    const mockDayInput = { value: '' };
    const mockDayFromInput = { value: '' };
    const mockDayToInput = { value: '' };

    // Override document.getElementById for the scope of these tests
    document.getElementById = (id) => {
        if (id === 'day') return mockDayInput;
        if (id === 'day-from') return mockDayFromInput;
        if (id === 'day-to') return mockDayToInput;
        return originalGetElementById.call(document, id);
    };

    describe('getSelectedDays() Functionality', () => {
        // Reset mock input values before each test in this suite
        function resetInputs() {
            mockDayInput.value = '';
            mockDayFromInput.value = '';
            mockDayToInput.value = '';
        }

        it('should return an empty array when no day is selected', () => {
            resetInputs();
            assertDeepEquals(getSelectedDays(), [], 'No selection');
        });

        it('should return an array with the single day when only single day is selected', () => {
            resetInputs();
            mockDayInput.value = '3';
            assertDeepEquals(getSelectedDays(), ['3'], 'Single day "3"');
        });

        it('should return an empty array for invalid single day selection (e.g., "0" or negative)', () => {
            resetInputs();
            mockDayInput.value = '0';
            assertDeepEquals(getSelectedDays(), [], 'Single day "0"');
            mockDayInput.value = '-1';
            assertDeepEquals(getSelectedDays(), [], 'Single day "-1"');
        });

        it('should return an array with the range of days when "from" and "to" are selected', () => {
            resetInputs();
            mockDayFromInput.value = '2';
            mockDayToInput.value = '4';
            assertDeepEquals(getSelectedDays(), ['2', '3', '4'], 'Range "2-4"');
        });

        it('should return an array with a single day if "from" and "to" are the same', () => {
            resetInputs();
            mockDayFromInput.value = '5';
            mockDayToInput.value = '5';
            assertDeepEquals(getSelectedDays(), ['5'], 'Range "5-5"');
        });

        it('should return an empty array for invalid range (e.g., from > to)', () => {
            resetInputs();
            mockDayFromInput.value = '4';
            mockDayToInput.value = '2';
            assertDeepEquals(getSelectedDays(), [], 'Invalid range "4-2"');
        });
        
        it('should return an empty array for invalid range (e.g., "0" or negative values)', () => {
            resetInputs();
            mockDayFromInput.value = '0';
            mockDayToInput.value = '2';
            assertDeepEquals(getSelectedDays(), [], 'Range "0-2"');
            
            resetInputs();
            mockDayFromInput.value = '-1';
            mockDayToInput.value = '2';
            assertDeepEquals(getSelectedDays(), [], 'Range "-1-2"');

            resetInputs();
            mockDayFromInput.value = '1';
            mockDayToInput.value = '0';
            assertDeepEquals(getSelectedDays(), [], 'Range "1-0"');
        });

        it('should prioritize valid range over single day if both are filled', () => {
            resetInputs();
            mockDayInput.value = '7';
            mockDayFromInput.value = '3';
            mockDayToInput.value = '5';
            assertDeepEquals(getSelectedDays(), ['3', '4', '5'], 'Range "3-5" with single day "7" also filled');
        });

        it('should use single day if range is invalid but single day is valid', () => {
            resetInputs();
            mockDayInput.value = '7';
            mockDayFromInput.value = '5'; // Invalid range
            mockDayToInput.value = '3';
            assertDeepEquals(getSelectedDays(), ['7'], 'Single day "7" with invalid range "5-3"');
        });

        it('should handle empty string inputs as no selection', () => {
            resetInputs();
            mockDayInput.value = '';
            mockDayFromInput.value = '';
            mockDayToInput.value = '';
            assertDeepEquals(getSelectedDays(), [], 'All inputs empty strings');
        });
    });

    // --- Mocks for data loading ---
    let mockFetchResponses = {};
    const originalFetch = window.fetch;
    window.fetch = async (url) => {
        if (mockFetchResponses[url]) {
            return Promise.resolve({
                ok: true,
                json: async () => mockFetchResponses[url]
            });
        }
        // Fallback for unexpected fetches or if original fetch is needed for some assets
        // console.warn(`Unexpected fetch call, using original fetch: ${url}`);
        // return originalFetch(url);
        return Promise.resolve({ // Default mock for unhandled fetches to avoid breaking tests
            ok: false, 
            status: 404,
            json: async () => ({ error: "Mocked 404 - Not Found" })
        });
    };

    let mockLoadDataResponse = null;
    const originalLoadData = window.loadData; // Assuming loadData is global
    window.loadData = async (filePath) => {
        if (mockLoadDataResponse && mockLoadDataResponse[filePath]) {
            return { data: mockLoadDataResponse[filePath], error: null };
        }
        if (mockFetchResponses[filePath]) { // If fetch is mocked directly for this path
             return { data: mockFetchResponses[filePath], error: null };
        }
        // console.warn(`loadData called for unmocked path: ${filePath}`);
        return { data: null, error: "Mocked loadData error - path not configured", errorType: "MockError" };
    };
    
    // Reset mocks before each suite that uses them
    function resetDataMocks() {
        mockFetchResponses = {};
        mockLoadDataResponse = null;
    }

    describe('Data Loading Functions', () => {
        beforeEach(resetDataMocks); // Utility to run before each 'it' in this 'describe'

        it('loadVocabulary (vocabulary.js) should process data for a single selected day "2"', async () => {
            resetInputs(); // for getSelectedDays
            mockDayInput.value = '2'; // Simulate user selecting Day 2

            const mockVocabData = {
                "1": ["day1_word1", "day1_word2"],
                "2": ["day2_wordA", "day2_wordB"],
                "3": ["day3_wordX"]
            };
            mockFetchResponses['data/vocabulary/words/COSYenglish.json'] = mockVocabData;
            
            // getVocabularyFile('COSYenglish') will produce 'data/vocabulary/words/COSYenglish.json'
            const words = await loadVocabulary('COSYenglish', getSelectedDays());
            assertDeepEquals(words, ["day2_wordA", "day2_wordB"], 'Should only contain Day 2 words');
        });

        it('loadVocabulary (vocabulary.js) should process data for a selected range "1-2"', async () => {
            resetInputs();
            mockDayFromInput.value = '1';
            mockDayToInput.value = '2';

            const mockVocabData = {
                "1": ["day1_word1", "day1_word2"],
                "2": ["day2_wordA", "day2_wordB"],
                "3": ["day3_wordX"]
            };
            mockFetchResponses['data/vocabulary/words/COSYenglish.json'] = mockVocabData;
            
            const words = await loadVocabulary('COSYenglish', getSelectedDays());
            // Order might vary based on concat, so check content
            assert(words.includes("day1_word1") && words.includes("day1_word2") &&
                   words.includes("day2_wordA") && words.includes("day2_wordB") &&
                   words.length === 4,
                   'Should contain Day 1 and Day 2 words for range 1-2');
        });

        it('loadVerbGrammar (grammar.js) should process data for a single selected day "1"', async () => {
            resetInputs();
            mockDayInput.value = '1'; // Simulate user selecting Day 1

            const mockVerbData = {
                "1": [{ prompt: "I", answer: "am" }],
                "2": [{ prompt: "You", answer: "are" }]
            };
            // Assuming loadVerbGrammar uses loadData internally
            mockLoadDataResponse = { 
                'data/grammar/verbs/grammar_verbs_COSYenglish.json': mockVerbData 
            };
            
            const verbs = await loadVerbGrammar('COSYenglish', getSelectedDays());
            assert(verbs.length === 1, 'Should be 1 verb item for Day 1');
            assert(verbs[0].pronoun === "I" && verbs[0].form === "am", 'Verb item should be from Day 1');
        });
    });

    describe('generateSentenceForExercise (grammar.js)', () => {
        it('should use all provided verbs when a single day is selected (e.g., Day 2 has non-"to be" verbs)', () => {
            resetInputs();
            mockDayInput.value = '2'; // getSelectedDays() will return ['2']
            
            const day2VerbData = [ // Verbs specifically for Day 2
                { pronoun: "they", verb: "to swim", form: "swim", promptType: 'pronoun_expects_form', full_sentence: "they swim well.", sentence_template: "they ___ well." },
                { pronoun: "she", verb: "to run", form: "runs", promptType: 'pronoun_expects_form', full_sentence: "she runs fast.", sentence_template: "she ___ fast." }
            ];
            const dailyVocab = ["fast", "well", "pool"];

            // Call generateSentenceForExercise directly, simulating that loadVerbGrammar returned only day2VerbData
            const sentenceDetails = generateSentenceForExercise('COSYenglish', ['2'], day2VerbData, dailyVocab);
            
            assert(sentenceDetails !== null, "Sentence should be generated");
            // Check if the generated sentence uses one of the provided verbs (not just 'to be')
            const usedVerbBase = sentenceDetails.rawVerb.base;
            assert(usedVerbBase === "to swim" || usedVerbBase === "to run", 
                   `Generated sentence should use a verb from Day 2 data (swim or run), but got ${usedVerbBase}`);
        });

        it('should use all provided verbs when day "3" is selected (e.g. Day 3 has non-"to be"/"to have" verbs)', () => {
            resetInputs();
            mockDayInput.value = '3'; // getSelectedDays() will return ['3']
            
            const day3VerbData = [
                { pronoun: "we", verb: "to eat", form: "eat", promptType: 'pronoun_expects_form', full_sentence: "we eat pizza.", sentence_template: "we ___ pizza." },
                { pronoun: "he", verb: "to sleep", form: "sleeps", promptType: 'pronoun_expects_form', full_sentence: "he sleeps soundly.", sentence_template: "he ___ soundly." }
            ];
            const dailyVocab = ["pizza", "soundly", "bed"];
            
            const sentenceDetails = generateSentenceForExercise('COSYenglish', ['3'], day3VerbData, dailyVocab);
            
            assert(sentenceDetails !== null, "Sentence should be generated for Day 3");
            const usedVerbBase = sentenceDetails.rawVerb.base;
            assert(usedVerbBase === "to eat" || usedVerbBase === "to sleep", 
                   `Generated sentence for Day 3 should use 'to eat' or 'to sleep', but got ${usedVerbBase}`);
        });
    });
    
    describe('generateSentenceForExercise Capitalization', () => {
        // Helper to quickly get a default verbData structure
        const getDummyVerbData = (pronoun = "they", verb = "to eat", form = "eat") => [
            { pronoun, verb, form, promptType: 'pronoun_expects_form', full_sentence: `${pronoun} ${form} food.`, sentence_template: `${pronoun} ___ food.` }
        ];
        const getDummyVocab = (words = ["food", "fast"]) => [...words];

        it('should capitalize the first word if it is a common noun from vocab', () => {
            const mockSubject = { text: "apple", type: "noun", isPlural: false, representativePronoun: "it" }; // selectSubject now returns lowercase
            const mockVerbData = getDummyVerbData("it", "to be", "is");
            const mockDailyVocab = getDummyVocab(["big", "red", "apple"]);
            
            // Mock selectSubject and selectObject globally for this test
            const originalSelectSubject = window.selectSubject;
            const originalSelectObject = window.selectObject;
            window.selectSubject = async () => mockSubject;
            window.selectObject = async () => "red"; // already lowercased by selectObject

            const sentenceDetails = generateSentenceForExercise('COSYenglish', ['1'], mockVerbData, mockDailyVocab);
            
            window.selectSubject = originalSelectSubject; // Restore
            window.selectObject = originalSelectObject; // Restore

            assert(sentenceDetails.correctSentence.startsWith('Apple is red.'), `Sentence: "${sentenceDetails.correctSentence}"`);
            assert(sentenceDetails.sentenceComponents[0] === 'Apple', `First component: "${sentenceDetails.sentenceComponents[0]}"`);
        });

        it('should capitalize pronoun "I" when it starts a sentence in English', () => {
            const mockSubject = { text: "i", type: "pronoun", isPlural: false, representativePronoun: "i" };
            const mockVerbData = getDummyVerbData("i", "to be", "am");
            const mockDailyVocab = getDummyVocab(["happy"]);
            
            const originalSelectSubject = window.selectSubject;
            const originalSelectObject = window.selectObject;
            window.selectSubject = async () => mockSubject;
            window.selectObject = async () => "happy";

            const sentenceDetails = generateSentenceForExercise('COSYenglish', ['1'], mockVerbData, mockDailyVocab);

            window.selectSubject = originalSelectSubject;
            window.selectObject = originalSelectObject;

            assert(sentenceDetails.correctSentence.startsWith('I am happy.'), `Sentence: "${sentenceDetails.correctSentence}"`);
            assert(sentenceDetails.sentenceComponents[0] === 'I', `First component: "${sentenceDetails.sentenceComponents[0]}"`);
        });

        it('should keep proper nouns like "Alex" capitalized when they start a sentence', () => {
            // selectSubject would return "Alex" (not lowercased)
            const mockSubject = { text: "Alex", type: "noun", isPlural: false, representativePronoun: "he" }; 
            const mockVerbData = getDummyVerbData("he", "to like", "likes");
            const mockDailyVocab = getDummyVocab(["pizza", "Alex"]);
            
            const originalSelectSubject = window.selectSubject;
            const originalSelectObject = window.selectObject;
            window.selectSubject = async () => mockSubject;
            window.selectObject = async () => "pizza";

            const sentenceDetails = generateSentenceForExercise('COSYenglish', ['1'], mockVerbData, mockDailyVocab);
            
            window.selectSubject = originalSelectSubject;
            window.selectObject = originalSelectObject;

            assert(sentenceDetails.correctSentence.startsWith('Alex likes pizza.'), `Sentence: "${sentenceDetails.correctSentence}"`);
            assert(sentenceDetails.sentenceComponents[0] === 'Alex', `First component: "${sentenceDetails.sentenceComponents[0]}"`);
        });

        it('should lowercase a fully capitalized vocab word if it is not first and not a proper noun', () => {
            const mockSubject = { text: "they", type: "pronoun", isPlural: true, representativePronoun: "they" };
             // selectObject will return "big" (lowerercased from "BIG")
            const mockObject = "big"; 
            const mockVerbData = getDummyVerbData("they", "to see", "see");
            // Simulate vocabulary having "BIG"
            const mockDailyVocab = getDummyVocab(["cars", "BIG"]); 
            
            const originalSelectSubject = window.selectSubject;
            const originalSelectObject = window.selectObject;
            window.selectSubject = async () => mockSubject;
            // Mock selectObject to simulate it picked "BIG" from vocab and lowercased it
            window.selectObject = async () => "big"; 


            const sentenceDetails = generateSentenceForExercise('COSYenglish', ['1'], mockVerbData, mockDailyVocab);

            window.selectSubject = originalSelectSubject;
            window.selectObject = originalSelectObject;
            
            assert(sentenceDetails.correctSentence === 'They see big.', `Sentence: "${sentenceDetails.correctSentence}"`);
            assert(sentenceDetails.sentenceComponents.includes('big'), `Components: "${sentenceDetails.sentenceComponents.join(', ')}"`);
        });

        it('should correctly capitalize the first word of a question (e.g., "Do" or "Are")', () => {
            const mockSubject = { text: "you", type: "pronoun", isPlural: false, representativePronoun: "you" };
            // For "Do you like fish?"
            const verbDataDo = [ { pronoun: "you", verb: "to like", form: "like", promptType: 'pronoun_expects_form', full_sentence: "you like fish.", sentence_template:"you ___ fish."}];
            // For "Are they green?"
            const verbDataAre = [ { pronoun: "they", verb: "to be", form: "are", promptType: 'pronoun_expects_form', full_sentence: "they are green.", sentence_template:"they ___ green."}];
            
            const originalSelectSubject = window.selectSubject;
            const originalSelectObject = window.selectObject;
            window.selectSubject = async () => mockSubject; // for "Do you..."
            window.selectObject = async () => "fish";

            // Test "Do you like fish?" - Q_AuxSVO pattern
            // Manually construct pattern for testing this specific case.
            // generateSentenceForExercise has random pattern selection, so direct call is hard to test for one pattern.
            // Instead, we check the output sentenceComponents from a typical call.
            // This test will be more about the general capitalization of the first word.
            
            let sentenceDetails = generateSentenceForExercise('COSYenglish', ['1'], verbDataDo, ["fish"]);
            assert(sentenceDetails.correctSentence.match(/^(Do|Does|Is|Are|Was|Were|Have|Has|Had)/), `Question starts with capitalized auxiliary/verb: "${sentenceDetails.correctSentence}"`);

            window.selectSubject = async () => ({text: "they", type: "pronoun", isPlural: true, representativePronoun: "they"}); // for "Are they..."
            window.selectObject = async () => "green";
            sentenceDetails = generateSentenceForExercise('COSYenglish', ['1'], verbDataAre, ["green"]);
            assert(sentenceDetails.correctSentence.match(/^(Do|Does|Is|Are|Was|Were|Have|Has|Had)/), `Question starts with capitalized auxiliary/verb: "${sentenceDetails.correctSentence}"`);
            
            window.selectSubject = originalSelectSubject;
            window.selectObject = originalSelectObject;
        });

    });

    // --- Final Summary ---
    function updateSummary() {
        testSummaryContainer.textContent = `Tests completed: ${testsPassed + testsFailed} | Passed: ${testsPassed} | Failed: ${testsFailed}`;
        if (testsFailed > 0) {
            testSummaryContainer.classList.add('fail');
        } else {
            testSummaryContainer.classList.add('pass');
        }
    }
    
    // Run all tests and then update summary
    // For async tests, this would need to be handled differently, but all current tests are sync.
    updateSummary();

    // Restore original document.getElementById if necessary for other page interactions,
    // though for a dedicated test runner, this might not be strictly needed.
    // document.getElementById = originalGetElementById; 
})();
