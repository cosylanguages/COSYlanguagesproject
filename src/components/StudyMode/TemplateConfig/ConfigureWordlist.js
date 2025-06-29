import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureWordlist.css'; // To be created

const ConfigureWordlist = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    // Initialize with at least one item if no existing data
    const initialItems = existingBlockData?.items?.length >= 1
        ? existingBlockData.items
        : [{ id: `wl_item_${Date.now()}_0`, term1Texts: {}, term2Texts: {} }]; // term1Texts, term2Texts
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            const loadedItems = existingBlockData.items || [{ id: `wl_item_${Date.now()}_0`, term1Texts: {}, term2Texts: {} }];
            const processedItems = loadedItems.map(item => ({
                ...item,
                term1Texts: ensureAllLangs(item.term1Texts || {}, availableLanguages, ''),
                term2Texts: ensureAllLangs(item.term2Texts || {}, availableLanguages, '') 
            }));
            setItems(processedItems);
        } else {
            // For new blocks, ensure initial item has multilingual structure
            setItems(prevItems => prevItems.map(item => ({
                ...item,
                term1Texts: ensureAllLangs(item.term1Texts || {}, availableLanguages, ''),
                term2Texts: ensureAllLangs(item.term2Texts || {}, availableLanguages, '')
            })));
        }
    }, [existingBlockData, availableLanguages]);

    const ensureAllLangs = (textObj, langs, defaultValue = '') => {
        const newTextObj = { ...textObj };
        langs.forEach(lang => {
            if (newTextObj[lang] === undefined || newTextObj[lang] === null) {
                newTextObj[lang] = defaultValue;
            }
        });
        return newTextObj;
    };

    const handleBlockTitleChange = (lang, value) => {
        setBlockTitle(prev => ({ ...prev, [lang]: value }));
    };

    const handleItemChange = (index, fieldName, lang, value) => { // fieldName is 'term1Texts' or 'term2Texts'
        const newItems = [...items];
        if (!newItems[index][fieldName]) newItems[index][fieldName] = {};
        newItems[index][fieldName][lang] = value;
        setItems(newItems);
    };

    const addItem = () => {
        const newItem = { id: `wl_item_${Date.now()}_${items.length}`, term1Texts: {}, term2Texts: {} };
        availableLanguages.forEach(lang => {
            newItem.term1Texts[lang] = '';
            newItem.term2Texts[lang] = '';
        });
        setItems([...items, newItem]);
    };

    const removeItem = (index) => {
        if (items.length > 1) { // Must have at least one item
            setItems(items.filter((_, i) => i !== index));
        } else {
            alert(t('minOneItemWordlist') || 'At least one item is required for the wordlist.');
        }
    };
    
    const moveItem = (index, direction) => {
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newItems.length) {
            [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
            setItems(newItems);
        }
    };


    const handleSaveConfiguration = () => {
        const titleToSave = { ...blockTitle };
        if (!titleToSave[currentUILanguage] && !titleToSave.COSYenglish) {
            alert(t('alertTitleRequired') || `Please enter a title for the block.`);
            return;
        }
        availableLanguages.forEach(lang => {
            if (!titleToSave[lang]) {
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Wordlist';
            }
        });

        const validItems = items.filter(item => 
            Object.values(item.term1Texts).some(text => text.trim() !== '') // At least one language has term1
        );

        if (validItems.length === 0) {
            alert(t('alertMinOneItemWordlistPopulated') || 'Please add at least one item with text for Term 1.');
            return;
        }
        
        const processedItems = validItems.map(item => {
            const newTerm1Texts = { ...item.term1Texts };
            const newTerm2Texts = { ...item.term2Texts };
            availableLanguages.forEach(lang => {
                if (!newTerm1Texts[lang] || newTerm1Texts[lang].trim() === '') {
                    newTerm1Texts[lang] = newTerm1Texts[currentUILanguage]?.trim() || newTerm1Texts.COSYenglish?.trim() || `Term 1 for ${item.id}`;
                }
                // Term 2 can be optional, so if not provided in UI lang or English, keep it as is (empty or other lang's value)
                if (newTerm2Texts[lang] === undefined || newTerm2Texts[lang] === null) {
                     newTerm2Texts[lang] = ''; // Default to empty if not set for a language
                }
            });
            return { ...item, term1Texts: newTerm1Texts, term2Texts: newTerm2Texts };
        });

        onSave({
            id: existingBlockData?.id || `wl_${Date.now()}`,
            type: 'vocabulary/words',
            title: titleToSave,
            items: processedItems,
        });
    };

    return (
        <div className="configure-wordlist">
            <h4>{t('configureWordlistTitle') || 'Configure Wordlist'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-wl">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-wl"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., Key Vocabulary'}
                />
            </div>

            <div className="wordlist-items-configuration">
                {items.map((item, index) => (
                    <div key={item.id || index} className="wordlist-item-config-entry">
                        <h5>
                            {t('itemNumberLabel', { number: index + 1}) || `Item ${index + 1}`}
                            <span className="item-controls">
                                <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="btn btn-sm btn-light">↑</button>
                                <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="btn btn-sm btn-light">↓</button>
                                {items.length > 1 && (
                                    <button onClick={() => removeItem(index)} className="btn btn-danger btn-sm remove-item-btn">
                                        {t('removeItemBtn') || 'Remove'}
                                    </button>
                                )}
                            </span>
                        </h5>
                        <div className="form-group">
                            <label htmlFor={`wl-term1-${index}-${currentUILanguage}`}>
                                {t('term1Label', { langName: currentUILanguage.replace('COSY','') }) || `Term 1 (${currentUILanguage.replace('COSY','')})`}:
                            </label>
                            <input
                                type="text"
                                id={`wl-term1-${index}-${currentUILanguage}`}
                                value={item.term1Texts?.[currentUILanguage] || ''}
                                onChange={(e) => handleItemChange(index, 'term1Texts', currentUILanguage, e.target.value)}
                                placeholder={t('enterTerm1Placeholder') || 'E.g., Word/Phrase'}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor={`wl-term2-${index}-${currentUILanguage}`}>
                                {t('term2LabelOptional', { langName: currentUILanguage.replace('COSY','') }) || `Term 2 (Optional - ${currentUILanguage.replace('COSY','')})`}:
                            </label>
                            <input
                                type="text"
                                id={`wl-term2-${index}-${currentUILanguage}`}
                                value={item.term2Texts?.[currentUILanguage] || ''}
                                onChange={(e) => handleItemChange(index, 'term2Texts', currentUILanguage, e.target.value)}
                                placeholder={t('enterTerm2Placeholder') || 'E.g., Translation, Definition'}
                            />
                        </div>
                         {/* Optionally show inputs for other languages too */}
                    </div>
                ))}
            </div>

            <button onClick={addItem} className="btn btn-secondary add-item-btn-wl">
                {t('addItemBtn') || '+ Add Item'}
            </button>

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureWordlist;
