import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils'; // Added
import './MatchPicturesBlock.css'; 

// Helper function to shuffle an array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const MatchPicturesBlock = ({ blockData, onAnswer }) => {
    const { t, language } = useI18n();
    const { pairs = [], title } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('matchThePicturesDefaultTitle') || 'Match the Pictures';

    const [shuffledImages, setShuffledImages] = useState([]);
    const [shuffledTexts, setShuffledTexts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // { id, originalIndex }
    const [selectedText, setSelectedText] = useState(null);   // { id, originalIndex }
    const [matchedPairs, setMatchedPairs] = useState({}); // Store originalIndex of image -> originalIndex of text
    const [feedback, setFeedback] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const imageItems = pairs.map((pair, index) => ({
            id: `img-${pair.id || index}`,
            type: 'image',
            content: pair.image,
            originalIndex: index, // Link back to the original pair
        }));
        const textItems = pairs.map((pair, index) => ({
            id: `txt-${pair.id || index}`,
            type: 'text',
            content: pair.texts?.[language] || pair.texts?.['COSYenglish'] || `Text ${index + 1}`,
            originalIndex: index,
        }));

        setShuffledImages(shuffleArray(imageItems));
        setShuffledTexts(shuffleArray(textItems));
        setMatchedPairs({});
        setSelectedImage(null);
        setSelectedText(null);
        setFeedback('');
        setShowResults(false);
    }, [pairs, language]);

    const handleImageClick = (imgItem) => {
        if (showResults || matchedPairs[imgItem.originalIndex] !== undefined) return;
        if (selectedImage?.id === imgItem.id) {
            setSelectedImage(null); // Deselect
        } else {
            setSelectedImage(imgItem);
        }
    };

    const handleTextClick = (txtItem) => {
        if (showResults || Object.values(matchedPairs).includes(txtItem.originalIndex)) return;
         if (selectedText?.id === txtItem.id) {
            setSelectedText(null); // Deselect
        } else {
            setSelectedText(txtItem);
        }
    };
    
    useEffect(() => {
        if (selectedImage && selectedText) {
            if (selectedImage.originalIndex === selectedText.originalIndex) { // Correct match
                setMatchedPairs(prev => ({ ...prev, [selectedImage.originalIndex]: selectedText.originalIndex }));
                setFeedback(''); // Or provide positive feedback
            } else {
                // Incorrect match - provide temporary visual feedback if desired, then clear selection
                setFeedback(t('incorrectMatchTryAgain') || 'Incorrect match. Try again!');
                // Could add a class for incorrect flash
                setTimeout(() => {
                     setFeedback('');
                }, 1500);
            }
            setSelectedImage(null);
            setSelectedText(null);
        }
    }, [selectedImage, selectedText, pairs, t]);


    const checkAllAnswers = () => {
        setShowResults(true);
        if (onAnswer) {
            const score = Object.keys(matchedPairs).length;
            const total = pairs.length;
            onAnswer({
                blockId: blockData.id,
                score: score,
                total: total,
                answers: pairs.map((pair, index) => ({
                    pairId: pair.id || index,
                    correct: matchedPairs[index] !== undefined, // Simple check based on if it was matched
                    // More detailed answer structure if needed
                }))
            });
        }
    };

    const tryAgain = () => {
        // Re-shuffle by re-triggering the effect
        const imageItems = pairs.map((pair, index) => ({
            id: `img-${pair.id || index}`, type: 'image', content: pair.image, originalIndex: index,
        }));
        const textItems = pairs.map((pair, index) => ({
            id: `txt-${pair.id || index}`, type: 'text', content: pair.texts?.[language] || pair.texts?.['COSYenglish'] || `Text ${index + 1}`, originalIndex: index,
        }));
        setShuffledImages(shuffleArray(imageItems));
        setShuffledTexts(shuffleArray(textItems));
        setMatchedPairs({});
        setSelectedImage(null);
        setSelectedText(null);
        setFeedback('');
        setShowResults(false);
    };
    
    const allMatched = useMemo(() => Object.keys(matchedPairs).length === pairs.length, [matchedPairs, pairs]);

    if (!pairs || pairs.length === 0) {
        return <div className="match-pictures-block"><p>{t('noPairsConfigured') || 'No picture-text pairs configured for this block.'}</p></div>;
    }

    return (
        <div className="match-pictures-block">
            <h4>{blockTitle}</h4>
            <p>{t('matchPicturesInstructions') || 'Match each picture with its corresponding text.'}</p>
            
            <div className="match-area">
                <div className="column images-column">
                    {shuffledImages.map(imgItem => {
                        const isMatched = matchedPairs[imgItem.originalIndex] !== undefined;
                        const isSelected = selectedImage?.id === imgItem.id;
                        return (
                            <div
                                key={imgItem.id}
                                className={`matchable-item image-item ${isSelected ? 'selected' : ''} ${isMatched ? (showResults ? 'correct' : 'matched-visual') : ''} ${showResults && !isMatched ? 'incorrect-unmatched' : ''}`}
                                onClick={() => handleImageClick(imgItem)}
                                role="button"
                                tabIndex={showResults || isMatched ? -1 : 0}
                                aria-pressed={isSelected}
                                aria-disabled={showResults || isMatched}
                            >
                                <img src={imgItem.content} alt={t('matchableImageAlt', {index: imgItem.originalIndex + 1}) || `Matchable image ${imgItem.originalIndex + 1}`} />
                            </div>
                        );
                    })}
                </div>
                <div className="column texts-column">
                    {shuffledTexts.map(txtItem => {
                        const isMatched = Object.values(matchedPairs).includes(txtItem.originalIndex);
                        const isSelected = selectedText?.id === txtItem.id;
                        return (
                            <div
                                key={txtItem.id}
                                className={`matchable-item text-item ${isSelected ? 'selected' : ''} ${isMatched ? (showResults ? 'correct' : 'matched-visual') : ''} ${showResults && !isMatched ? 'incorrect-unmatched' : ''}`}
                                onClick={() => handleTextClick(txtItem)}
                                role="button"
                                tabIndex={showResults || isMatched ? -1 : 0}
                                aria-pressed={isSelected}
                                aria-disabled={showResults || isMatched}
                            >
                                <span className="text-content-mtp">{txtItem.content}</span>
                                <button
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Prevent item selection
                                        pronounceText(txtItem.content, blockData.lang || language); 
                                    }}
                                    className="btn-icon pronounce-btn-inline"
                                    title={t('pronounceText') || 'Pronounce'}
                                    aria-label={t('pronounceText') || 'Pronounce'}
                                    disabled={showResults && isMatched && !allMatched} // Keep enabled if not fully solved to hear options
                                >🔊</button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {feedback && <p className="feedback-message">{feedback}</p>}
            
            <div className="mtp-block-actions">
                {!showResults ? (
                    <button onClick={checkAllAnswers} className="btn btn-primary" disabled={!allMatched && Object.keys(matchedPairs).length < pairs.length}>
                        {t('checkAnswersBtn') || 'Check Answers'}
                    </button>
                ) : (
                    <button onClick={tryAgain} className="btn btn-secondary">{t('tryAgainBtn') || 'Try Again'}</button>
                )}
            </div>

            {showResults && (
                <div className="mtp-results-summary">
                    <h5>
                        {allMatched ? (t('allPairsMatchedCorrectly') || 'All pairs matched correctly!') : 
                                      (t('resultsSummaryTitle') || 'Results Summary:')}
                    </h5>
                    {!allMatched && (
                         <ul>
                            {pairs.map((originalPair, index) => {
                                const wasMatched = matchedPairs[index] !== undefined;
                                return (
                                    <li key={`result-${index}`} className={wasMatched ? 'correct' : 'incorrect'}>
                                        {originalPair.texts?.[language] || originalPair.texts?.['COSYenglish']} - 
                                        {wasMatched ? <span className="correct-text"> {t('matched')} ✅</span> 
                                                    : <span className="incorrect-text"> {t('notMatched')} ❌</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default MatchPicturesBlock;
