import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './WordOrderBlock.css';

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

const WordOrderSentence = ({ sentenceData, sentenceIndex, currentUILanguage, getLocalizedText, t }) => {
    const localizedPattern = useMemo(() => getLocalizedText(sentenceData.orderedPattern), [sentenceData.orderedPattern, currentUILanguage, getLocalizedText]);
    
    const initialSegments = useMemo(() => {
        if (!localizedPattern) return [];
        return localizedPattern.split('/').map((text, index) => ({ id: `segment-${sentenceData.id}-${index}`, text }));
    }, [localizedPattern, sentenceData.id]);

    const [draggableSegments, setDraggableSegments] = useState([]);
    const [targetSlots, setTargetSlots] = useState([]);

    useEffect(() => {
        setDraggableSegments(shuffleArray(initialSegments));
        setTargetSlots(initialSegments.map(() => null)); // Array of nulls, same length as correct segments
    }, [initialSegments]);

    const handleDragStart = (e, segmentId) => {
        e.dataTransfer.setData("segmentId", segmentId);
        const segment = draggableSegments.find(s => s.id === segmentId) || 
                        targetSlots.find(s => s?.id === segmentId);
        if (segment) {
            e.dataTransfer.setData("segmentText", segment.text);
        }
    };

    const handleDropOnTarget = (e, slotIndex) => {
        e.preventDefault();
        const segmentId = e.dataTransfer.getData("segmentId");
        const segmentText = e.dataTransfer.getData("segmentText");
        if (!segmentId || !segmentText) return;

        const newTargetSlots = [...targetSlots];
        const newDraggableSegments = [...draggableSegments];

        // If the slot is already filled, move its content back to draggables
        if (newTargetSlots[slotIndex]) {
            const oldSegmentInSlot = newTargetSlots[slotIndex];
            if (!newDraggableSegments.find(s => s.id === oldSegmentInSlot.id)) { // Avoid duplicates
                 newDraggableSegments.push(oldSegmentInSlot);
            }
        }
        
        newTargetSlots[slotIndex] = { id: segmentId, text: segmentText };
        
        // Remove from draggableSegments or other target slots
        setDraggableSegments(newDraggableSegments.filter(s => s.id !== segmentId));
        setTargetSlots(newTargetSlots.map((s, i) => (s?.id === segmentId && i !== slotIndex) ? null : s));
    };
    
    const handleDropOnDraggableArea = (e) => {
        e.preventDefault();
        const segmentId = e.dataTransfer.getData("segmentId");
        const segmentText = e.dataTransfer.getData("segmentText");
        if (!segmentId || !segmentText) return;

        // Remove from targetSlots if it was there
        const newTargetSlots = targetSlots.map(s => (s?.id === segmentId ? null : s));
        setTargetSlots(newTargetSlots);

        // Add back to draggableSegments if not already there
        if (!draggableSegments.find(s => s.id === segmentId)) {
            setDraggableSegments(prev => shuffleArray([...prev, { id: segmentId, text: segmentText }]));
        }
    };


    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="word-order-sentence">
            <p className="sentence-label">{t('sentenceLabel', {number: sentenceIndex + 1}) || `Sentence ${sentenceIndex + 1}`}:</p>
            <div 
                className="wo-draggable-area"
                onDrop={handleDropOnDraggableArea}
                onDragOver={handleDragOver}
            >
                {draggableSegments.map(segment => (
                    <span
                        key={segment.id}
                        className="wo-draggable-segment"
                        draggable
                        onDragStart={(e) => handleDragStart(e, segment.id)}
                    >
                        {segment.text}
                    </span>
                ))}
                {draggableSegments.length === 0 && <span className="wo-empty-area-placeholder">{t('woDragSourceEmpty') || '(Drag words from below)'}</span>}
            </div>
            <div className="wo-target-area">
                {targetSlots.map((segment, index) => (
                    <span
                        key={`slot-${sentenceData.id}-${index}`}
                        className={`wo-target-slot ${segment ? 'filled' : ''}`}
                        onDrop={(e) => handleDropOnTarget(e, index)}
                        onDragOver={handleDragOver}
                        draggable={!!segment}
                        onDragStart={(e) => segment && handleDragStart(e, segment.id)}
                    >
                        {segment ? segment.text : (t('dropSegmentPrompt') || '___')}
                    </span>
                ))}
            </div>
        </div>
    );
};


const WordOrderBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { title, instructions, sentences = [] } = blockData;

    const getLocalizedText = (multilingualObject, fallbackKey = 'COSYenglish') => {
        if (!multilingualObject) return '';
        if (typeof multilingualObject === 'string') return multilingualObject;
        return multilingualObject[currentUILanguage] || multilingualObject[fallbackKey] || multilingualObject[Object.keys(multilingualObject)[0]] || '';
    };

    return (
        <div className="word-order-block">
            {title && getLocalizedText(title) && <h4>{getLocalizedText(title)}</h4>}
            {instructions && getLocalizedText(instructions) && <p className="instructions">{getLocalizedText(instructions)}</p>}

            {sentences.map((sentence, index) => (
                <WordOrderSentence 
                    key={sentence.id || index} 
                    sentenceData={sentence} 
                    sentenceIndex={index}
                    currentUILanguage={currentUILanguage}
                    getLocalizedText={getLocalizedText}
                    t={t}
                />
            ))}
            {sentences.length === 0 && <p>{t('noSentencesForWordOrder') || 'No sentences configured for this word order exercise.'}</p>}
             {/* Future: Check Answers button */}
        </div>
    );
};
// Helper for unique IDs if not already available, in case sentenceData.id is not present during initial creation
const uuidv4 = () => { 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default WordOrderBlock;
