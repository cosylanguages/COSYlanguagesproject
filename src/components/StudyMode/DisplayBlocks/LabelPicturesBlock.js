import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils'; // Added
import './LabelPicturesBlock.css';

const LabelPicturesBlock = ({ blockData, onAnswer }) => {
    const { t, language } = useI18n(); // language is global UI language
    const [answers, setAnswers] = useState({}); // Store user's text input for each hotspot
    const [feedback, setFeedback] = useState({}); // Store feedback (correct/incorrect) for each hotspot
    const [showResults, setShowResults] = useState(false);
    const [activeHotspot, setActiveHotspot] = useState(null); // Index of hotspot for modal input

    const { mainImage, labels: hotspots, title } = blockData; // 'labels' in data is 'hotspots' here

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('labelThePicturesDefaultTitle') || 'Label the Pictures';

    const handleHotspotClick = (index) => {
        if (showResults) return; // Don't allow changing answer after showing results
        setActiveHotspot(index);
    };

    const handleAnswerChange = (event) => {
        if (activeHotspot === null) return;
        setAnswers(prev => ({
            ...prev,
            [activeHotspot]: event.target.value,
        }));
    };

    const handleModalSubmit = () => {
        if (activeHotspot === null) return;
        // Basic check (can be expanded)
        const correctAnswer = hotspots[activeHotspot].texts[language] || hotspots[activeHotspot].texts['COSYenglish'] || '';
        const userAnswer = answers[activeHotspot] || '';
        
        // For immediate feedback if desired, or can wait for a global "Check Answers"
        // For now, this modal submit just closes the modal. Checking is done by "Check Answers" button.
        setActiveHotspot(null); 
    };

    const checkAllAnswers = () => {
        let newFeedback = {};
        let allCorrect = true;
        hotspots.forEach((spot, index) => {
            const correctAnswer = spot.texts?.[language] || spot.texts?.['COSYenglish'] || '';
            const userAnswer = answers[index] || '';
            const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
            newFeedback[index] = { isCorrect, correctAnswer };
            if (!isCorrect) allCorrect = false;
        });
        setFeedback(newFeedback);
        setShowResults(true);
        if (onAnswer) { // If a callback for overall result is provided
            onAnswer({
                blockId: blockData.id,
                score: allCorrect ? 1 : 0, // Example scoring
                total: 1,
                answers: hotspots.map((spot, index) => ({
                    hotspotId: spot.id || index,
                    answer: answers[index] || '',
                    correctAnswer: spot.texts?.[language] || spot.texts?.['COSYenglish'] || '',
                    isCorrect: newFeedback[index]?.isCorrect || false
                }))
            });
        }
    };

    const tryAgain = () => {
        setAnswers({});
        setFeedback({});
        setShowResults(false);
        setActiveHotspot(null);
    };

    return (
        <div className="label-pictures-block">
            <h4>{blockTitle}</h4>
            <div className="image-container-lp-display">
                <img src={mainImage} alt={blockTitle} style={{ maxWidth: '100%', display: 'block' }} />
                {hotspots.map((spot, index) => (
                    <div
                        key={spot.id || index}
                        className={`hotspot-marker-display 
                                    ${feedback[index]?.isCorrect === true ? 'correct' : ''}
                                    ${feedback[index]?.isCorrect === false ? 'incorrect' : ''}
                                    ${showResults ? 'answered' : ''}
                                  `}
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        onClick={() => handleHotspotClick(index)}
                        title={showResults ? (feedback[index]?.isCorrect ? t('correct') : `${t('incorrect')}. ${t('correctAnswerWas')} ${feedback[index]?.correctAnswer}`) : (answers[index] || t('clickToLabelHotspot', { number: index + 1}) || `Hotspot ${index + 1}: Click to label`)}
                    >
                        <span>{index + 1}</span>
                        {showResults && feedback[index] && (
                            <span className="feedback-icon">
                                {feedback[index].isCorrect ? '✅' : '❌'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {activeHotspot !== null && !showResults && (
                <div className="hotspot-input-modal">
                    <h5>{t('labelHotspotModalTitle', { number: activeHotspot + 1 }) || `Label Hotspot ${activeHotspot + 1}`}</h5>
                    <input
                        type="text"
                        value={answers[activeHotspot] || ''}
                        onChange={handleAnswerChange}
                        placeholder={t('enterLabelPlaceholder') || "Enter label"}
                        autoFocus
                    />
                    <div className="modal-actions">
                        <button onClick={handleModalSubmit} className="btn btn-primary">{t('submitBtn') || 'Submit'}</button>
                        <button onClick={() => setActiveHotspot(null)} className="btn btn-secondary">{t('cancelBtn') || 'Cancel'}</button>
                    </div>
                </div>
            )}

            <div className="lp-block-actions">
                {!showResults ? (
                    <button onClick={checkAllAnswers} className="btn btn-primary">{t('checkAnswersBtn') || 'Check Answers'}</button>
                ) : (
                    <button onClick={tryAgain} className="btn btn-secondary">{t('tryAgainBtn') || 'Try Again'}</button>
                )}
            </div>
             {showResults && (
                <div className="lp-results-summary">
                    <h5>{t('resultsSummaryTitle') || 'Results Summary:'}</h5>
                    <ul>
                        {hotspots.map((spot, index) => (
                            <li key={spot.id || `result-${index}`} className={feedback[index]?.isCorrect ? 'correct' : 'incorrect'}>
                                <span className="hotspot-number">{t('hotspotResult', { number: index + 1}) || `Hotspot ${index + 1}`}:</span>
                                <span className="student-answer-lp">
                                    {answers[index] || `(${(t('notAttempted') || 'Not Attempted')})`}
                                    {answers[index] && (
                                        <button 
                                            onClick={() => pronounceText(answers[index], blockData.lang || language)}
                                            className="btn-icon pronounce-btn-inline"
                                            title={t('pronounceYourAnswer') || 'Pronounce your answer'}
                                        >🔊</button>
                                    )}
                                </span>
                                <span className="feedback-separator">-</span>
                                {feedback[index]?.isCorrect 
                                    ? <span className="correct-text"> {t('correct')} ✅</span> 
                                    : (
                                        <span className="incorrect-text"> 
                                            {t('incorrect')} ❌ 
                                            ({t('correctAnswerWas') || 'Correct'}: {feedback[index]?.correctAnswer}
                                            {feedback[index]?.correctAnswer && (
                                                <button 
                                                    onClick={() => pronounceText(feedback[index]?.correctAnswer, blockData.lang || language)}
                                                    className="btn-icon pronounce-btn-inline"
                                                    title={t('pronounceCorrectAnswer') || 'Pronounce correct answer'}
                                                >🔊</button>
                                            )}
                                            )
                                        </span>
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LabelPicturesBlock;
