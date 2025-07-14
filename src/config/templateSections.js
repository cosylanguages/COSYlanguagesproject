// Configuration for available template section types
// Ported from src/js/app/app-study-mode.js

export const availableTemplateSectionTypes = {
    "Upload picture": {
        "Image in carousel": "vocabulary/images", // Matches config-picture-carousel
        "GIF animation": "visuals/gif",          // Matches config-gif
        // "Label the pictures": "interactive/label-pictures", // Matches config-label-pictures (Example if it was here)
        // "Match the pictures": "interactive/match-pictures", // Matches config-match-pictures (Example if it was here)
        "Other things/activities which are related to this": "visuals/other-picture-related"
    },
    "Audio and video": {
        "Video": "media/video",                  // Matches config-video
        "Audio": "media/audio",                  // Matches config-audio
        "Voice recording": "speaking/user-recording", // No direct config UI template in study-mode.html, placeholder
        "Other things/activities which are related to this": "media/other-audio-video"
    },
    "Words and gaps": {
        "Move the word to the gap (Fill Gaps from Box)": "interactive/move-word-gap", // Matches config-fill-gaps-box
        "Enter the word in the blank (Fill Gaps with Hint)": "grammar/fillgaps", // Matches config-fill-gaps-hint
        "Select the word form for the gap (Choose Correct Option)": "grammar/selectform", // Matches config-choose-correct-option
        "Conjugation Practice": "grammar/conjugation",
        "Irregular Verb Practice": "grammar/irregular-verb",
        // "Move the word to the image": "interactive/move-word-image", // No direct config UI
        // "Enter a word for the image": "vocabulary/image-word-entry", // No direct config UI
        // "Select the form of the word for the image": "vocabulary/image-word-form", // No direct config UI
        "Other things/activities which are related to this": "interactive/other-words-gaps"
    },
    "Tests": {
        "Test without a timer": "assessment/test", // No direct config UI
        "Timed test": "assessment/timedtest",       // No direct config UI
        "Other things/activities which are related to this": "assessment/other-tests"
    },
    "Select the correct answer": {
        "True, false, not stated": "comprehension/truefalse", // Matches config-true-false
        "Multiple choice (single answer)": "comprehension/mcq-single", // No direct config, but covered by choose-correct-option conceptually
        "Multiple choice (multiple answers)": "comprehension/mcq-multiple", // No direct config
        "Other things/activities which are related to this": "comprehension/other-selecting-answers"
    },
    "Arrange in the correct order": {
        "Sentence of words (Word Order)": "grammar/wordorder",       // Matches config-word-order
        "Sort by columns": "interactive/columnsort",   // Matches config-sort-columns
        "Put the text in order (Paragraph Order)": "interactive/textorder", // Matches config-paragraph-order
        // "Unscramble": "interactive/unscramble", // No direct config UI, similar to word-order
        "Match words": "interactive/matchpairs",       // Matches config-match-words
        "Other things/activities which are related to this": "interactive/other-ordering"
    },
    "Working with text": {
        "Article": "reading/article", // No direct config UI
        "Essay": "writing/essay",     // No direct config UI
        "Text": "reading/text",       // No direct config UI
        "Other things/activities which are related to this": "textwork/other-text-work"
    },
    "Other": {
        "Wordlist": "vocabulary/words",        // Matches config-wordlist
        "Note (Structured Note)": "utility/note", // Matches config-structured-note
        "Link": "utility/link"                 // Matches config-utility-link
    }
};

// Mapping from the type path (value in availableTemplateSectionTypes) 
// to the ID of the configuration UI div in study-mode.html (for reference during migration)
// This helps in identifying which React component to build/use for configuration.
export const templateTypeToConfigId = {
    "vocabulary/images": "config-picture-carousel",
    "visuals/gif": "config-gif",
    "media/video": "config-video",
    "media/audio": "config-audio",
    "interactive/move-word-gap": "config-fill-gaps-box", // Fill Gaps from Box
    "grammar/fillgaps": "config-fill-gaps-hint",       // Fill Gaps with Hint
    "grammar/selectform": "config-choose-correct-option", // Choose Correct Option (for gap fills)
    "comprehension/truefalse": "config-true-false",
    "grammar/wordorder": "config-word-order",
    "interactive/columnsort": "config-sort-columns",
    "interactive/textorder": "config-paragraph-order",
    "interactive/matchpairs": "config-match-words",
    "vocabulary/words": "config-wordlist",
    "utility/note": "config-structured-note",
    "utility/link": "config-utility-link",
    "interactive/label-pictures": "config-label-pictures", // Added based on study-mode.html
    "interactive/match-pictures": "config-match-pictures",  // Added based on study-mode.html
    "grammar/conjugation": "config-conjugation",
    "grammar/irregular-verb": "config-irregular-verb"
    // ... other types from availableTemplateSectionTypes that have a direct config UI
    // "speaking/user-recording" - No direct config UI in HTML
    // "assessment/test" - No direct config UI in HTML
    // "assessment/timedtest" - No direct config UI in HTML
    // "comprehension/mcq-single" - Covered by config-choose-correct-option
    // "comprehension/mcq-multiple" - No direct config UI in HTML
    // "reading/article" - No direct config UI in HTML
    // "writing/essay" - No direct config UI in HTML
    // "reading/text" - No direct config UI in HTML
};

// Emojis for template types, similar to app-study-mode.js logic
export const getEmojiForTemplateType = (typePath) => {
    if (!typePath) return '➕';
    const pathLower = typePath.toLowerCase();

    if (pathLower.includes('image') || pathLower.includes('picture') || pathLower.includes('carousel') || pathLower === 'vocabulary/images') return '🖼️';
    if (pathLower.includes('gif') || pathLower === 'visuals/gif') return '✨';
    if (pathLower.includes('video') || pathLower === 'media/video') return '▶️';
    if (pathLower.includes('audio') || pathLower.includes('voice') || pathLower === 'media/audio') return '🔊';
    if (pathLower.includes('gap') || pathLower.includes('fillgaps') || pathLower.includes('selectform') || pathLower.includes('conjugation') || pathLower.includes('irregular-verb')) return '✍️';
    if (pathLower.includes('test') || pathLower.includes('assessment')) return '📝';
    if (pathLower.includes('truefalse') || pathLower.includes('select') || pathLower.includes('mcq')) return '✅';
    if (pathLower.includes('order') || pathLower.includes('sort') || pathLower.includes('unscramble')) return '🔀';
    if (pathLower.includes('match') || pathLower.includes('matchpairs')) return '🔗';
    if (pathLower.includes('text') || pathLower.includes('article') || pathLower.includes('essay')) return '📑';
    if (pathLower.includes('wordlist') || pathLower === 'vocabulary/words') return '📋';
    if (pathLower.includes('note') || pathLower === 'utility/note') return '🗒️';
    if (pathLower.includes('link') || pathLower === 'utility/link') return '🔗';
    
    return '➕'; // Default emoji
};

// Add more mappings or helper functions as needed.
// For example, a function to get the display name from a type path, if needed separately.
export const getDisplayNameForTemplatePath = (typePath) => {
    for (const category of Object.values(availableTemplateSectionTypes)) {
        for (const name in category) {
            if (category[name] === typePath) {
                return name;
            }
        }
    }
    return typePath; // Fallback to the path itself
};
