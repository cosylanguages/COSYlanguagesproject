import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ChooseCorrectOptionBlock.css';
import '../../../freestyle-shared.css';

const parseSentencePattern = (pattern) => {
    if (!pattern) return null;
    const match = pattern.match(/^(.*?)\[(.*?)\](.*?)$/);
    if (!match) {
        // No options found, treat as plain text or malformed
        return { textBefore: pattern, options: [], correctAnswer: '', textAfter: '', originalPattern: pattern };
    }

    const textBefore = match[1];
    const optionsString = match[2];
    const textAfter = match[3];

    let correctAnswer = '';
    const options = optionsString.split('/').map(opt => {
        if (opt.endsWith('*')) {
            correctAnswer = opt.slice(0, -1);
            return opt.slice(0, -1);
        }
        return opt;
    });

    return { textBefore, options, correctAnswer, textAfter, originalPattern: pattern };
};


const ChooseCorrectOptionBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, instructions, sentences } = blockData;

    const [studentSelections, setStudentSelections] = useState([]);

    const parsedSentences = useMemo(() => {
        return sentences.map(sentence => {
            const localizedPattern = sentence.fullSentencePattern?.[currentUILanguage] || 
                                     sentence.fullSentencePattern?.COSYenglish || // Fallback to English
                                     sentence.fullSentencePattern?.[Object.keys(sentence.fullSentencePattern)[0]] || ''; // Fallback to first available
            return { ...sentence, parsed: parseSentencePattern(localizedPattern) };
        });
    }, [sentences, currentUILanguage]);

    useEffect(() => {
        setStudentSelections(parsedSentences.map(() => '')); // Initialize selections
    }, [parsedSentences]);

    const handleSelectionChange = (sentenceIndex, selectedValue) => {
        const newSelections = [...studentSelections];
        newSelections[sentenceIndex] = selectedValue;
        setStudentSelections(newSelections);
    };
    
    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };

    return (
        <div className="choose-correct-option-block cosy-exercise-container">
            {title && getLocalizedText(title) && <h4>{getLocalizedText(title)}</h4>}
            {instructions && getLocalizedText(instructions) && <p className="instructions">{getLocalizedText(instructions)}</p>}

            <div className="cco-sentences-container">
                {parsedSentences.map((sentenceItem, index) => {
                    if (!sentenceItem.parsed || sentenceItem.parsed.options.length === 0) {
                        // Render plain text if parsing failed or no options
                        return (
                            <div key={sentenceItem.id || index} className="cco-sentence-display malformed">
                                <p>{sentenceItem.parsed?.originalPattern || t('malformedSentencePatternLabel') || 'Sentence pattern is malformed or missing.'}</p>
                            </div>
                        );
                    }
                    const { textBefore, options, textAfter } = sentenceItem.parsed;
                    return (
                        <div key={sentenceItem.id || index} className="cco-sentence-display">
                            <span className="text-segment">{textBefore}</span>
                            <select
                                value={studentSelections[index] || ''}
                                onChange={(e) => handleSelectionChange(index, e.target.value)}
                                className="option-select"
                                aria-label={`${t('selectOptionForSentenceLabel', {number: index+1}) || `Select option for sentence ${index + 1}`}`}
                            >
                                <option value="">{t('selectAnOptionLabel') || '-- Select --'}</option>
                                {options.map((opt, optIndex) => (
                                    <option key={optIndex} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <span className="text-segment">{textAfter}</span>
                        </div>
                    );
                })}
            </div>
            {/* Placeholder for future "Check Answers" button
            <div className="form-actions" style={{ marginTop: '15px' }}>
                <button type="button" className="btn-primary">
                    {t('checkAnswersBtn') || 'Check Answers'}
                </button>
            </div>
            */}
        </div>
    );
};

export default ChooseCorrectOptionBlock;
