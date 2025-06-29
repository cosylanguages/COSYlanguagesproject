import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for items
import './ConfigureFillGapsHint.css';

const ConfigureFillGapsHint = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [title, setTitle] = useState({});
    const [instructions, setInstructions] = useState({});
    const [items, setItems] = useState([]);
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setInstructions(existingBlockData.instructions || {});
            setItems(existingBlockData.items || []);
        } else {
            // Initialize with one empty item if creating a new block
            setItems([{ id: uuidv4(), textBefore: {}, textAfter: {}, hint: {}, answer: {} }]);
        }
        if (availableLanguages && availableLanguages.length > 0 && !availableLanguages.includes(selectedLang)) {
            setSelectedLang(availableLanguages[0]);
        } else if (availableLanguages && availableLanguages.length > 0 && availableLanguages.includes(currentUILanguage)) {
            setSelectedLang(currentUILanguage);
        }


    }, [existingBlockData, currentUILanguage, availableLanguages]);
    
    useEffect(() => {
        // If currentUILanguage is available, switch to it, otherwise stick to selectedLang or first available.
        if (availableLanguages && availableLanguages.includes(currentUILanguage)) {
            setSelectedLang(currentUILanguage);
        } else if (availableLanguages && availableLanguages.length > 0 && !availableLanguages.includes(selectedLang)) {
            // Fallback if current UI lang is not in the list (e.g. after lang removal)
            setSelectedLang(availableLanguages[0]);
        }
    }, [currentUILanguage, availableLanguages, selectedLang]);


    const handleMultilingualChange = (setter, lang, value) => {
        setter(prev => ({
            ...prev,
            [lang]: value
        }));
    };

    const handleItemChange = (itemId, field, lang, value) => {
        setItems(prevItems => prevItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    [field]: {
                        ...(item[field] || {}),
                        [lang]: value
                    }
                };
            }
            return item;
        }));
    };

    const handleAddItem = () => {
        setItems([...items, { id: uuidv4(), textBefore: {}, textAfter: {}, hint: {}, answer: {} }]);
    };

    const handleRemoveItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'grammar/fillgaps', // Changed to match templateSections.js
            title,
            instructions,
            items,
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-fill-gaps-hint">
            <h3>{t('configureFillGapsHintTitle') || 'Configure Fill in the Gaps (with Hints)'}</h3>

            <div className="language-selector-tabs">
                {availableLanguages.map(langCode => (
                    <button
                        key={langCode}
                        type="button"
                        className={`lang-tab-btn ${selectedLang === langCode ? 'active' : ''}`}
                        onClick={() => setSelectedLang(langCode)}
                    >
                        {langCode}
                    </button>
                ))}
            </div>

            <div className="form-group">
                <label htmlFor="fgh-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="fgh-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>

            <div className="form-group">
                <label htmlFor="fgh-instructions">{t('blockInstructionsLabelOptional') || 'Instructions (Optional)'}:</label>
                <textarea
                    id="fgh-instructions"
                    value={instructions[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setInstructions, selectedLang, e.target.value)}
                    placeholder={t('enterInstructionsPlaceholder', { lang: selectedLang }) || `Enter instructions in ${selectedLang}`}
                />
            </div>

            <h4>{t('gapEntriesLabel') || 'Gap Entries'}:</h4>
            {items.map((item, index) => (
                <div key={item.id} className="gap-item-entry">
                    <h5>{t('gapItemNumberLabel', { number: index + 1 }) || `Gap Item #${index + 1}`}</h5>
                    <div className="form-group">
                        <label htmlFor={`fgh-textBefore-${item.id}`}>{t('textBeforeGapLabel') || 'Text Before Gap'}:</label>
                        <input
                            id={`fgh-textBefore-${item.id}`}
                            type="text"
                            value={item.textBefore?.[selectedLang] || ''}
                            onChange={(e) => handleItemChange(item.id, 'textBefore', selectedLang, e.target.value)}
                            placeholder={t('textBeforePlaceholder', { lang: selectedLang })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`fgh-answer-${item.id}`}>{t('answerInGapLabel') || 'Answer (Word in Gap)'}:</label>
                        <input
                            id={`fgh-answer-${item.id}`}
                            type="text"
                            value={item.answer?.[selectedLang] || ''}
                            onChange={(e) => handleItemChange(item.id, 'answer', selectedLang, e.target.value)}
                            placeholder={t('answerPlaceholder', { lang: selectedLang })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`fgh-textAfter-${item.id}`}>{t('textAfterGapLabel') || 'Text After Gap'}:</label>
                        <input
                            id={`fgh-textAfter-${item.id}`}
                            type="text"
                            value={item.textAfter?.[selectedLang] || ''}
                            onChange={(e) => handleItemChange(item.id, 'textAfter', selectedLang, e.target.value)}
                            placeholder={t('textAfterPlaceholder', { lang: selectedLang })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`fgh-hint-${item.id}`}>{t('hintForGapLabel') || 'Hint for Gap'}:</label>
                        <input
                            id={`fgh-hint-${item.id}`}
                            type="text"
                            value={item.hint?.[selectedLang] || ''}
                            onChange={(e) => handleItemChange(item.id, 'hint', selectedLang, e.target.value)}
                            placeholder={t('hintPlaceholder', { lang: selectedLang })}
                        />
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="btn-danger btn-small">
                        {t('removeGapItemBtn') || 'Remove Gap Item'}
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddItem} className="btn-secondary" style={{ marginTop: '10px', marginBottom: '20px' }}>
                {t('addGapItemBtn') || '➕ Add Gap Item'}
            </button>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureFillGapsHint;
