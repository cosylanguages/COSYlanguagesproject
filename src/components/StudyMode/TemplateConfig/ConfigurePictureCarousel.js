import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigurePictureCarousel.css'; // To be created

const ConfigurePictureCarousel = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage, allTranslations } = useI18n();

    const getInitialBlockTitle = () => {
        if (existingBlockData?.title) {
            return existingBlockData.title[currentUILanguage] || existingBlockData.title['COSYenglish'] || '';
        }
        return '';
    };

    const [blockTitle, setBlockTitle] = useState(getInitialBlockTitle());
    const [items, setItems] = useState(existingBlockData?.items || [{ id: `item_${Date.now()}`, src: '', text: {} }]);
    
    // Ensure items have multilingual text structure
    useEffect(() => {
        if (existingBlockData?.items) {
            const updatedItems = existingBlockData.items.map(item => {
                const newItemText = {};
                Object.keys(allTranslations || { "COSYenglish": {} }).forEach(langKey => {
                    if (typeof item.text === 'string') { // Handle old string format
                        newItemText[langKey] = item.text; 
                    } else {
                        newItemText[langKey] = item.text?.[langKey] || item.text?.['COSYenglish'] || '';
                    }
                });
                 // If current UI lang is still empty, set it from English or first available
                if (!newItemText[currentUILanguage] && newItemText['COSYenglish']) {
                    newItemText[currentUILanguage] = newItemText['COSYenglish'];
                } else if (!newItemText[currentUILanguage]) {
                    const firstAvailableText = Object.values(newItemText).find(txt => txt);
                    if(firstAvailableText) newItemText[currentUILanguage] = firstAvailableText;
                }
                return { ...item, text: newItemText };
            });
            setItems(updatedItems);
        }
    }, [existingBlockData, currentUILanguage, allTranslations]);


    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'text') {
            newItems[index].text[currentUILanguage] = value;
            // If current UI lang is English, or English text is empty/same as old, update English
            if (currentUILanguage === 'COSYenglish' || !newItems[index].text['COSYenglish'] || newItems[index].text['COSYenglish'] === (items[index].text[currentUILanguage] && items[index].text[currentUILanguage] !== value) ) {
                 newItems[index].text['COSYenglish'] = value;
            }
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
    };

    const handleAddItem = () => {
        const newItemText = {};
        Object.keys(allTranslations || { "COSYenglish": {} }).forEach(langKey => {
            newItemText[langKey] = ''; // Initialize with empty strings
        });
        setItems([...items, { id: `item_${Date.now()}`, src: '', text: newItemText }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length <= 1) {
            alert(t('carouselMinOneImageValidation') || "A carousel must have at least one image.");
            return;
        }
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSave = () => {
        const validItems = items.filter(item => item.src && item.src.trim() !== '');
        if (validItems.length === 0) {
            alert(t('carouselNoValidImagesValidation') || "Please add at least one valid image URL.");
            return;
        }

        // Ensure all language versions of text are populated for each item
        const processedItems = validItems.map(item => {
            const processedText = { ...item.text };
            const defaultText = processedText[currentUILanguage] || processedText['COSYenglish'] || '';
            Object.keys(allTranslations || { "COSYenglish": {} }).forEach(langKey => {
                if (!processedText[langKey]) {
                    processedText[langKey] = defaultText;
                }
            });
            return { ...item, text: processedText };
        });
        
        const newBlockTitleObj = { ...(existingBlockData?.title || {}) };
        const titleToUse = blockTitle.trim() || (t('defaultCarouselTitle') || "Image Carousel");
        
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
            type: 'vocabulary/images', // Matches availableTemplateSectionTypes
            title: newBlockTitleObj,
            items: processedItems,
            createdAt: existingBlockData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        onSave(newBlockData);
    };
    
    // Placeholder for image search functionality
    const handleImageSearch = (index) => {
        const searchTerm = prompt(t('enterImageSearchTerm') || "Enter search term for image:");
        if (searchTerm) {
            alert(t('imageSearchPlaceholderAlert', { term: searchTerm }) || `Image search for "${searchTerm}" is a placeholder. Please enter URL manually.`);
            // In a real app, this would trigger an API call and update items[index].src
        }
    };


    return (
        <div className="configure-picture-carousel">
            <h4>{existingBlockData ? (t('editPictureCarouselTitle') || 'Edit Picture Carousel') : (t('addPictureCarouselTitle') || 'Add Picture Carousel')}</h4>

            <div className="form-group">
                <label htmlFor="carousel-block-title">{t('carouselBlockTitleLabel') || 'Carousel Title (Optional):'}</label>
                <input
                    type="text"
                    id="carousel-block-title"
                    value={blockTitle}
                    onChange={(e) => setBlockTitle(e.target.value)}
                    placeholder={t('carouselBlockTitlePlaceholder') || "e.g., Animals, Fruits"}
                    className="form-control"
                />
            </div>

            <div className="carousel-items-list">
                {items.map((item, index) => (
                    <div key={item.id || index} className="carousel-item-config">
                        <h5>{t('imageNumLabel', { num: index + 1 }) || `Image ${index + 1}`}</h5>
                        <div className="form-group">
                            <label htmlFor={`item-src-${index}`}>{t('imageUrlLabel') || 'Image URL:'}</label>
                            <input
                                type="url"
                                id={`item-src-${index}`}
                                value={item.src}
                                onChange={(e) => handleItemChange(index, 'src', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="form-control"
                            />
                        </div>
                        {/* Placeholder for Image Search & Upload */}
                        <div className="image-source-helpers">
                             <button type="button" onClick={() => handleImageSearch(index)} className="btn btn-outline-secondary btn-small">
                                {t('searchImageBtn') || 'Search Online'}
                            </button>
                            {/* <input type="file" onChange={(e) => handleFileUpload(index, e.target.files[0])} /> */}
                        </div>

                        <div className="form-group">
                            <label htmlFor={`item-text-${index}`}>{t('captionLabel', { lang: currentUILanguage }) || `Caption (${currentUILanguage}):`}</label>
                            <input
                                type="text"
                                id={`item-text-${index}`}
                                value={item.text?.[currentUILanguage] || ''}
                                onChange={(e) => handleItemChange(index, 'text', e.target.value)}
                                placeholder={t('captionPlaceholder') || "Optional caption"}
                                className="form-control"
                            />
                        </div>
                        <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-danger btn-small remove-item-btn">
                            {t('removeImageBtn') || 'Remove Image'}
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" onClick={handleAddItem} className="btn btn-info add-item-btn">
                {t('addImageBtn') || 'Add Another Image'}
            </button>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    {t('cancelBtn') || 'Cancel'}
                </button>
                <button type="button" onClick={handleSave} className="btn btn-primary">
                    {t('saveBtn') || 'Save Carousel'}
                </button>
            </div>
        </div>
    );
};

export default ConfigurePictureCarousel;
