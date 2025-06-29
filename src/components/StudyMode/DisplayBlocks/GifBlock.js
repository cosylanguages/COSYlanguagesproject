import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './GifBlock.css'; // To be created

const GifBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();

    if (!blockData || blockData.type !== 'visuals/gif' || (!blockData.content?.src && !blockData.src)) {
        return (
            <div className="gif-block exercise-block-display">
                <p>{t('errorIncorrectGifData') || 'Incorrect or empty data for GIF block.'}</p>
            </div>
        );
    }

    const gifSrc = blockData.content?.src || blockData.src; // Prefer content.src
    const { title: blockTitleObj } = blockData;

    let displayTitle = blockTitleObj?.[currentUILanguage] || 
                       blockTitleObj?.COSYenglish || 
                       t('gifDefaultDisplayTitle') || 
                       'GIF';
    
    // If the title is just the type path, try to generate a more generic one
    if (displayTitle === 'visuals/gif') {
        displayTitle = t('gifDefaultDisplayTitle') || 'GIF';
    }


    return (
        <div className="gif-block exercise-block-display">
            {displayTitle && <h5 className="gif-block-title">{displayTitle}</h5>}
            <div className="gif-image-container">
                <img src={gifSrc} alt={displayTitle} />
            </div>
        </div>
    );
};

export default GifBlock;
