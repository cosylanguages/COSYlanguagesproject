import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { isLatinizableLanguage } from '../../utils/latinizer'; // Assuming latinizeIfNeeded is not needed here as I18nContext provides applyLatinization

const TransliterableText = ({ text, langOverride = null, as: Component = 'span', className = '', ...props }) => {
    const { 
        latinizeActive, 
        applyLatinization, // This is expected to be latinizeIfNeeded from I18nContext
        language: globalLanguage 
    } = useI18n();

    const effectiveLang = langOverride || globalLanguage;

    let displayedText = text;

    // If text is a multilingual object (e.g., from blockData.title)
    if (typeof text === 'object' && text !== null) {
        displayedText = text[effectiveLang] || text.COSYenglish || text.default || '';
        if (typeof displayedText !== 'string') { // Fallback if nested structure is deeper or unexpected
            displayedText = text[Object.keys(text)[0]] || ''; // Take first available if specific keys fail
        }
    } else if (typeof text !== 'string') {
        displayedText = String(text || ''); // Ensure it's a string
    }

    if (latinizeActive && isLatinizableLanguage(effectiveLang) && applyLatinization) {
        displayedText = applyLatinization(displayedText, effectiveLang);
    }

    return (
        <Component className={`transliterable-text ${className}`} {...props}>
            {displayedText}
        </Component>
    );
};

export default TransliterableText;
