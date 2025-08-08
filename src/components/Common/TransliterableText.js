import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import { usePictureDictionary } from '../../contexts/PictureDictionaryContext';
import { pronounceText } from '../../utils/speechUtils';
import useLatinization from '../../hooks/useLatinization';
import './TransliterableText.css';

const TransliterableText = ({ text, langOverride = null, as: Component = 'span', className = '', ...props }) => {
    const { language: globalLanguage } = useI18n();
    useLatinizationContext();

    const effectiveLang = langOverride || globalLanguage;

    let originalTextToDisplay = text;
    if (typeof text === 'object' && text !== null) {
        originalTextToDisplay = text[effectiveLang] || text.COSYenglish || text.default || text[Object.keys(text)[0]] || '';
        if (typeof originalTextToDisplay !== 'string') {
            originalTextToDisplay = '';
        }
    } else if (typeof text !== 'string') {
        originalTextToDisplay = String(text || '');
    }

    const possiblyLatinizedText = useLatinization(originalTextToDisplay, effectiveLang);
    const { isLatinized, latinizableLanguageIds } = useLatinizationContext();
    const isEffectiveLanguageLatinizable = latinizableLanguageIds.includes(effectiveLang);
    const actuallyLatinized = isLatinized && isEffectiveLanguageLatinizable && (possiblyLatinizedText !== originalTextToDisplay);
    const componentClassName = `transliterable-text ${className} ${actuallyLatinized ? 'latinized-text' : ''}`.trim();

    const { openModal } = usePictureDictionary();

    const handleWordClick = (word, action) => {
        const cleanedWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
        if (cleanedWord) {
            if (action === 'pronounce') {
                pronounceText(cleanedWord, effectiveLang);
            } else if (action === 'picture') {
                openModal(cleanedWord);
            }
        }
    };

    return (
        <Component className={componentClassName} {...props}>
            {possiblyLatinizedText.split(' ').map((word, index) => (
                <span key={index} className="word-container">
                    <span>{word}</span>
                    <button onClick={() => handleWordClick(word, 'pronounce')} className="btn-icon">🔊</button>
                    <button onClick={() => handleWordClick(word, 'picture')} className="btn-icon">🖼️</button>
                    {' '}
                </span>
            ))}
        </Component>
    );
};

export default TransliterableText;
