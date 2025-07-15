import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import TransliterableText from '../../Common/TransliterableText'; // Added
import { pronounceText } from '../../../utils/speechUtils'; // Added for TTS
import './SimpleTextDisplay.css'; 
import '../../Freestyle/freestyle-shared.css';

const TextBlock = ({ blockData }) => {
    const { t, language: globalLanguage } = useI18n(); // Renamed to avoid conflict with blockData.lang
    const { title, content = {}, lang: blockLang } = blockData;

    const effectiveLang = blockLang || globalLanguage;
    
    // Use TransliterableText for title and prepare content for it
    // The content might have newlines which TransliterableText (as a span by default) won't render as line breaks.
    // We need to handle newlines for the main content specifically if it's plain text.

    const textToShow = content?.[effectiveLang] || content?.COSYenglish || content?.default || '';

    const contentLines = textToShow.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            <TransliterableText text={line} langOverride={effectiveLang} />
            {index < textToShow.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));
    
    const titleTextForTTS = title?.[effectiveLang] || title?.COSYenglish || title?.default || '';
    const contentTextForTTS = textToShow; // Raw text for TTS

    return (
        <div className="text-block display-simple-block cosy-exercise-container">
            <h4>
                <TransliterableText text={title} langOverride={effectiveLang} />
                {titleTextForTTS && (
                    <button 
                        onClick={() => pronounceText(titleTextForTTS, effectiveLang)}
                        className="btn-icon pronounce-btn-inline"
                        title={t('pronounceTitle') || 'Pronounce title'}
                    >🔊</button>
                )}
            </h4>
            <div className="text-content-display">
                {textToShow.trim() ? contentLines : <p>({t('noTextContentProvided') || 'No text content provided.'})</p>}
                {textToShow.trim() && (
                     <button 
                        onClick={() => pronounceText(contentTextForTTS, effectiveLang)}
                        className="btn-icon pronounce-btn-block-content"
                        title={t('pronounceContent') || 'Pronounce content'}
                    >🔊</button>
                )}
            </div>
        </div>
    );
};

export default TextBlock;
