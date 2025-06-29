import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureGifBlock.css'; // To be created

const ConfigureGifBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage, allTranslations } = useI18n();

    const getInitialBlockTitle = () => {
        if (existingBlockData?.title) {
            return existingBlockData.title[currentUILanguage] || existingBlockData.title['COSYenglish'] || '';
        }
        return t('gifDefaultBlockTitle') || 'GIF Animation'; // Default title
    };

    const [blockTitle, setBlockTitle] = useState(getInitialBlockTitle());
    const [gifUrl, setGifUrl] = useState(existingBlockData?.content?.src || existingBlockData?.src || '');
    // Note: 'src' might be directly on blockData or in blockData.content for older data.

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title?.[currentUILanguage] || existingBlockData.title?.COSYenglish || t('gifDefaultBlockTitle') || 'GIF Animation');
            setGifUrl(existingBlockData.content?.src || existingBlockData.src || '');
        }
    }, [existingBlockData, currentUILanguage, t]);


    const handleSave = () => {
        const trimmedUrl = gifUrl.trim();
        if (!trimmedUrl) {
            alert(t('gifUrlRequiredValidation') || "GIF URL cannot be empty.");
            return;
        }
        try {
            new URL(trimmedUrl); // Basic URL validation
        } catch (_) {
            alert(t('invalidUrlValidation') || "Please enter a valid URL for the GIF.");
            return;
        }

        const newBlockTitleObj = { ...(existingBlockData?.title || {}) };
        const titleToUse = blockTitle.trim() || (t('gifDefaultBlockTitle') || "GIF Animation");
        
        newBlockTitleObj[currentUILanguage] = titleToUse;
        if (!newBlockTitleObj['COSYenglish']) { 
            newBlockTitleObj['COSYenglish'] = titleToUse;
        }
        Object.keys(allTranslations || { "COSYenglish": {} }).forEach(langKey => {
            if (!newBlockTitleObj[langKey]) {
                newBlockTitleObj[langKey] = newBlockTitleObj[currentUILanguage] || newBlockTitleObj['COSYenglish'];
            }
        });
        
        const newBlockData = {
            id: existingBlockData?.id || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'visuals/gif',
            title: newBlockTitleObj,
            content: { // Standardizing to use 'content' object
                src: trimmedUrl 
            },
            // Preserve 'src' at top level if it existed, for potential backward compatibility,
            // but new data should primarily use content.src
            src: trimmedUrl, 
            createdAt: existingBlockData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        onSave(newBlockData);
    };
    
    // Placeholder for GIF search functionality
    const handleGifSearch = () => {
        const searchTerm = prompt(t('enterGifSearchTerm') || "Enter search term for GIF (e.g., GIPHY):");
        if (searchTerm) {
            alert(t('gifSearchPlaceholderAlert', { term: searchTerm }) || `GIF search for "${searchTerm}" is a placeholder. Please find and paste URL manually.`);
            // In a real app, this would trigger an API call to GIPHY or similar and allow selection.
        }
    };

    return (
        <div className="configure-gif-block">
            <h4>{existingBlockData ? (t('editGifBlockTitle') || 'Edit GIF Block') : (t('addGifBlockTitle') || 'Add GIF Block')}</h4>

            <div className="form-group">
                <label htmlFor="gif-block-title">{t('gifBlockTitleLabel') || 'Block Title (Optional):'}</label>
                <input
                    type="text"
                    id="gif-block-title"
                    value={blockTitle}
                    onChange={(e) => setBlockTitle(e.target.value)}
                    placeholder={t('gifBlockTitlePlaceholder') || "e.g., Funny Cat Reaction"}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="gif-url">{t('gifUrlLabel') || 'GIF URL:'}</label>
                <input
                    type="url"
                    id="gif-url"
                    value={gifUrl}
                    onChange={(e) => setGifUrl(e.target.value)}
                    placeholder="https://example.com/animation.gif"
                    required
                    className="form-control"
                />
            </div>
            
            {/* Placeholder for GIF Search & Upload */}
            <div className="gif-source-helpers">
                <button type="button" onClick={handleGifSearch} className="btn btn-outline-secondary btn-small">
                    {t('searchGifBtn') || 'Search Online (GIPHY, etc.)'}
                </button>
                {/* 
                <label htmlFor="gif-upload">{t('orUploadGifLabel') || 'Or Upload GIF:'}</label>
                <input type="file" id="gif-upload" accept="image/gif" className="form-control-file" />
                */}
            </div>


            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    {t('cancelBtn') || 'Cancel'}
                </button>
                <button type="button" onClick={handleSave} className="btn btn-primary">
                    {t('saveBtn') || 'Save GIF Block'}
                </button>
            </div>
        </div>
    );
};

export default ConfigureGifBlock;
