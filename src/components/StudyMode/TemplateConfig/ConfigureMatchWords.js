import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid';
import './ConfigureMatchWords.css';

const ConfigureMatchWords = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [title, setTitle] = useState({});
    const [instructions, setInstructions] = useState({});
    const [pairs, setPairs] = useState([]);
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setInstructions(existingBlockData.instructions || {});
            setPairs(existingBlockData.pairs || [{ id: uuidv4(), term1: {}, term2: {} }]);
        } else {
            setPairs([{ id: uuidv4(), term1: {}, term2: {} }]);
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

    const handlePairChange = (pairId, termKey, lang, value) => {
        setPairs(prevPairs => prevPairs.map(pair => {
            if (pair.id === pairId) {
                return {
                    ...pair,
                    [termKey]: {
                        ...(pair[termKey] || {}),
                        [lang]: value
                    }
                };
            }
            return pair;
        }));
    };

    const handleAddPair = () => {
        setPairs([...pairs, { id: uuidv4(), term1: {}, term2: {} }]);
    };

    const handleRemovePair = (pairId) => {
        setPairs(pairs.filter(p => p.id !== pairId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'interactive/matchpairs', // Type path from templateSections.js
            title,
            instructions,
            pairs,
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-match-words">
            <h3>{t('configureMatchWordsTitle') || 'Configure Match the Words'}</h3>

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
                <label htmlFor="mw-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="mw-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>

            <div className="form-group">
                <label htmlFor="mw-instructions">{t('blockInstructionsLabelOptional') || 'Instructions (Optional)'}:</label>
                <textarea
                    id="mw-instructions"
                    value={instructions[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setInstructions, selectedLang, e.target.value)}
                    placeholder={t('enterInstructionsPlaceholder', { lang: selectedLang }) || `Enter instructions in ${selectedLang}`}
                />
            </div>

            <h4>{t('wordPairsLabel') || 'Word Pairs'}:</h4>
            {pairs.map((pair, index) => (
                <div key={pair.id} className="mw-pair-entry">
                    <h5>{t('pairNumberLabel', { number: index + 1 }) || `Pair #${index + 1}`}</h5>
                    <div className="form-group">
                        <label htmlFor={`mw-term1-${pair.id}`}>
                            {t('term1Label', { lang: selectedLang }) || `Term 1 (${selectedLang})`}:
                        </label>
                        <input
                            id={`mw-term1-${pair.id}`}
                            type="text"
                            value={pair.term1?.[selectedLang] || ''}
                            onChange={(e) => handlePairChange(pair.id, 'term1', selectedLang, e.target.value)}
                            placeholder={t('enterTerm1Placeholder') || "Enter first word/phrase"}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`mw-term2-${pair.id}`}>
                            {t('term2Label', { lang: selectedLang }) || `Term 2 (${selectedLang})`}:
                        </label>
                        <input
                            id={`mw-term2-${pair.id}`}
                            type="text"
                            value={pair.term2?.[selectedLang] || ''}
                            onChange={(e) => handlePairChange(pair.id, 'term2', selectedLang, e.target.value)}
                            placeholder={t('enterTerm2Placeholder') || "Enter matching word/phrase"}
                        />
                    </div>
                    <button type="button" onClick={() => handleRemovePair(pair.id)} className="btn-danger btn-small">
                        {t('removePairBtn') || 'Remove Pair'}
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddPair} className="btn-secondary" style={{ marginTop: '10px', marginBottom: '20px' }}>
                {t('addPairBtn') || '➕ Add Pair'}
            </button>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureMatchWords;
