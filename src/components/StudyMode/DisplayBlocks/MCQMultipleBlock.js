import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils';
import TransliterableText from '../../Common/TransliterableText'; // Added
import Button from '../../Common/Button';
import './SimpleTextDisplay.css'; 
import './MCQMultipleBlock.css'; 

const MCQMultipleBlock = ({ blockData, onAnswer }) => {
    const { t, language: globalLanguage } = useI18n();
    const { title, question = {}, options = [], lang: blockLang } = blockData;

    const effectiveLang = blockLang || globalLanguage;

    // Note: blockTitle and questionText are now primarily for TTS, as TransliterableText handles display
    const blockTitleTextForDisplay = title; // Pass the object to TransliterableText
    const questionTextForDisplay = question; // Pass the object to TransliterableText
    
    const titleForTTS = title?.[effectiveLang] || title?.COSYenglish || title?.default || '';
    const questionTextForTTS = question?.[effectiveLang] || question?.COSYenglish || question?.default || '';

    // State for selected options: { optionId: boolean }
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [feedback, setFeedback] = useState({}); // { optionId: 'correct' | 'incorrect-selected' | 'incorrect-missed' }


    useEffect(() => {
        // Reset state when blockData changes
        setSelectedOptions({});
        setShowResults(false);
        setFeedback({});
    }, [blockData]);

    const handleOptionToggle = (optionId) => {
        if (showResults) return;
        setSelectedOptions(prev => ({
            ...prev,
            [optionId]: !prev[optionId]
        }));
    };

    const checkAnswers = () => {
        let newFeedback = {};
        let correctSelections = 0;
        let incorrectSelections = 0; // User selected an incorrect option
        // let missedSelections = 0;    // ESLint: 'missedSelections' is assigned a value but never used. User did not select a correct option
        let totalCorrectOptions = 0;

        options.forEach(opt => {
            if (opt.isCorrect) {
                totalCorrectOptions++;
                if (selectedOptions[opt.id]) {
                    newFeedback[opt.id] = 'correct';
                    correctSelections++;
                } else {
                    newFeedback[opt.id] = 'incorrect-missed'; // Correct but not selected by user
                    // missedSelections++; // ESLint: 'missedSelections' is assigned a value but never used.
                }
            } else { // Option is incorrect
                if (selectedOptions[opt.id]) {
                    newFeedback[opt.id] = 'incorrect-selected'; // Incorrect and selected by user
                    incorrectSelections++;
                } else {
                    // newFeedback[opt.id] = 'correctly-not-selected'; // Correctly not selected (usually no visual feedback)
                }
            }
        });
        
        setFeedback(newFeedback);
        setShowResults(true);

        if (onAnswer) {
            const isFullyCorrect = correctSelections === totalCorrectOptions && incorrectSelections === 0;
            // More nuanced scoring could be implemented
            const score = isFullyCorrect ? 1 : 0; // Simple binary scoring for now
            
            onAnswer({
                blockId: blockData.id,
                score: score,
                total: 1, // Or treat each correct option as a point, max totalCorrectOptions
                answers: options.map(opt => ({
                    optionId: opt.id,
                    text: getLocalizedText(opt), // Added localized text
                    selected: !!selectedOptions[opt.id],
                    isCorrectOption: opt.isCorrect,
                    feedbackState: newFeedback[opt.id] || null
                }))
            });
        }
    };

    const tryAgain = () => {
        setSelectedOptions({});
        setShowResults(false);
        setFeedback({});
    };
    
    // getOptionText is no longer needed here as TransliterableText will handle text resolution
    // const getOptionText = (option) => {
    //     return option.texts?.[effectiveLang] || option.texts?.COSYenglish || `Option ${option.id}`;
    // };

    // Fonction utilitaire pour obtenir le texte localisé d'une option
    function getLocalizedText(option, fallbackKey = 'COSYenglish') {
        if (!option || !option.texts) return '';
        // Utilise la langue effective si possible
        const lang = option.lang || option.langOverride || fallbackKey;
        return option.texts[lang] || option.texts[fallbackKey] || option.texts[Object.keys(option.texts)[0]] || '';
    }

    if (!options || options.length === 0) {
        return <div className="mcq-multiple-block display-simple-block"><p>{t('noOptionsConfiguredMCQ') || 'No options configured for this question.'}</p></div>;
    }

    return (
        <div className="mcq-multiple-block display-simple-block">
            <h4>
                <TransliterableText text={blockTitleTextForDisplay} langOverride={effectiveLang} />
                {titleForTTS && (
                    <Button
                        onClick={() => pronounceText(titleForTTS, effectiveLang)}
                        className="button--icon"
                        title={t('pronounceTitle') || 'Pronounce title'}
                    >🔊</Button>
                )}
            </h4>
            {questionTextForTTS && ( // Check if there's actual text to display/pronounce for the question
                <p className="mcq-question-text">
                    <TransliterableText text={questionTextForDisplay} langOverride={effectiveLang} />
                    <Button
                        onClick={() => pronounceText(questionTextForTTS, effectiveLang)} 
                        className="button--icon"
                        title={t('pronounceQuestion') || 'Pronounce question'}
                    >🔊</Button>
                </p>
            )}
            
            <div className="mcq-options-container">
                {options.map((opt) => {
                    const optionTextForTTS = opt.texts?.[effectiveLang] || opt.texts?.COSYenglish || '';
                    return (
                        <div 
                            key={opt.id} 
                            className={`mcq-option 
                                        ${selectedOptions[opt.id] ? 'selected' : ''}
                                        ${showResults && feedback[opt.id] === 'correct' ? 'correct-answer' : ''}
                                        ${showResults && feedback[opt.id] === 'incorrect-selected' ? 'incorrect-answer' : ''}
                                        ${showResults && feedback[opt.id] === 'incorrect-missed' ? 'missed-answer' : ''}
                                      `}
                            onClick={() => handleOptionToggle(opt.id)}
                            role="checkbox"
                            aria-checked={!!selectedOptions[opt.id]}
                            tabIndex={showResults ? -1 : 0}
                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleOptionToggle(opt.id);}}
                        >
                            <span className="mcq-checkbox-custom">{selectedOptions[opt.id] ? '☑' : '☐'}</span>
                            <span className="mcq-option-text">
                                <TransliterableText text={opt.texts} langOverride={effectiveLang} />
                            </span>
                            {optionTextForTTS && (
                                <Button
                                    onClick={(e) => { e.stopPropagation(); pronounceText(optionTextForTTS, effectiveLang); }}
                                    className="button--icon"
                                    title={t('pronounceOption') || 'Pronounce option'}
                                >🔊</Button>
                            )}
                            {showResults && feedback[opt.id] === 'correct' && <span className="feedback-icon"> ✅</span>}
                            {showResults && feedback[opt.id] === 'incorrect-selected' && <span className="feedback-icon"> ❌</span>}
                            {showResults && feedback[opt.id] === 'incorrect-missed' && <span className="feedback-icon"> (Correct)</span>}
                            
                            {showResults && opt.feedback && (
                                <div className="option-specific-feedback">
                                    <TransliterableText text={opt.feedback} langOverride={effectiveLang} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mcqm-block-actions">
                {!showResults ? (
                    <Button onClick={checkAnswers} className="">
                        {t('checkAnswersBtn') || 'Check Answers'}
                    </Button>
                ) : (
                    <Button onClick={tryAgain} className="button--secondary">
                        {t('tryAgainBtn') || 'Try Again'}
                    </Button>
                )}
            </div>

            {showResults && (
                <div className="mcqm-results-summary">
                     {/* Summary can be enhanced here */}
                </div>
            )}
        </div>
    );
};

export default MCQMultipleBlock;
