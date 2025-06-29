import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid';
import './ConfigureWordOrder.css';

const ConfigureWordOrder = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [title, setTitle] = useState({});
    const [instructions, setInstructions] = useState({});
    const [sentences, setSentences] = useState([]);
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setInstructions(existingBlockData.instructions || {});
            setSentences(existingBlockData.sentences || [{ id: uuidv4(), orderedPattern: {} }]);
        } else {
            setSentences([{ id: uuidv4(), orderedPattern: {} }]);
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

    const handleSentenceChange = (sentenceId, lang, value) => {
        setSentences(prevSentences => prevSentences.map(sentence => {
            if (sentence.id === sentenceId) {
                return {
                    ...sentence,
                    orderedPattern: {
                        ...(sentence.orderedPattern || {}),
                        [lang]: value
                    }
                };
            }
            return sentence;
        }));
    };

    const handleAddSentence = () => {
        setSentences([...sentences, { id: uuidv4(), orderedPattern: {} }]);
    };

    const handleRemoveSentence = (sentenceId) => {
        setSentences(sentences.filter(s => s.id !== sentenceId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'grammar/wordorder', // Type path from templateSections.js
            title,
            instructions,
            sentences,
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-word-order">
            <h3>{t('configureWordOrderBlockTitle') || 'Configure Word Order Sentences'}</h3>

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
                <label htmlFor="wo-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="wo-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>

            <div className="form-group">
                <label htmlFor="wo-instructions">{t('blockInstructionsLabelOptional') || 'Instructions (Optional)'}:</label>
                <textarea
                    id="wo-instructions"
                    value={instructions[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setInstructions, selectedLang, e.target.value)}
                    placeholder={t('enterInstructionsPlaceholder', { lang: selectedLang }) || `Enter instructions in ${selectedLang}`}
                />
            </div>

            <h4>{t('sentencesLabel') || 'Sentences'}:</h4>
            <p className="wo-format-hint">
                {t('woFormatHint') || "Enter sentences with words/phrases separated by a forward slash (e.g., word1/phrase two/word3)."}
            </p>
            {sentences.map((sentence, index) => (
                <div key={sentence.id} className="wo-sentence-entry">
                    <h5>{t('sentenceNumberLabel', { number: index + 1 }) || `Sentence #${index + 1}`}</h5>
                    <div className="form-group">
                        <label htmlFor={`wo-sentence-pattern-${sentence.id}`}>
                            {t('sentencePatternSlashSeparatedLabel', { lang: selectedLang }) || `Sentence Pattern (${selectedLang})`}:
                        </label>
                        <textarea
                            id={`wo-sentence-pattern-${sentence.id}`}
                            value={sentence.orderedPattern?.[selectedLang] || ''}
                            onChange={(e) => handleSentenceChange(sentence.id, selectedLang, e.target.value)}
                            placeholder={t('enterWoPatternPlaceholder') || "e.g., We/moved/to California/last/summer."}
                            rows="2"
                        />
                    </div>
                    <button type="button" onClick={() => handleRemoveSentence(sentence.id)} className="btn-danger btn-small">
                        {t('removeSentenceBtn') || 'Remove Sentence'}
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddSentence} className="btn-secondary" style={{ marginTop: '10px', marginBottom: '20px' }}>
                {t('addSentenceBtn') || '➕ Add Sentence'}
            </button>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureWordOrder;
