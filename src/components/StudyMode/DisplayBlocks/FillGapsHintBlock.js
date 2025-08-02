import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import Button from '../../Common/Button';
import './FillGapsHintBlock.css';

const FillGapsHintBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, instructions, items } = blockData;

    // Initialize studentAnswers based on the number of items
    const [studentAnswers, setStudentAnswers] = useState(() => items.map(() => ''));
    const [showHints, setShowHints] = useState(() => items.map(() => false));

    useEffect(() => {
        // Reset answers and hints visibility if blockData items change
        setStudentAnswers(items.map(() => ''));
        setShowHints(items.map(() => false));
    }, [items]);

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...studentAnswers];
        newAnswers[index] = value;
        setStudentAnswers(newAnswers);
    };

    const toggleHint = (index) => {
        const newShowHints = [...showHints];
        newShowHints[index] = !newShowHints[index];
        setShowHints(newShowHints);
    };
    
    const getLocalizedText = (multilingualObject) => {
        if (!multilingualObject) return '';
        return multilingualObject[currentUILanguage] || multilingualObject.COSYenglish || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };


    return (
        <div className="fill-gaps-hint-block">
            {title && (getLocalizedText(title)) && <h4>{getLocalizedText(title)}</h4>}
            {instructions && (getLocalizedText(instructions)) && <p className="instructions">{getLocalizedText(instructions)}</p>}

            <div className="gap-items-container">
                {items.map((item, index) => (
                    <div key={item.id || index} className="gap-item-display">
                        <span className="text-before">{getLocalizedText(item.textBefore)}</span>
                        <input
                            type="text"
                            value={studentAnswers[index]}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="gap-input"
                            aria-label={`${t('answerForGapLabel', {number: index + 1}) || `Answer for gap ${index + 1}` }`}
                        />
                        <span className="text-after">{getLocalizedText(item.textAfter)}</span>
                        
                        {item.hint && (getLocalizedText(item.hint)) && (
                            <Button
                                type="button" 
                                onClick={() => toggleHint(index)} 
                                className="button--icon"
                                title={t('toggleHintBtnTitle') || 'Toggle hint'}
                                aria-expanded={showHints[index]}
                            >
                                💡
                            </Button>
                        )}
                        {showHints[index] && item.hint && (getLocalizedText(item.hint)) && (
                            <span className="hint-text">({getLocalizedText(item.hint)})</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-actions" style={{marginTop: '15px'}}>
                <Button type="button" className="">
                    {t('checkAnswersBtn') || 'Check Answers'}
                </Button>
            </div>
        </div>
    );
};

export default FillGapsHintBlock;
