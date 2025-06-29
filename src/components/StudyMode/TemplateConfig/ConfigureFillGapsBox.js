import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid';
import './ConfigureFillGapsBox.css';

const ConfigureFillGapsBox = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [title, setTitle] = useState({});
    const [instructions, setInstructions] = useState({});
    const [textWithGaps, setTextWithGaps] = useState({});
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setInstructions(existingBlockData.instructions || {});
            setTextWithGaps(existingBlockData.textWithGaps || {});
        } else {
            setTitle({});
            setInstructions({});
            setTextWithGaps({});
        }
        if (availableLanguages && availableLanguages.length > 0 && !availableLanguages.includes(selectedLang)) {
            setSelectedLang(availableLanguages[0]);
        } else if (availableLanguages && availableLanguages.length > 0 && availableLanguages.includes(currentUILanguage)){
            setSelectedLang(currentUILanguage);
        }
    }, [existingBlockData, currentUILanguage, availableLanguages]);
    
    useEffect(() => {
        if (availableLanguages && availableLanguages.includes(currentUILanguage)) {
            setSelectedLang(currentUILanguage);
        } else if (availableLanguages && availableLanguages.length > 0 && !availableLanguages.includes(selectedLang)) {
            setSelectedLang(availableLanguages[0]);
        }
    }, [currentUILanguage, availableLanguages, selectedLang]);


    const handleMultilingualChange = (setter, lang, value) => {
        setter(prev => ({ ...prev, [lang]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'interactive/move-word-gap', // Type path from templateSections.js
            title,
            instructions,
            textWithGaps,
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-fill-gaps-box">
            <h3>{t('configureFillGapsBoxTitle') || 'Configure Fill in the Gaps (from Box)'}</h3>

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
                <label htmlFor="fgbox-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="fgbox-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>

            <div className="form-group">
                <label htmlFor="fgbox-instructions">{t('blockInstructionsLabelOptional') || 'Instructions (Optional)'}:</label>
                <textarea
                    id="fgbox-instructions"
                    value={instructions[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setInstructions, selectedLang, e.target.value)}
                    placeholder={t('enterInstructionsPlaceholder', { lang: selectedLang }) || `Enter instructions in ${selectedLang}`}
                />
            </div>

            <div className="form-group">
                <label htmlFor="fgbox-textWithGaps">
                    {t('mainTextWithBracketsLabel', { lang: selectedLang }) || `Main Text with [word] for gaps (${selectedLang})`}:
                </label>
                <textarea
                    id="fgbox-textWithGaps"
                    value={textWithGaps[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTextWithGaps, selectedLang, e.target.value)}
                    placeholder={t('enterTextWithGapsPlaceholder') || "e.g., The [quick] brown [fox] ..."}
                    rows="5"
                />
                <p className="fgbox-format-hint">
                    {t('fgboxFormatHint') || "Use brackets [word] to indicate words that will appear in the draggable word box."}
                </p>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureFillGapsBox;
