import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ConfigureParagraphOrder.css'; // To be created

const ConfigureParagraphOrder = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();

    const [blockTitle, setBlockTitle] = useState(existingBlockData?.title || {});
    // Initialize with at least two paragraphs if no existing data
    const initialParagraphs = existingBlockData?.paragraphs?.length >= 1
        ? existingBlockData.paragraphs
        : [{ id: `p_${Date.now()}_0`, texts: {} }];
    const [paragraphs, setParagraphs] = useState(initialParagraphs);

    useEffect(() => {
        if (existingBlockData) {
            setBlockTitle(existingBlockData.title || {});
            const loadedParagraphs = existingBlockData.paragraphs || [{ id: `p_${Date.now()}_0`, texts: {} }];
            const processedParagraphs = loadedParagraphs.map(p => ({
                ...p,
                texts: ensureAllLangs(p.texts || {}, availableLanguages, '')
            }));
            setParagraphs(processedParagraphs);
        } else {
            // For new blocks, ensure initial paragraph has multilingual structure
            setParagraphs(prevParagraphs => prevParagraphs.map(p => ({
                ...p,
                texts: ensureAllLangs(p.texts || {}, availableLanguages, '')
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

    const handleParagraphTextChange = (index, lang, value) => {
        const newParagraphs = [...paragraphs];
        if (!newParagraphs[index].texts) newParagraphs[index].texts = {};
        newParagraphs[index].texts[lang] = value;
        setParagraphs(newParagraphs);
    };

    const addParagraph = () => {
        const newParagraph = { id: `p_${Date.now()}_${paragraphs.length}`, texts: {} };
        availableLanguages.forEach(lang => {
            newParagraph.texts[lang] = '';
        });
        setParagraphs([...paragraphs, newParagraph]);
    };

    const removeParagraph = (index) => {
        if (paragraphs.length > 1) { // Must have at least one paragraph
            setParagraphs(paragraphs.filter((_, i) => i !== index));
        } else {
            alert(t('minOneParagraphRequired') || 'At least one paragraph is required.');
        }
    };

    const moveParagraph = (index, direction) => {
        const newParagraphs = [...paragraphs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newParagraphs.length) {
            [newParagraphs[index], newParagraphs[targetIndex]] = [newParagraphs[targetIndex], newParagraphs[index]];
            setParagraphs(newParagraphs);
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
                titleToSave[lang] = titleToSave[currentUILanguage] || titleToSave.COSYenglish || 'Order the Paragraphs';
            }
        });

        const validParagraphs = paragraphs.filter(p => 
            Object.values(p.texts).some(text => text.trim() !== '')
        );

        if (validParagraphs.length < 2) { // Typically need at least 2 to order
            alert(t('alertMinTwoParagraphsOrder') || 'Please configure at least two non-empty paragraphs for this exercise.');
            return;
        }
        
        const processedParagraphs = validParagraphs.map(p => {
            const newTexts = { ...p.texts };
            availableLanguages.forEach(lang => {
                if (!newTexts[lang] || newTexts[lang].trim() === '') {
                    // Fallback to current UI lang, then English, then a placeholder.
                    newTexts[lang] = newTexts[currentUILanguage]?.trim() || newTexts.COSYenglish?.trim() || `Paragraph ${p.id}`;
                }
            });
            return { ...p, texts: newTexts };
        });

        onSave({
            id: existingBlockData?.id || `po_${Date.now()}`,
            type: 'interactive/textorder', // Correct type for paragraph order
            title: titleToSave,
            paragraphs: processedParagraphs, // This array's order IS the correct order
        });
    };

    return (
        <div className="configure-paragraph-order">
            <h4>{t('configureParagraphOrderTitle') || 'Configure Paragraph Order'}</h4>

            <div className="form-group">
                <label htmlFor="block-title-po">{t('blockTitleLabel') || 'Block Title'} ({currentUILanguage}):</label>
                <input
                    type="text"
                    id="block-title-po"
                    value={blockTitle[currentUILanguage] || blockTitle.COSYenglish || ''}
                    onChange={(e) => handleBlockTitleChange(currentUILanguage, e.target.value)}
                    placeholder={t('enterBlockTitlePlaceholder') || 'E.g., Reconstruct the Story'}
                />
            </div>

            <div className="paragraphs-configuration-area">
                {paragraphs.map((paragraph, index) => (
                    <div key={paragraph.id || index} className="paragraph-config-entry">
                        <h5>
                            {t('paragraphNumberLabel', { number: index + 1}) || `Paragraph ${index + 1}`}
                            <span className="paragraph-controls">
                                <button onClick={() => moveParagraph(index, 'up')} disabled={index === 0} className="btn btn-sm btn-light">↑</button>
                                <button onClick={() => moveParagraph(index, 'down')} disabled={index === paragraphs.length - 1} className="btn btn-sm btn-light">↓</button>
                                {paragraphs.length > 1 && (
                                    <button onClick={() => removeParagraph(index)} className="btn btn-danger btn-sm remove-paragraph-btn">
                                        {t('removeParagraphBtn') || 'Remove'}
                                    </button>
                                )}
                            </span>
                        </h5>
                        <div className="form-group">
                            <label htmlFor={`paragraph-text-${index}-${currentUILanguage}`}>
                                {t('paragraphTextLabel', { langName: currentUILanguage.replace('COSY','') }) || `Text (${currentUILanguage.replace('COSY','')})`}:
                            </label>
                            <textarea
                                id={`paragraph-text-${index}-${currentUILanguage}`}
                                value={paragraph.texts?.[currentUILanguage] || ''}
                                onChange={(e) => handleParagraphTextChange(index, currentUILanguage, e.target.value)}
                                placeholder={t('enterParagraphTextPlaceholder') || 'Enter paragraph text...'}
                                rows="4"
                            />
                        </div>
                        {/* Optionally show inputs for other languages too, or a toggle */}
                    </div>
                ))}
            </div>

            <button onClick={addParagraph} className="btn btn-secondary add-paragraph-btn">
                {t('addParagraphBtn') || '+ Add Paragraph'}
            </button>

            <div className="form-actions">
                <button onClick={handleSaveConfiguration} className="btn btn-primary">{t('saveConfigurationBtn') || 'Save Configuration'}</button>
                <button onClick={onCancel} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </div>
    );
};

export default ConfigureParagraphOrder;
