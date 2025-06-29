import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureUtilityLink.css'; // We'll create this

const ConfigureUtilityLink = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage, allTranslations } = useI18n();

    const getInitialMultilingualValue = (field) => {
        if (existingBlockData && existingBlockData[field] && typeof existingBlockData[field] === 'object') {
            return existingBlockData[field][currentUILanguage] || existingBlockData[field]['COSYenglish'] || '';
        }
        if (existingBlockData && typeof existingBlockData[field] === 'string') { // Fallback for older non-multilingual data
            return existingBlockData[field];
        }
        return '';
    };
    
    const [sectionTitle, setSectionTitle] = useState(getInitialMultilingualValue('title')); // Block's own title
    const [linkUrl, setLinkUrl] = useState(existingBlockData?.content?.url || '');
    const [linkText, setLinkText] = useState(getInitialMultilingualValue('content') || getInitialMultilingualValue('text')); // content.text from study-mode or block.text

    // If 'content' is an object with 'text', prefer that. Otherwise, use block's 'text' field for backward compatibility.
    useEffect(() => {
        if (existingBlockData?.content && typeof existingBlockData.content.text === 'string') {
            setLinkText(existingBlockData.content.text);
        } else if (existingBlockData?.text && typeof existingBlockData.text === 'string') {
             setLinkText(existingBlockData.text); // Fallback for older structure where text might be top-level
        }

        if (existingBlockData?.content && typeof existingBlockData.content.url === 'string') {
            setLinkUrl(existingBlockData.content.url);
        } else if (existingBlockData?.url && typeof existingBlockData.url === 'string') {
             setLinkUrl(existingBlockData.url); // Fallback for older structure
        }


        if (existingBlockData?.title && typeof existingBlockData.title === 'object') {
            setSectionTitle(existingBlockData.title[currentUILanguage] || existingBlockData.title['COSYenglish'] || '');
        } else if (existingBlockData?.title && typeof existingBlockData.title === 'string') {
            setSectionTitle(existingBlockData.title);
        }


    }, [existingBlockData, currentUILanguage]);


    const handleSave = () => {
        const trimmedUrl = linkUrl.trim();
        const trimmedText = linkText.trim();

        if (!trimmedUrl) {
            alert(t('linkUrlRequiredValidation') || "Link URL cannot be empty.");
            return;
        }
        if (!trimmedText) {
            alert(t('linkTextRequiredValidation') || "Link display text cannot be empty.");
            return;
        }
        try {
            new URL(trimmedUrl);
        } catch (_) {
            alert(t('invalidUrlValidation') || "Please enter a valid URL (e.g., https://example.com).");
            return;
        }

        const newBlockTitleObj = { ...(existingBlockData?.title || {}) };
        const titleToUse = sectionTitle.trim() || trimmedText; // Default block title to link text if not provided
        
        newBlockTitleObj[currentUILanguage] = titleToUse;
        if (!newBlockTitleObj['COSYenglish']) { // Ensure default English title
            newBlockTitleObj['COSYenglish'] = titleToUse;
        }
        // Ensure all languages have a title, defaulting to the current UI lang or English
        Object.keys(allTranslations || { "COSYenglish": {} }).forEach(langKey => {
            if (!newBlockTitleObj[langKey]) {
                newBlockTitleObj[langKey] = newBlockTitleObj[currentUILanguage] || newBlockTitleObj['COSYenglish'];
            }
        });
        
        const newBlockData = {
            id: existingBlockData?.id || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'utility/link',
            title: newBlockTitleObj, // The title for the block itself
            content: { // Specific content for utility/link
                url: trimmedUrl,
                text: trimmedText // The display text for the hyperlink
            },
            createdAt: existingBlockData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        onSave(newBlockData);
    };

    return (
        <div className="configure-utility-link">
            <h4>{existingBlockData ? (t('editUtilityLinkTitle') || 'Edit Link Section') : (t('addUtilityLinkTitle') || 'Add Link Section')}</h4>
            
            <div className="form-group">
                <label htmlFor="utility-link-section-title">{t('blockSectionTitleLabel') || 'Section Title (Optional):'}</label>
                <input
                    type="text"
                    id="utility-link-section-title"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder={t('blockSectionTitlePlaceholder') || "e.g., Useful Resources"}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="utility-link-url">{t('linkUrlLabel') || 'Link URL:'}</label>
                <input
                    type="url"
                    id="utility-link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="utility-link-text">{t('linkDisplayTextLabel') || 'Display Text for Link:'}</label>
                <input
                    type="text"
                    id="utility-link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder={t('linkDisplayTextPlaceholder') || "e.g., Visit Example.com"}
                    required
                    className="form-control"
                />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    {t('cancelBtn') || 'Cancel'}
                </button>
                <button type="button" onClick={handleSave} className="btn btn-primary">
                    {t('saveBtn') || 'Save Link Section'}
                </button>
            </div>
        </div>
    );
};

export default ConfigureUtilityLink;
