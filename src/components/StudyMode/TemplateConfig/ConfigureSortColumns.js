import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureSortColumns.css'; // To be created

const ConfigureSortColumns = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    // Initialize with at least two columns if no existing data
    const initialColumns = existingBlockData?.columns?.length >= 2 
        ? existingBlockData.columns 
        : [
            { id: `col_${Date.now()}_0`, titles: {}, items: [{ id: `item_${Date.now()}_0_0`, texts: {} }] },
            { id: `col_${Date.now()}_1`, titles: {}, items: [{ id: `item_${Date.now()}_1_0`, texts: {} }] }
          ];
    const [columns, setColumns] = useState(initialColumns);

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            const loadedColumns = existingBlockData.columns || [
                { id: `col_${Date.now()}_0`, titles: {}, items: [{ id: `item_${Date.now()}_0_0`, texts: {} }] },
                { id: `col_${Date.now()}_1`, titles: {}, items: [{ id: `item_${Date.now()}_1_0`, texts: {} }] }
            ];
            // Ensure each loaded column and item has texts for all available languages
            const processedColumns = loadedColumns.map(col => ({
                ...col,
                titles: ensureAllLangs(col.titles || {}, availableLanguages, ''),
                items: (col.items || [{ id: `item_${Date.now()}_new_0`, texts: {} }]).map(item => ({
                    ...item,
                    texts: ensureAllLangs(item.texts || {}, availableLanguages, '')
                }))
            }));
            setColumns(processedColumns);
        } else {
            // For new blocks, ensure initial columns have multilingual structures
             setColumns(prevCols => prevCols.map(col => ({
                ...col,
                titles: ensureAllLangs(col.titles || {}, availableLanguages, ''),
                items: (col.items || []).map(item => ({
                    ...item,
                    texts: ensureAllLangs(item.texts || {}, availableLanguages, '')
                }))
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

    const handleColumnTitleChange = (colIndex, lang, value) => {
        const newColumns = [...columns];
        if (!newColumns[colIndex].titles) newColumns[colIndex].titles = {};
        newColumns[colIndex].titles[lang] = value;
        setColumns(newColumns);
    };

    const handleItemTextChange = (colIndex, itemIndex, lang, value) => {
        const newColumns = [...columns];
        if (!newColumns[colIndex].items[itemIndex].texts) newColumns[colIndex].items[itemIndex].texts = {};
        newColumns[colIndex].items[itemIndex].texts[lang] = value;
        setColumns(newColumns);
    };

    const addColumn = () => {
        if (columns.length < 4) { // Max 4 columns for simplicity
            const newColId = `col_${Date.now()}_${columns.length}`;
            const newItemForCol = { id: `item_${newColId}_0`, texts: {} };
            availableLanguages.forEach(lang => {
                newItemForCol.texts[lang] = '';
            });
            setColumns([...columns, { id: newColId, titles: ensureAllLangs({}, availableLanguages, ''), items: [newItemForCol] }]);
        } else {
            alert(t('maxColumnsReached') || 'Maximum of 4 columns allowed.');
        }
    };

    const removeColumn = (colIndex) => {
        if (columns.length > 2) { // Min 2 columns
            setColumns(columns.filter((_, i) => i !== colIndex));
        } else {
            alert(t('minColumnsRequired') || 'Minimum of 2 columns required.');
        }
    };

    const addItemToColumn = (colIndex) => {
        const newColumns = [...columns];
        const newItemId = `item_${newColumns[colIndex].id}_${newColumns[colIndex].items.length}`;
        const newItem = { id: newItemId, texts: {} };
        availableLanguages.forEach(lang => {
            newItem.texts[lang] = '';
        });
        newColumns[colIndex].items.push(newItem);
        setColumns(newColumns);
    };

    const removeItemFromColumn = (colIndex, itemIndex) => {
        const newColumns = [...columns];
        if (newColumns[colIndex].items.length > 1) { // Min 1 item per column
            newColumns[colIndex].items = newColumns[colIndex].items.filter((_, i) => i !== itemIndex);
            setColumns(newColumns);
        } else {
            alert(t('minOneItemPerColumn') || 'Each column must have at least one item.');
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
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Sort into Columns';
            }
        });

        const validColumns = columns.filter(col => 
            (col.titles[currentUILanguage]?.trim() || col.titles.COSYenglish?.trim()) && col.items.length > 0 && 
            col.items.every(item => item.texts[currentUILanguage]?.trim() || item.texts.COSYenglish?.trim())
        );

        if (validColumns.length < 2) {
            alert(t('alertMinTwoValidColumnsSort') || 'Please configure at least two columns, each with a title and at least one item.');
            return;
        }
        
        const processedColumns = validColumns.map(col => {
            const newColTitles = { ...col.titles };
            availableLanguages.forEach(lang => {
                if (!newColTitles[lang] || newColTitles[lang].trim() === '') {
                    newColTitles[lang] = newColTitles[currentUILanguage]?.trim() || newColTitles.COSYenglish?.trim() || `Category ${col.id}`;
                }
            });
            const newColItems = col.items.map(item => {
                const newItemTexts = { ...item.texts };
                 availableLanguages.forEach(lang => {
                    if (!newItemTexts[lang] || newItemTexts[lang].trim() === '') {
                        newItemTexts[lang] = newItemTexts[currentUILanguage]?.trim() || newItemTexts.COSYenglish?.trim() || `Item ${item.id}`;
                    }
                });
                return { ...item, texts: newItemTexts };
            });
            return { ...col, titles: newColTitles, items: newColItems };
        });


        onSave({
            id: existingBlockData?.id || `sc_${Date.now()}`,
            type: 'interactive/columnsort',
            title: titleToSave,
            columns: processedColumns,
        });
    };

    return (
        <div className="configure-sort-columns">
            <h4>{t('configureSortColumnsTitle') || 'Configure Sort into Columns'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-sc">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-sc"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., Categorize these words'}
                />
            </div>

            <div className="columns-configuration-area">
                {columns.map((column, colIndex) => (
                    <div key={column.id || colIndex} className="column-config-section">
                        <h5>{t('columnNumberLabel', { number: colIndex + 1}) || `Column ${colIndex + 1}`}
                            {columns.length > 2 && (
                                <button onClick={() => removeColumn(colIndex)} className="btn btn-danger btn-sm remove-column-btn">
                                    {t('removeColumnBtn') || 'Remove Column'}
                                </button>
                            )}
                        </h5>
                        <div className="form-group">
                            <label htmlFor={`col-title-${colIndex}-${currentUILanguage}`}>
                                {t('columnTitleLabel', { langName: currentUILanguage.replace('COSY','') }) || `Title (${currentUILanguage.replace('COSY','')})`}:
                            </label>
                            <input
                                type="text"
                                id={`col-title-${colIndex}-${currentUILanguage}`}
                                value={column.titles?.[currentUILanguage] || ''}
                                onChange={(e) => handleColumnTitleChange(colIndex, currentUILanguage, e.target.value)}
                                placeholder={t('enterColumnTitlePlaceholder') || 'E.g., Fruits'}
                            />
                        </div>
                        
                        <h6>{t('itemsForColumnLabel') || 'Items for this column'}:</h6>
                        {column.items.map((item, itemIndex) => (
                            <div key={item.id || itemIndex} className="item-config-entry">
                                <div className="form-group">
                                     <label htmlFor={`item-text-${colIndex}-${itemIndex}-${currentUILanguage}`}>
                                        {t('itemTextLabel', { langName: currentUILanguage.replace('COSY','') }) || `Item (${currentUILanguage.replace('COSY','')})`}:
                                    </label>
                                    <input
                                        type="text"
                                        id={`item-text-${colIndex}-${itemIndex}-${currentUILanguage}`}
                                        value={item.texts?.[currentUILanguage] || ''}
                                        onChange={(e) => handleItemTextChange(colIndex, itemIndex, currentUILanguage, e.target.value)}
                                        placeholder={t('enterItemTextPlaceholder') || 'E.g., Apple'}
                                    />
                                </div>
                                {column.items.length > 1 && (
                                    <button onClick={() => removeItemFromColumn(colIndex, itemIndex)} className="btn btn-danger btn-sm remove-item-btn">
                                        {t('removeItemBtn') || 'Remove Item'}
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addItemToColumn(colIndex)} className="btn btn-secondary btn-sm add-item-btn">
                             {t('addItemToColumnBtn') || '+ Add Item to this Column'}
                        </button>
                    </div>
                ))}
            </div>

            {columns.length < 4 && (
                <button onClick={addColumn} className="btn btn-info add-column-main-btn">
                    {t('addColumnOverallBtn') || '+ Add Another Column'}
                </button>
            )}

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureSortColumns;
