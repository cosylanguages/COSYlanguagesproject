import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import { normalizeString } from '../../../utils/stringUtils'; // Import normalizeString
import Button from '../../Common/Button';
import './LabelPicturesBlock.css';

const LabelPicturesBlock = ({ blockData, onAnswer }) => {
    const { t, language } = useI18n(); 
    const [answers, setAnswers] = useState({}); 
    const [feedback, setFeedback] = useState({}); 
    const [showResults, setShowResults] = useState(false);
    const [activeHotspot, setActiveHotspot] = useState(null); 

    const { mainImage, labels: hotspots, title } = blockData; 

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('labelThePicturesDefaultTitle') || 'Label the Pictures';

    const getHotspotCorrectAnswer = (spot) => {
        // Prioritize current UI language, then English, then first available, then empty string.
        if (spot?.texts) {
            if (spot.texts[language]) return spot.texts[language];
            if (spot.texts['COSYenglish']) return spot.texts['COSYenglish'];
            const availableLangs = Object.keys(spot.texts);
            if (availableLangs.length > 0) return spot.texts[availableLangs[0]];
        }
        return '';
    };

    const handleHotspotClick = (index) => {
        if (showResults) return; 
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
        setActiveHotspot(null); 
    };

    const checkAllAnswers = () => {
        let newFeedback = {};
        let overallCorrect = true; 
        hotspots.forEach((spot, index) => {
            const originalCorrectAnswer = getHotspotCorrectAnswer(spot);
            const userAnswer = answers[index] || '';
            
            const normalizedUserAnswer = normalizeString(userAnswer);
            const normalizedCorrectAnswer = normalizeString(originalCorrectAnswer);
            
            const isCorrect = normalizedCorrectAnswer ? normalizedUserAnswer === normalizedCorrectAnswer : false;

            newFeedback[index] = { 
                isCorrect, 
                userAnswer: userAnswer, // Keep original user input for display
                correctAnswer: originalCorrectAnswer // Keep original correct answer for display
            };
            if (!isCorrect) overallCorrect = false;
        });
        setFeedback(newFeedback);
        setShowResults(true);
        if (onAnswer) { 
            onAnswer({
                blockId: blockData.id,
                score: overallCorrect ? 1 : 0, 
                total: 1,
                answers: hotspots.map((spot, index) => ({
                    hotspotId: spot.id || index,
                    answer: answers[index] || '',
                    correctAnswer: getHotspotCorrectAnswer(spot),
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
                        title={showResults && feedback[index] ? 
                                (feedback[index].isCorrect ? 
                                    ( (normalizeString(feedback[index].userAnswer) !== normalizeString(feedback[index].correctAnswer) && feedback[index].userAnswer.trim() !== feedback[index].correctAnswer) ? 
                                        `${t('correct')}. ${t('correctAnswerWas')} ${feedback[index].correctAnswer}` : t('correct')
                                    )
                                    : `${t('incorrect')}. ${t('correctAnswerWas')} ${feedback[index].correctAnswer}`) 
                                : (answers[index] || t('clickToLabelHotspot', { number: index + 1}) || `Hotspot ${index + 1}: Click to label`)}
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
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                handleModalSubmit();
                            }
                        }}
                    />
                    <div className="modal-actions">
                        <Button onClick={handleModalSubmit} className="">{t('submitBtn') || 'OK'}</Button> {/* Changed from Submit to OK as it just closes */}
                        {/* <Button onClick={() => setActiveHotspot(null)} className="button--secondary">{t('cancelBtn') || 'Cancel'}</Button> */}
                    </div>
                </div>
            )}

            <div className="lp-block-actions">
                {!showResults ? (
                    <Button onClick={checkAllAnswers} className="">{t('checkAnswersBtn') || 'Check Answers'}</Button>
                ) : (
                    <Button onClick={tryAgain} className="button--secondary">{t('tryAgainBtn') || 'Try Again'}</Button>
                )}
            </div>
             {showResults && (
                <div className="lp-results-summary">
                    <h5>{t('resultsSummaryTitle') || 'Results Summary:'}</h5>
                    <ul>
                        {hotspots.map((spot, index) => {
                            const fb = feedback[index];
                            if (!fb) return null;
                            const userAnswerDisplay = fb.userAnswer || `(${(t('notAttempted') || 'Not Attempted')})`;
                            return (
                                <li key={spot.id || `result-${index}`} className={fb.isCorrect ? 'correct' : 'incorrect'}>
                                    <span className="hotspot-number">{t('hotspotResult', { number: index + 1}) || `Hotspot ${index + 1}`}:</span>
                                    <span className="student-answer-lp">
                                        {userAnswerDisplay}
                                        {fb.userAnswer && (
                                            <Button
                                                onClick={() => pronounceText(fb.userAnswer, blockData.lang || language)}
                                                className="button--icon"
                                                title={t('pronounceYourAnswer') || 'Pronounce your answer'}
                                            >🔊</Button>
                                        )}
                                    </span>
                                    <span className="feedback-separator">-</span>
                                    {fb.isCorrect 
                                        ? (<span className="correct-text"> 
                                            {t('correct')} ✅
                                            {(normalizeString(fb.userAnswer) !== normalizeString(fb.correctAnswer) && fb.userAnswer.trim() !== fb.correctAnswer) && 
                                                ` (${t('correctVariantIs', {variant: fb.correctAnswer}) || `Correct form: ${fb.correctAnswer}`})`
                                            }
                                          </span>)
                                        : (
                                            <span className="incorrect-text"> 
                                                {t('incorrect')} ❌ 
                                                ({t('correctAnswerWas') || 'Correct'}: {fb.correctAnswer}
                                                {fb.correctAnswer && (
                                                    <Button
                                                        onClick={() => pronounceText(fb.correctAnswer, blockData.lang || language)}
                                                        className="button--icon"
                                                        title={t('pronounceCorrectAnswer') || 'Pronounce correct answer'}
                                                    >🔊</Button>
                                                )}
                                                )
                                            </span>
                                        )
                                    }
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LabelPicturesBlock;
