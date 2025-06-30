import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import useLatinization from '../../hooks/useLatinization'; // Import the main hook

const TransliterableText = ({ text, langOverride = null, as: Component = 'span', className = '', ...props }) => {
    const { language: globalLanguage } = useI18n();
    // Not using isLatinized or latinizableLanguageIds directly from here for decision,
    // as useLatinization hook will handle it based on its context.
    // We only need effectiveLang to pass to the hook.
    useLatinizationContext(); // Ensure component is within context, but values not directly used here for logic

    const effectiveLang = langOverride || globalLanguage;

    let originalTextToDisplay = text;

    // If text is a multilingual object (e.g., from blockData.title)
    if (typeof text === 'object' && text !== null) {
        // Prioritize the effective language, then English, then a 'default' field, then the first available.
        originalTextToDisplay = text[effectiveLang] || text.COSYenglish || text.default || text[Object.keys(text)[0]] || '';
        if (typeof originalTextToDisplay !== 'string') { 
            originalTextToDisplay = ''; // Ensure it's a string
        }
    } else if (typeof text !== 'string') {
        originalTextToDisplay = String(text || ''); // Ensure it's a string
    }
    
    // The useLatinization hook consumes the original text and its language identifier.
    // It internally uses LatinizationContext to decide if latinization should apply.
    const possiblyLatinizedText = useLatinization(originalTextToDisplay, effectiveLang);
    const { isLatinized, latinizableLanguageIds } = useLatinizationContext(); // Get context again for specific check

    const isEffectiveLanguageLatinizable = latinizableLanguageIds.includes(effectiveLang);
    const actuallyLatinized = isLatinized && isEffectiveLanguageLatinizable && (possiblyLatinizedText !== originalTextToDisplay);
    
    const componentClassName = `transliterable-text ${className} ${actuallyLatinized ? 'latinized-text' : ''}`.trim();

    return (
        <Component className={componentClassName} {...props}>
            {possiblyLatinizedText}
        </Component>
    );
};

export default TransliterableText;
