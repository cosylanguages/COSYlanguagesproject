import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './ParagraphOrderBlock.css'; // To be created

// Helper function to shuffle an array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const ParagraphOrderBlock = ({ blockData, onAnswer }) => {
    const { t, language } = useI18n();
    const { title, paragraphs: correctOrderParagraphs = [] } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('paragraphOrderDefaultTitle') || 'Order the Paragraphs';

    // Add originalIndex to each paragraph before shuffling for stable key and comparison
    const [shuffledParagraphs, setShuffledParagraphs] = useState([]);
    const [userOrderedParagraphs, setUserOrderedParagraphs] = useState([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [feedback, setFeedback] = useState({}); // { indexInUserOrder: isCorrect (boolean) }

    useEffect(() => {
        const paragraphsWithOriginalIndex = correctOrderParagraphs.map((p, index) => ({
            ...p,
            originalIndex: index, // Keep track of the original correct position
            text: p.texts?.[language] || p.texts?.['COSYenglish'] || `Paragraph ${p.id}`
        }));
        const shuffled = shuffleArray(paragraphsWithOriginalIndex);
        setShuffledParagraphs(shuffled);
        setUserOrderedParagraphs(shuffled); // Initial order is the shuffled one
        setShowResults(false);
        setFeedback({});
    }, [correctOrderParagraphs, language]);

    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (index) => {
        if (draggedItemIndex === null || draggedItemIndex === index) {
            setDraggedItemIndex(null);
            return;
        }
        const newUserOrderedParagraphs = [...userOrderedParagraphs];
        const itemToMove = newUserOrderedParagraphs.splice(draggedItemIndex, 1)[0];
        newUserOrderedParagraphs.splice(index, 0, itemToMove);
        setUserOrderedParagraphs(newUserOrderedParagraphs);
        setDraggedItemIndex(null);
    };

    const checkOrder = () => {
        let newFeedback = {};
        let allCorrect = true;
        userOrderedParagraphs.forEach((p, index) => {
            const isCorrect = p.originalIndex === index;
            newFeedback[index] = isCorrect;
            if (!isCorrect) allCorrect = false;
        });
        setFeedback(newFeedback);
        setShowResults(true);

        if (onAnswer) {
            onAnswer({
                blockId: blockData.id,
                score: allCorrect ? 1 : 0,
                total: 1, // This exercise is either fully correct or not
                answers: userOrderedParagraphs.map(p => p.id) // Send the order of IDs
            });
        }
    };

    const tryAgain = () => {
        // Re-shuffle (or reset to initial shuffle)
         const paragraphsWithOriginalIndex = correctOrderParagraphs.map((p, index) => ({
            ...p,
            originalIndex: index, 
            text: p.texts?.[language] || p.texts?.['COSYenglish'] || `Paragraph ${p.id}`
        }));
        setUserOrderedParagraphs(shuffleArray(paragraphsWithOriginalIndex));
        setShowResults(false);
        setFeedback({});
    };

    if (!correctOrderParagraphs || correctOrderParagraphs.length < 2) {
        return <div className="paragraph-order-block"><p>{t('notEnoughParagraphsConfigured') || 'This block needs at least two paragraphs to be configured.'}</p></div>;
    }

    return (
        <div className="paragraph-order-block">
            <h4>{blockTitle}</h4>
            <p>{t('paragraphOrderInstructions') || 'Drag and drop the paragraphs into the correct order.'}</p>

            <div className="paragraphs-container">
                {userOrderedParagraphs.map((p, index) => (
                    <div
                        key={p.id || `user-p-${index}`} // Use original paragraph ID if available
                        className={`draggable-paragraph 
                                    ${showResults ? (feedback[index] ? 'correct' : 'incorrect') : ''}
                                    ${draggedItemIndex === index ? 'dragging' : ''}
                                  `}
                        draggable={!showResults}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        tabIndex={showResults ? -1 : 0}
                        aria-label={t('paragraphAriaLabel', { number: index + 1, content: p.text.substring(0,30) }) || `Paragraph ${index+1}, starting with: ${p.text.substring(0,30)}...`}
                    >
                        <span className="drag-handle">☰</span>
                        <span className="paragraph-index-display">{index + 1}.</span>
                        {p.text}
                        {showResults && (feedback[index] ? ' ✅' : ' ❌')}
                    </div>
                ))}
            </div>
            
            <div className="po-block-actions">
                {!showResults ? (
                    <button onClick={checkOrder} className="btn btn-primary">
                        {t('checkOrderBtn') || 'Check Order'}
                    </button>
                ) : (
                    <button onClick={tryAgain} className="btn btn-secondary">
                        {t('tryAgainBtn') || 'Try Again'}
                    </button>
                )}
            </div>

            {showResults && (
                <div className="po-results-summary">
                    <h5>
                        {Object.values(feedback).every(f => f) 
                            ? (t('orderCorrectCongratulations') || 'Correct order! Congratulations!')
                            : (t('orderIncorrectReview') || 'The order is not quite right. Review the placements.')}
                    </h5>
                </div>
            )}
        </div>
    );
};

export default ParagraphOrderBlock;
