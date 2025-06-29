import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './UtilityLinkBlock.css'; // Basic styling for the block

const UtilityLinkBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();

    if (!blockData || blockData.type !== 'utility/link') {
        return <p>{t('errorIncorrectBlockDataLink') || 'Incorrect data for Utility Link block.'}</p>;
    }

    const { content, title: blockTitleObj } = blockData;
    const linkUrl = content?.url;
    const linkText = content?.text;

    // Determine the title for the block itself
    let displayTitle = blockTitleObj?.[currentUILanguage] || blockTitleObj?.COSYenglish;
    if (!displayTitle) { // Fallback if no title object, use link text or a default
        displayTitle = linkText || t('linkDefaultTitle') || 'Link';
    }
    
    if (!linkUrl || !linkText) {
        return (
            <div className="utility-link-block exercise-block-display">
                <h5 className="utility-link-block-title">{displayTitle}</h5>
                <p><em>{t('linkNotFullyConfigured') || '(Link not fully configured)'}</em></p>
            </div>
        );
    }

    return (
        <div className="utility-link-block exercise-block-display">
            {displayTitle && <h5 className="utility-link-block-title">{displayTitle}</h5>}
            <a 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="utility-link-anchor"
            >
                {linkText}
            </a>
        </div>
    );
};

export default UtilityLinkBlock;
