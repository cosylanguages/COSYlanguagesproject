import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadImageData } from '../../../../utils/exerciseDataService';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { useProgress } from '../../../../contexts/ProgressContext';
import { normalizeString } from '../../../../utils/stringUtils';

const MatchImageWordExercise = ({ language, days, exerciseKey }) => {
  const [gameItems, setGameItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Array of selected item objects
  const [matchedPairs, setMatchedPairs] = useState({}); // { [pairId]: true }
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPairs, setNumPairs] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [lines, setLines] = useState([]); // For drawing lines

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const progress = useProgress();

  const itemRefs = useRef({}); // To store refs for each clickable item
  const gridContainerRef = useRef(null); // Ref for the grid container

  const NUM_PAIRS_FOR_GAME = 4;

  const setupExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setSelectedItems([]);
    setMatchedPairs({});
    setNumPairs(0);
    setGameItems([]);
    setLines([]); // Clear lines
    setIsRevealed(false);
    itemRefs.current = {}; // Clear old refs

    try {
      const { data: imagesData, error: fetchError } = await loadImageData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load image data.');
      }

      if (!imagesData || imagesData.length < NUM_PAIRS_FOR_GAME) {
        setError(`Not enough images for this exercise. Need at least ${NUM_PAIRS_FOR_GAME}. Found ${imagesData?.length || 0}.`);
        setIsLoading(false);
        return;
      }

      const selectedImages = shuffleArray(imagesData).slice(0, NUM_PAIRS_FOR_GAME);
      setNumPairs(selectedImages.length);

      let currentIdSuffix = 0;
      const itemsToSet = [];
      selectedImages.forEach((imgData) => {
        const word = imgData.translations[language] || imgData.word; // Fallback to imgData.word if translation missing
        const pairId = `pair-${imgData.id || Date.now() + '-' + (currentIdSuffix++)}`;
        itemsToSet.push({ type: 'image', value: imgData.src, id: `img-${pairId}`, pairId: pairId, src: imgData.src, alt: word });
        itemsToSet.push({ type: 'word', value: word, id: `word-${pairId}`, pairId: pairId });
      });

      setGameItems(shuffleArray(itemsToSet));

    } catch (err) {
      console.error("MatchImageWordExercise - Error setting up:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [language, days, NUM_PAIRS_FOR_GAME]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupExercise();
    } else {
      setIsLoading(false);
      setError("Please select a language and day(s).");
    }
  }, [setupExercise, exerciseKey, language, days]);

  const handleItemClick = (item) => {
    if (isRevealed || matchedPairs[item.pairId] || selectedItems.find(sel => sel.id === item.id) || selectedItems.length >= 2) {
      return;
    }
    const newSelectedItems = [...selectedItems, item];
    setSelectedItems(newSelectedItems);
    setFeedback({ message: '', type: '' });
  };
  
  const drawLineBetweenItems = useCallback((item1Id, item2Id) => {
    const el1 = itemRefs.current[item1Id];
    const el2 = itemRefs.current[item2Id];

    if (!el1 || !el2 || !gridContainerRef.current) return;

    const containerRect = gridContainerRef.current.getBoundingClientRect();
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - containerRect.left + gridContainerRef.current.scrollLeft;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top + gridContainerRef.current.scrollTop;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left + gridContainerRef.current.scrollLeft;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top + gridContainerRef.current.scrollTop;

    const lineKey = `line-${item1Id}-${item2Id}`;
    // Avoid duplicate lines if already drawn (e.g. if logic re-triggers)
    setLines(prevLines => {
        if (prevLines.some(l => l.key === lineKey || l.key === `line-${item2Id}-${item1Id}`)) {
            return prevLines;
        }
        return [...prevLines, { x1, y1, x2, y2, key: lineKey }];
    });
  }, []);


  useEffect(() => {
    if (selectedItems.length === 2) {
      const [item1, item2] = selectedItems;
      const wordItem = item1.type === 'word' ? item1 : (item2.type === 'word' ? item2 : null);
      const imageItem = item1.type === 'image' ? item1 : (item2.type === 'image' ? item2 : null);
      const itemIdForProgress = `matchimg_${imageItem ? normalizeString(imageItem.value) : 'unknownimg'}_${wordItem ? normalizeString(wordItem.value) : 'unknownword'}`;

      if (item1.pairId === item2.pairId) {
        setFeedback({ message: 'Correct Match!', type: 'correct' });
        setMatchedPairs(prev => ({ ...prev, [item1.pairId]: true }));
        drawLineBetweenItems(item1.id, item2.id);
        progress.awardCorrectAnswer(itemIdForProgress, 'vocab-match-image-word', language);
        setSelectedItems([]);
      } else {
        setFeedback({ message: 'Incorrect Match. Try again.', type: 'incorrect' });
        progress.awardIncorrectAnswer(itemIdForProgress, 'vocab-match-image-word', language);
        
        const el1 = itemRefs.current[item1.id];
        const el2 = itemRefs.current[item2.id];
        if(el1) el1.classList.add('incorrect-flash');
        if(el2) el2.classList.add('incorrect-flash');

        setTimeout(() => {
          if(el1) el1.classList.remove('incorrect-flash');
          if(el2) el2.classList.remove('incorrect-flash');
          setSelectedItems([]);
        }, 1000);
      }
    }
  }, [selectedItems, progress, language, drawLineBetweenItems]);

  useEffect(() => {
    if (numPairs > 0 && Object.keys(matchedPairs).length === numPairs && !isRevealed) {
      setFeedback({ message: 'All pairs matched! Well done!', type: 'success' });
    }
  }, [matchedPairs, numPairs, isRevealed]);

  const showHint = () => {
     if (isRevealed || Object.keys(matchedPairs).length >= numPairs) return;
    // Find an unmatched pairId
    const allPairIds = new Set(gameItems.map(item => item.pairId));
    const matchedPairIds = new Set(Object.keys(matchedPairs));
    let hintPairId = null;
    for (const id of allPairIds) {
        if (!matchedPairIds.has(id)) {
            hintPairId = id;
            break;
        }
    }

    if (hintPairId) {
        const pairHintItems = gameItems.filter(item => item.pairId === hintPairId);
        if (pairHintItems.length === 2) {
            const item1Text = pairHintItems[0].type === 'word' ? pairHintItems[0].value : `the image for "${pairHintItems[0].alt}"`;
            const item2Text = pairHintItems[1].type === 'word' ? pairHintItems[1].value : `the image for "${pairHintItems[1].alt}"`;
            setFeedback({ message: `Hint: Try matching ${getLatinizedText(item1Text, language)} with ${getLatinizedText(item2Text, language)}.`, type: 'hint' });
        }
    } else {
        setFeedback({ message: "No more hints available.", type: 'info' });
    }
  };

  const revealAllAnswers = () => {
    setIsRevealed(true);
    const allPairsRevealed = {};
    const newLines = [];
    const uniquePairIds = [...new Set(gameItems.map(item => item.pairId))];

    uniquePairIds.forEach(pairId => {
      allPairsRevealed[pairId] = true;
      const itemsInPair = gameItems.filter(item => item.pairId === pairId);
      if (itemsInPair.length === 2) {
        drawLineBetweenItems(itemsInPair[0].id, itemsInPair[1].id);
        
        const wordItem = itemsInPair.find(pi => pi.type === 'word');
        const imageItem = itemsInPair.find(pi => pi.type === 'image');
        if(wordItem && imageItem){
            const itemIdForProgress = `matchimg_${normalizeString(imageItem.value)}_${normalizeString(wordItem.value)}`;
            progress.scheduleReview(itemIdForProgress, 'vocab-match-image-word', language, false);
        }
      }
    });
    setMatchedPairs(allPairsRevealed);
    // setLines(newLines); // drawLineBetweenItems updates lines state directly
    setFeedback({ message: "All pairs revealed.", type: 'info' });
  };

  if (isLoading) return <p>Loading match image & word exercise...</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (gameItems.length === 0 && !isLoading) return <FeedbackDisplay message="No items available for this exercise." type="info" />;

  const getItemStyle = (item) => {
    let style = {
      padding: '10px', margin: '5px', border: '2px solid #ddd', borderRadius: '8px',
      cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '80px', minWidth: '100px', backgroundColor: '#fff', transition: 'all 0.2s ease-out',
      boxSizing: 'border-box',
    };
    if (selectedItems.find(sel => sel.id === item.id) && !matchedPairs[item.pairId]) {
      style.borderColor = '#007bff';
      style.boxShadow = '0 0 5px rgba(0,123,255,0.5)';
    }
    if (matchedPairs[item.pairId]) {
      style.backgroundColor = '#e6ffed';
      style.borderColor = '#b7eac9';
      style.cursor = 'default';
    }
    return style;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '700px', margin: 'auto' }}>
      <h3>Match Image with Word</h3>
      <div 
        ref={gridContainerRef} 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '15px', 
          margin: '20px auto', 
          position: 'relative' 
        }}
      >
        <svg 
          style={{ 
            position: 'absolute', top: 0, left: 0, 
            width: '100%', height: '100%', 
            pointerEvents: 'none', zIndex: 0 
          }}
        >
          {lines.map(line => (
            <line 
              key={line.key} 
              x1={line.x1} y1={line.y1} 
              x2={line.x2} y2={line.y2} 
              stroke="#28a745" strokeWidth="3" opacity="0.7"
            />
          ))}
        </svg>
        {gameItems.map((item) => (
          <button
            key={item.id}
            ref={el => itemRefs.current[item.id] = el}
            data-id={item.id}
            style={{...getItemStyle(item), zIndex: 1}} // Ensure buttons are above SVG
            onClick={() => handleItemClick(item)}
            disabled={isRevealed || matchedPairs[item.pairId]}
            className={matchedPairs[item.pairId] ? 'matched' : (selectedItems.find(sel => sel.id === item.id) ? 'selected-match-item' : '')}
          >
            {item.type === 'image' ? (
              <img src={item.src.startsWith('assets/') ? `/${item.src}` : item.src} alt={item.alt || "Match image"} style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'contain' }} />
            ) : (
              <span style={{...(isLatinized && item.value !== getLatinizedText(item.value, language) && {fontStyle:'italic'})}}>
                {getLatinizedText(item.value, language)}
              </span>
            )}
          </button>
        ))}
      </div>
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      <ExerciseControls
        onShowHint={!isRevealed && Object.keys(matchedPairs).length < numPairs ? showHint : undefined}
        onRevealAnswer={!isRevealed && Object.keys(matchedPairs).length < numPairs ? revealAllAnswers : undefined}
        onNextExercise={setupExercise}
        config={{
          showCheck: false,
          showHint: !isRevealed && Object.keys(matchedPairs).length < numPairs && numPairs > 0,
          showReveal: !isRevealed && Object.keys(matchedPairs).length < numPairs && numPairs > 0,
          showNext: true,
        }}
      />
    </div>
  );
};

export default MatchImageWordExercise;
