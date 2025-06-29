import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { v4 as uuidv4 } from 'uuid';
import './ConfigureTrueFalseBlock.css';

const ConfigureTrueFalseBlock = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage } = useI18n();
    const [title, setTitle] = useState({});
    const [instructions, setInstructions] = useState({});
    const [statements, setStatements] = useState([]);
    const [selectedLang, setSelectedLang] = useState(currentUILanguage);

    useEffect(() => {
        if (existingBlockData) {
            setTitle(existingBlockData.title || {});
            setInstructions(existingBlockData.instructions || {});
            setStatements(existingBlockData.statements || [{ id: uuidv4(), text: {}, isCorrect: true }]);
        } else {
            setStatements([{ id: uuidv4(), text: {}, isCorrect: true }]);
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

    const handleStatementTextChange = (statementId, lang, value) => {
        setStatements(prevStatements => prevStatements.map(stmt => {
            if (stmt.id === statementId) {
                return { ...stmt, text: { ...(stmt.text || {}), [lang]: value } };
            }
            return stmt;
        }));
    };

    const handleStatementCorrectnessChange = (statementId, isCorrectValue) => {
        setStatements(prevStatements => prevStatements.map(stmt => {
            if (stmt.id === statementId) {
                return { ...stmt, isCorrect: isCorrectValue };
            }
            return stmt;
        }));
    };

    const handleAddStatement = () => {
        setStatements([...statements, { id: uuidv4(), text: {}, isCorrect: true }]);
    };

    const handleRemoveStatement = (statementId) => {
        setStatements(statements.filter(s => s.id !== statementId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const blockData = {
            id: existingBlockData?.id || uuidv4(),
            type: 'comprehension/truefalse', // Type path from templateSections.js
            title,
            instructions,
            statements,
        };
        onSave(blockData);
    };

    if (!availableLanguages || availableLanguages.length === 0) {
        return <p>{t('errorNoLanguagesConfigured') || 'Error: No languages configured for this course.'}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="configure-true-false-block">
            <h3>{t('configureTrueFalseBlockTitle') || 'Configure True/False Statements'}</h3>

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
                <label htmlFor="tf-title">{t('blockTitleLabelOptional') || 'Title (Optional)'}:</label>
                <input
                    id="tf-title"
                    type="text"
                    value={title[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setTitle, selectedLang, e.target.value)}
                    placeholder={t('enterTitlePlaceholder', { lang: selectedLang }) || `Enter title in ${selectedLang}`}
                />
            </div>

            <div className="form-group">
                <label htmlFor="tf-instructions">{t('blockInstructionsLabelOptional') || 'Instructions (Optional)'}:</label>
                <textarea
                    id="tf-instructions"
                    value={instructions[selectedLang] || ''}
                    onChange={(e) => handleMultilingualChange(setInstructions, selectedLang, e.target.value)}
                    placeholder={t('enterInstructionsPlaceholder', { lang: selectedLang }) || `Enter instructions in ${selectedLang}`}
                />
            </div>

            <h4>{t('statementsLabel') || 'Statements'}:</h4>
            {statements.map((stmt, index) => (
                <div key={stmt.id} className="tf-statement-entry">
                    <h5>{t('statementNumberLabel', { number: index + 1 }) || `Statement #${index + 1}`}</h5>
                    <div className="form-group">
                        <label htmlFor={`tf-statement-text-${stmt.id}`}>
                            {t('statementTextLabel', { lang: selectedLang }) || `Statement Text (${selectedLang})`}:
                        </label>
                        <textarea
                            id={`tf-statement-text-${stmt.id}`}
                            value={stmt.text?.[selectedLang] || ''}
                            onChange={(e) => handleStatementTextChange(stmt.id, selectedLang, e.target.value)}
                            placeholder={t('enterStatementTextPlaceholder') || "Enter the statement text"}
                            rows="2"
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('statementIsFactuallyLabel') || 'This statement is factually:'}</label>
                        <div className="tf-radio-group">
                            <label htmlFor={`tf-isCorrect-true-${stmt.id}`}>
                                <input
                                    type="radio"
                                    id={`tf-isCorrect-true-${stmt.id}`}
                                    name={`tf-isCorrect-${stmt.id}`}
                                    checked={stmt.isCorrect === true}
                                    onChange={() => handleStatementCorrectnessChange(stmt.id, true)}
                                /> {t('trueLabel') || 'True'}
                            </label>
                            <label htmlFor={`tf-isCorrect-false-${stmt.id}`}>
                                <input
                                    type="radio"
                                    id={`tf-isCorrect-false-${stmt.id}`}
                                    name={`tf-isCorrect-${stmt.id}`}
                                    checked={stmt.isCorrect === false}
                                    onChange={() => handleStatementCorrectnessChange(stmt.id, false)}
                                /> {t('falseLabel') || 'False'}
                            </label>
                        </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveStatement(stmt.id)} className="btn-danger btn-small">
                        {t('removeStatementBtn') || 'Remove Statement'}
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddStatement} className="btn-secondary" style={{ marginTop: '10px', marginBottom: '20px' }}>
                {t('addStatementBtn') || '➕ Add Statement'}
            </button>

            <div className="form-actions">
                <button type="submit" className="btn-primary">{t('saveChangesBtn') || 'Save Changes'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
            </div>
        </form>
    );
};

export default ConfigureTrueFalseBlock;
