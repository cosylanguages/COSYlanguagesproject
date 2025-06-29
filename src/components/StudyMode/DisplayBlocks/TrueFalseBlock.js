import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './TrueFalseBlock.css';

const TrueFalseBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, instructions, statements = [] } = blockData;

    // studentAnswers will store an object like: { statementId: 'true'/'false'/null }
    const [studentAnswers, setStudentAnswers] = useState({});

    useEffect(() => {
        // Initialize answers when statements change
        const initialAnswers = {};
        statements.forEach(stmt => {
            initialAnswers[stmt.id] = null; // null means unanswered
        });
        setStudentAnswers(initialAnswers);
    }, [statements]);

    const handleAnswerChange = (statementId, answer) // answer is true or false
        => {
        setStudentAnswers(prev => ({
            ...prev,
            [statementId]: answer
        }));
    };
    
    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        if (typeof multilingualObject === 'string') return multilingualObject;
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };

    return (
        <div className="true-false-block">
            {title && getLocalizedText(title) && <h4>{getLocalizedText(title)}</h4>}
            {instructions && getLocalizedText(instructions) && <p className="instructions">{getLocalizedText(instructions)}</p>}

            <div className="tf-statements-container">
                {statements.map((stmt, index) => (
                    <div key={stmt.id || index} className="tf-statement-display">
                        <p className="statement-text">{index + 1}. {getLocalizedText(stmt.text)}</p>
                        <div className="tf-answer-options">
                            <button
                                type="button"
                                className={`tf-option-btn true-btn ${studentAnswers[stmt.id] === true ? 'selected' : ''}`}
                                onClick={() => handleAnswerChange(stmt.id, true)}
                                aria-pressed={studentAnswers[stmt.id] === true}
                            >
                                {t('trueLabel') || 'True'}
                            </button>
                            <button
                                type="button"
                                className={`tf-option-btn false-btn ${studentAnswers[stmt.id] === false ? 'selected' : ''}`}
                                onClick={() => handleAnswerChange(stmt.id, false)}
                                aria-pressed={studentAnswers[stmt.id] === false}
                            >
                                {t('falseLabel') || 'False'}
                            </button>
                        </div>
                         {/* Feedback placeholder: 
                         {studentAnswers[stmt.id] !== null && (
                            <p>Your answer: {studentAnswers[stmt.id] ? 'True' : 'False'}. 
                               Correct: {stmt.isCorrect ? 'True' : 'False'}
                            </p>
                         )}
                         */}
                    </div>
                ))}
            </div>
            
            {/* Placeholder for future "Check Answers" button
            <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-primary">
                    {t('checkAnswersBtn') || 'Check Answers'}
                </button>
            </div>
            */}
        </div>
    );
};

export default TrueFalseBlock;
