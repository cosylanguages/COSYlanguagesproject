import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { pronounceText } from '../../../utils/speechUtils'; // Added
import './MatchWordsBlock.css';

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array]; // Create a copy to avoid mutating original
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
};

const MatchWordsBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, instructions, pairs = [] } = blockData;

    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };

    const [shuffledCol1, setShuffledCol1] = useState([]);
    const [shuffledCol2, setShuffledCol2] = useState([]);
    
    const [selectedCol1Item, setSelectedCol1Item] = useState(null); // { id, text }
    const [selectedCol2Item, setSelectedCol2Item] = useState(null); // { id, text }
    const [matchedPairs, setMatchedPairs] = useState([]); // Stores { col1Id, col2Id }

    // Memoize the processing of pairs to avoid re-shuffling on every render unless pairs or language changes
    const processedPairs = useMemo(() => {
        return pairs.map(pair => ({
            id: pair.id, // Keep original pair ID for answer checking later
            term1: { id: `${pair.id}-term1`, text: getLocalizedText(pair.term1) },
            term2: { id: `${pair.id}-term2`, text: getLocalizedText(pair.term2) }
        }));
    }, [pairs, currentUILanguage]);

    useEffect(() => {
        const col1Items = processedPairs.map(p => p.term1);
        const col2Items = processedPairs.map(p => p.term2);
        setShuffledCol1(shuffleArray(col1Items));
        setShuffledCol2(shuffleArray(col2Items));
        setMatchedPairs([]);
        setSelectedCol1Item(null);
        setSelectedCol2Item(null);
    }, [processedPairs]);

    const handleItemSelect = (item, column) => {
        if (column === 1) {
            if (matchedPairs.some(p => p.col1Id === item.id)) return; // Already matched
            setSelectedCol1Item(item);
        } else {
            if (matchedPairs.some(p => p.col2Id === item.id)) return; // Already matched
            setSelectedCol2Item(item);
        }
    };

    useEffect(() => {
        if (selectedCol1Item && selectedCol2Item) {
            // Logic to check if they are a correct pair based on original pair IDs
            // The selectedCol1Item.id is `${originalPairId}-term1`
            // The selectedCol2Item.id is `${originalPairId}-term2`
            const originalPairId1 = selectedCol1Item.id.replace('-term1', '');
            const originalPairId2 = selectedCol2Item.id.replace('-term2', '');

            if (originalPairId1 === originalPairId2) { // Correct match
                setMatchedPairs(prev => [...prev, { col1Id: selectedCol1Item.id, col2Id: selectedCol2Item.id, correct: true }]);
            } else { // Incorrect match - just store it for now, or provide immediate feedback
                setMatchedPairs(prev => [...prev, { col1Id: selectedCol1Item.id, col2Id: selectedCol2Item.id, correct: false }]);
            }
            setSelectedCol1Item(null);
            setSelectedCol2Item(null);
        }
    }, [selectedCol1Item, selectedCol2Item]);
    
    const isMatched = (itemId, column) => {
        if (column === 1) return matchedPairs.some(p => p.col1Id === itemId);
        return matchedPairs.some(p => p.col2Id === itemId);
    };
    
    const getMatchStatusClass = (itemId, column) => {
        const match = column === 1 ? matchedPairs.find(p => p.col1Id === itemId) : matchedPairs.find(p => p.col2Id === itemId);
        if (!match) return '';
        // This part is tricky if we allow selecting a new item from col2 after a col1 item is selected
        // For now, we assume a match is either correct or incorrect once made.
        // If we want to show "incorrect" for a pair, we'd need to know both parts of the attempted match.
        // The current logic adds the pair to matchedPairs and then clears selections.
        // This means we'd need to check the 'correct' flag on the stored match.
        const relevantMatch = matchedPairs.find(p => p.col1Id === itemId || p.col2Id === itemId);
         if (relevantMatch) {
             // This logic is flawed for individual item styling if we don't clear both on incorrect.
             // Let's simplify: if it's part of ANY stored match, it's "matched".
             // Correctness styling would need to apply to the pair, or after a "Check Answers" button.
             // For now, just visually disable matched items.
             return 'matched';
         }
        return '';
    };


    return (
        <div className="match-words-block">
            {title && getLocalizedText(title) && <h4>{getLocalizedText(title)}</h4>}
            {instructions && getLocalizedText(instructions) && <p className="instructions">{getLocalizedText(instructions)}</p>}

            {processedPairs.length === 0 && <p>{t('noWordPairsConfigured') || 'No word pairs configured for this exercise.'}</p>}

            {processedPairs.length > 0 && (
                <div className="matching-area">
                    <div className="column column-1">
                        {shuffledCol1.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleItemSelect(item, 1)}
                                className={`match-item ${selectedCol1Item?.id === item.id ? 'selected' : ''} ${isMatched(item.id, 1) ? 'matched' : ''}`}
                                disabled={isMatched(item.id, 1)}
                            >
                                {item.text}
                            </button>
                        ))}
                    </div>
                    <div className="column column-2">
                        {shuffledCol2.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleItemSelect(item, 2)}
                                className={`match-item ${selectedCol2Item?.id === item.id ? 'selected' : ''} ${isMatched(item.id, 2) ? 'matched' : ''}`}
                                disabled={isMatched(item.id, 2)}
                            >
                                <span className="match-item-text">{item.text}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); pronounceText(item.text, blockData.lang || currentUILanguage); }}
                                    className="btn-icon pronounce-btn-inline"
                                    title={t('pronounceText') || 'Pronounce'}
                                    aria-label={t('pronounceText') || 'Pronounce'}
                                    disabled={isMatched(item.id, 1)} // Keep TTS active even if item selected, but disable if matched
                                >🔊</button>
                            </button>
                        ))}
                    </div>
                </div>
            )}
             {/* Feedback for matched pairs (simplified) */}
            {/* <div className="match-feedback">
                {matchedPairs.map((p, i) => (
                    <p key={i} style={{ color: p.correct ? 'green' : 'red' }}>
                        Attempt {i+1}: {p.correct ? 'Correct!' : 'Incorrect.'}
                    </p>
                ))}
            </div> */}
        </div>
    );
};

export default MatchWordsBlock;
