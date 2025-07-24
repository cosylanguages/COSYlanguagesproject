/**
 * A configuration object that defines the available template section types.
 */
export const availableTemplateSectionTypes = {
    "Upload picture": {
        "Image in carousel": "vocabulary/images",
        "GIF animation": "visuals/gif",
        "Other things/activities which are related to this": "visuals/other-picture-related"
    },
    "Audio and video": {
        "Video": "media/video",
        "Audio": "media/audio",
        "Voice recording": "speaking/user-recording",
        "Other things/activities which are related to this": "media/other-audio-video"
    },
    "Words and gaps": {
        "Move the word to the gap (Fill Gaps from Box)": "interactive/move-word-gap",
        "Enter the word in the blank (Fill Gaps with Hint)": "grammar/fillgaps",
        "Select the word form for the gap (Choose Correct Option)": "grammar/selectform",
        "Conjugation Practice": "grammar/conjugation",
        "Irregular Verb Practice": "grammar/irregular-verb",
        "Other things/activities which are related to this": "interactive/other-words-gaps"
    },
    "Tests": {
        "Test without a timer": "assessment/test",
        "Timed test": "assessment/timedtest",
        "Other things/activities which are related to this": "assessment/other-tests"
    },
    "Select the correct answer": {
        "True, false, not stated": "comprehension/truefalse",
        "Multiple choice (single answer)": "comprehension/mcq-single",
        "Multiple choice (multiple answers)": "comprehension/mcq-multiple",
        "Other things/activities which are related to this": "comprehension/other-selecting-answers"
    },
    "Arrange in the correct order": {
        "Sentence of words (Word Order)": "grammar/wordorder",
        "Sort by columns": "interactive/columnsort",
        "Put the text in order (Paragraph Order)": "interactive/textorder",
        "Match words": "interactive/matchpairs",
        "Other things/activities which are related to this": "interactive/other-ordering"
    },
    "Working with text": {
        "Article": "reading/article",
        "Essay": "writing/essay",
        "Text": "reading/text",
        "Writing practice": "writing/prose",
        "Other things/activities which are related to this": "textwork/other-text-work"
    },
    "Other": {
        "Wordlist": "vocabulary/words",
        "Note (Structured Note)": "utility/note",
        "Link": "utility/link"
    }
};

/**
 * A map that associates template type paths with their corresponding configuration UI element IDs.
 */
export const templateTypeToConfigId = {
    "vocabulary/images": "config-picture-carousel",
    "visuals/gif": "config-gif",
    "media/video": "config-video",
    "media/audio": "config-audio",
    "interactive/move-word-gap": "config-fill-gaps-box",
    "grammar/fillgaps": "config-fill-gaps-hint",
    "grammar/selectform": "config-choose-correct-option",
    "comprehension/truefalse": "config-true-false",
    "grammar/wordorder": "config-word-order",
    "interactive/columnsort": "config-sort-columns",
    "interactive/textorder": "config-paragraph-order",
    "interactive/matchpairs": "config-match-words",
    "vocabulary/words": "config-wordlist",
    "utility/note": "config-structured-note",
    "utility/link": "config-utility-link",
    "interactive/label-pictures": "config-label-pictures",
    "interactive/match-pictures": "config-match-pictures",
    "grammar/conjugation": "config-conjugation",
    "grammar/irregular-verb": "config-irregular-verb"
};

/**
 * Gets the emoji for a given template type path.
 * @param {string} typePath - The template type path.
 * @returns {string} The emoji for the template type.
 */
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
    if (pathLower.includes('text') || pathLower.includes('article') || pathLower.includes('essay') || pathLower.includes('prose')) return '📑';
    if (pathLower.includes('wordlist') || pathLower === 'vocabulary/words') return '📋';
    if (pathLower.includes('note') || pathLower === 'utility/note') return '🗒️';
    if (pathLower.includes('link') || pathLower === 'utility/link') return '🔗';

    return '➕';
};

/**
 * Gets the display name for a given template type path.
 * @param {string} typePath - The template type path.
 * @returns {string} The display name for the template type.
 */
export const getDisplayNameForTemplatePath = (typePath) => {
    for (const category of Object.values(availableTemplateSectionTypes)) {
        for (const name in category) {
            if (category[name] === typePath) {
                return name;
            }
        }
    }
    return typePath;
};
