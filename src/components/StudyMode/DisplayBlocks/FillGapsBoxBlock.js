import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './FillGapsBoxBlock.css';
import '../../Freestyle/freestyle-shared.css';

// Helper to shuffle an array
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
};

const FillGapsBoxBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, instructions, textWithGaps } = blockData;

    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };

    const localizedTextWithGaps = useMemo(() => getLocalizedText(textWithGaps), [textWithGaps, currentUILanguage]);

    const { textSegments, initialWordsForBox, gapCount } = useMemo(() => {
        if (!localizedTextWithGaps) return { textSegments: [], initialWordsForBox: [], gapCount: 0 };
        
        const segments = [];
        const words = [];
        let lastIndex = 0;
        let _gapCount = 0;
        localizedTextWithGaps.replace(/\[([^\]]+)\]/g, (match, word, offset) => {
            segments.push({ type: 'text', content: localizedTextWithGaps.substring(lastIndex, offset) });
            segments.push({ type: 'gap', id: `gap-${_gapCount}`, correctWord: word });
            words.push({ id: `word-${_gapCount}-${uuidv4()}`, text: word }); // Ensure unique word IDs if words can repeat
            lastIndex = offset + match.length;
            _gapCount++;
        });
        segments.push({ type: 'text', content: localizedTextWithGaps.substring(lastIndex) });
        
        return { textSegments: segments.filter(s => s.type === 'text' ? s.content : true), initialWordsForBox: words, gapCount: _gapCount };
    }, [localizedTextWithGaps]);

    const [wordBox, setWordBox] = useState([]);
    const [filledGaps, setFilledGaps] = useState({}); // { gapId: wordId }

    useEffect(() => {
        setWordBox(shuffleArray(initialWordsForBox));
        const initialFilledGaps = {};
        for(let i=0; i < gapCount; i++) initialFilledGaps[`gap-${i}`] = null;
        setFilledGaps(initialFilledGaps);
    }, [initialWordsForBox, gapCount]);

    const handleDragStart = (e, wordId) => {
        e.dataTransfer.setData("wordId", wordId);
    };

    const handleDrop = (e, gapId) => {
        e.preventDefault();
        const wordId = e.dataTransfer.getData("wordId");
        const wordObj = wordBox.find(w => w.id === wordId) || Object.values(filledGaps).find(filledWordId => filledWordId === wordId && initialWordsForBox.find(iw => iw.id === filledWordId));


        if (!wordObj) return; // Should not happen if drag started correctly

        // If the gap already has a word, move it back to the box
        if (filledGaps[gapId]) {
            const oldWordIdInGap = filledGaps[gapId];
            const oldWordObj = initialWordsForBox.find(w => w.id === oldWordIdInGap || w.id.startsWith(oldWordIdInGap.split('-')[0]+'-'+oldWordIdInGap.split('-')[1]));
            if (oldWordObj && !wordBox.find(w => w.id === oldWordObj.id)) {
                 setWordBox(prev => [...prev, oldWordObj]);
            }
        }
        
        setFilledGaps(prev => ({ ...prev, [gapId]: wordObj.id }));
        setWordBox(prev => prev.filter(w => w.id !== wordObj.id));
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };
    
    // Allow dragging words from filled gaps back to the word box
    const handleGapItemDragStart = (e, wordId, gapId) => {
        e.dataTransfer.setData("wordId", wordId);
        e.dataTransfer.setData("sourceGapId", gapId);
    };

    const handleWordBoxDrop = (e) => {
        e.preventDefault();
        const wordId = e.dataTransfer.getData("wordId");
        const sourceGapId = e.dataTransfer.getData("sourceGapId");

        if (sourceGapId && filledGaps[sourceGapId] === wordId) { // Word came from a gap
            const wordObj = initialWordsForBox.find(w => w.id === wordId || w.id.startsWith(wordId.split('-')[0]+'-'+wordId.split('-')[1]));
            if (wordObj && !wordBox.find(w => w.id === wordObj.id)) {
                setWordBox(prev => shuffleArray([...prev, wordObj]));
                setFilledGaps(prev => ({ ...prev, [sourceGapId]: null }));
            }
        }
    };


    return (
        <div className="fill-gaps-box-block cosy-exercise-container">
            {title && getLocalizedText(title) && <h4>{getLocalizedText(title)}</h4>}
            {instructions && getLocalizedText(instructions) && <p className="instructions">{getLocalizedText(instructions)}</p>}

            <div 
                className="word-box-container"
                onDrop={handleWordBoxDrop}
                onDragOver={handleDragOver}
            >
                {wordBox.map(word => (
                    <span
                        key={word.id}
                        className="draggable-word"
                        draggable
                        onDragStart={(e) => handleDragStart(e, word.id)}
                    >
                        {word.text}
                    </span>
                ))}
                {wordBox.length === 0 && <span className="empty-box-placeholder">{t('wordBoxEmpty') || '(Word box empty)'}</span>}
            </div>

            <div className="gapped-text-container">
                {textSegments.map((segment, index) => {
                    if (segment.type === 'text') {
                        return <span key={index} className="text-segment">{segment.content}</span>;
                    } else { // segment.type === 'gap'
                        const filledWordId = filledGaps[segment.id];
                        const wordObj = filledWordId ? initialWordsForBox.find(w => w.id === filledWordId || w.id.startsWith(filledWordId.split('-')[0]+'-'+filledWordId.split('-')[1])) : null;
                        return (
                            <span
                                key={segment.id}
                                id={segment.id}
                                className={`gap-placeholder ${filledWordId ? 'filled' : ''}`}
                                onDrop={(e) => handleDrop(e, segment.id)}
                                onDragOver={handleDragOver}
                                draggable={!!filledWordId}
                                onDragStart={(e) => filledWordId && handleGapItemDragStart(e, filledWordId, segment.id)}
                            >
                                {wordObj ? wordObj.text : t('dropWordHerePrompt') || '___'}
                            </span>
                        );
                    }
                })}
            </div>
             {/* Future: Check Answers button */}
        </div>
    );
};
// Helper for unique IDs if not already available
const uuidv4 = () => { 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export default FillGapsBoxBlock;
