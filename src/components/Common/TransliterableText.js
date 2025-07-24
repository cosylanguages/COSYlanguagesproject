// Import necessary libraries and hooks.
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import useLatinization from '../../hooks/useLatinization';

/**
 * A component that renders text that can be transliterated.
 * It uses the `useLatinization` hook to handle the transliteration.
 * @param {object} props - The component's props.
 * @param {string|object} props.text - The text to render. It can be a string or a multilingual object.
 * @param {string} [props.langOverride=null] - A language override for the text.
 * @param {string} [props.as='span'] - The component to render the text in.
 * @param {string} [props.className=''] - Additional class names for the component.
 * @returns {JSX.Element} The TransliterableText component.
 */
const TransliterableText = ({ text, langOverride = null, as: Component = 'span', className = '', ...props }) => {
    const { language: globalLanguage } = useI18n();
    useLatinizationContext(); // Ensures the component is within the LatinizationContext.

    // Determine the effective language for the text.
    const effectiveLang = langOverride || globalLanguage;

    let originalTextToDisplay = text;

    // If the text is a multilingual object, get the appropriate string.
    if (typeof text === 'object' && text !== null) {
        originalTextToDisplay = text[effectiveLang] || text.COSYenglish || text.default || text[Object.keys(text)[0]] || '';
        if (typeof originalTextToDisplay !== 'string') {
            originalTextToDisplay = '';
        }
    } else if (typeof text !== 'string') {
        originalTextToDisplay = String(text || '');
    }

    // Use the useLatinization hook to get the possibly latinized text.
    const possiblyLatinizedText = useLatinization(originalTextToDisplay, effectiveLang);
    const { isLatinized, latinizableLanguageIds } = useLatinizationContext();

    // Determine if the text was actually latinized.
    const isEffectiveLanguageLatinizable = latinizableLanguageIds.includes(effectiveLang);
    const actuallyLatinized = isLatinized && isEffectiveLanguageLatinizable && (possiblyLatinizedText !== originalTextToDisplay);

    // Construct the component's class name.
    const componentClassName = `transliterable-text ${className} ${actuallyLatinized ? 'latinized-text' : ''}`.trim();

    // Render the component with the possibly latinized text.
    return (
        <Component className={componentClassName} {...props}>
            {possiblyLatinizedText}
        </Component>
    );
};

export default TransliterableText;
