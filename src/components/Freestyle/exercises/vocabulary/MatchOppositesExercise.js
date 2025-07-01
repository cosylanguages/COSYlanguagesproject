import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadOppositesData } from '../../../../utils/exerciseDataService';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { normalizeString } from '../../../../utils/stringUtils';

const MatchOppositesExercise = ({ language, days, exerciseKey }) => {
  const [pairs, setPairs] = useState([]);
  const [wordsColumn, setWordsColumn] = useState([]);
  const [oppositesColumn, setOppositesColumn] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // { value: string, element: HTMLElement }
  const [selectedOpposite, setSelectedOpposite] = useState(null); // { value: string, element: HTMLElement }
  const [matchedItems, setMatchedItems] = useState({}); // { [itemValue]: true }
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numCorrectMatches, setNumCorrectMatches] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [lines, setLines] = useState([]); // For drawing lines between matched items

  // const { isLatinized } = useLatinizationContext(); // This instance of isLatinized is unused.
  useLatinizationContext(); // Called to satisfy rules-of-hooks, assuming other context values might be used later or were used before.
  const getLatinizedText = useLatinization;

  const itemRefs = useRef({}); // To store refs for each matchable item
  const columnsContainerRef = useRef(null); // Ref for the div containing both columns

  const NUM_PAIRS_TO_DISPLAY = 4;

  const setupExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setSelectedWord(null);
    setSelectedOpposite(null);
    setMatchedItems({});
    setNumCorrectMatches(0);
    setIsRevealed(false);
    setLines([]); // Clear lines
    itemRefs.current = {}; // Clear old refs

    try {
      const { data: oppositesMap, error: fetchError } = await loadOppositesData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load opposites data.');
      }

      if (!oppositesMap || Object.keys(oppositesMap).length < NUM_PAIRS_TO_DISPLAY / 2) {
        setError(`Not enough opposites data (found ${Object.keys(oppositesMap).length}) for this exercise. Need at least ${NUM_PAIRS_TO_DISPLAY / 2} base pairs.`);
        setPairs([]);
        setIsLoading(false);
        return;
      }

      const allPossiblePairs = Object.entries(oppositesMap).map(([word, opposite]) => ({ word, opposite }));
      const shuffledPossiblePairs = shuffleArray(allPossiblePairs);
      const selectedPairs = shuffledPossiblePairs.slice(0, NUM_PAIRS_TO_DISPLAY);

      if (selectedPairs.length < 1) {
        setError('Could not select enough unique pairs for the exercise.');
        setPairs([]);
        setIsLoading(false);
        return;
      }

      setPairs(selectedPairs);
      setWordsColumn(shuffleArray(selectedPairs.map(p => p.word)));
      setOppositesColumn(shuffleArray(selectedPairs.map(p => p.opposite)));

    } catch (err) {
      console.error("MatchOppositesExercise - Error setting up exercise:", err);
      setError(err.message || 'An unexpected error occurred.');
      setPairs([]);
    } finally {
      setIsLoading(false);
    }
  }, [language, days]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupExercise();
    } else {
      setIsLoading(false);
      setError("Please select a language and day(s).");
    }
  }, [setupExercise, exerciseKey, language, days]);

  const handleItemClick = (itemValue, type, event) => {
    if (matchedItems[itemValue] || isRevealed) return;

    const currentSelection = { value: itemValue, element: event.target };

    if (type === 'word') {
      if (selectedWord && selectedWord.element === event.target) {
        setSelectedWord(null); // Deselect if clicking the same selected item
        // event.target.classList.remove('selected'); // classList managed by style logic
        return;
      }
      // if(selectedWord && selectedWord.element) selectedWord.element.classList.remove('selected');
      setSelectedWord(currentSelection);
      // event.target.classList.add('selected');
    } else if (type === 'opposite') {
      if (selectedOpposite && selectedOpposite.element === event.target) {
        setSelectedOpposite(null); // Deselect
        // event.target.classList.remove('selected');
        return;
      }
      // if(selectedOpposite && selectedOpposite.element) selectedOpposite.element.classList.remove('selected');
      setSelectedOpposite(currentSelection);
      // event.target.classList.add('selected');
    }
  };

  const drawLine = useCallback((el1, el2) => {
    if (!el1 || !el2 || !columnsContainerRef.current) return;

    const containerRect = columnsContainerRef.current.getBoundingClientRect();
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - containerRect.left + columnsContainerRef.current.scrollLeft;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top + columnsContainerRef.current.scrollTop;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left + columnsContainerRef.current.scrollLeft;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top + columnsContainerRef.current.scrollTop;
    
    const lineKey = `line-${normalizeString(el1.textContent)}-${normalizeString(el2.textContent)}`;
    setLines(prevLines => [...prevLines, { x1, y1, x2, y2, key: lineKey }]);
  }, []);

  useEffect(() => {
    if (selectedWord && selectedOpposite) {
      const currentWordValue = selectedWord.value;
      const currentOppositeValue = selectedOpposite.value;
      const isCorrectMatch = pairs.some(pair =>
        (pair.word === currentWordValue && pair.opposite === currentOppositeValue)
      );
      const itemId = `matchopposite_${normalizeString(currentWordValue)}_${normalizeString(currentOppositeValue)}`;

      if (isCorrectMatch) {
        setFeedback({ message: 'Correct Match!', type: 'correct' });
        setMatchedItems(prev => ({ ...prev, [currentWordValue]: true, [currentOppositeValue]: true }));
        
        if (selectedWord.element && selectedOpposite.element) {
          drawLine(selectedWord.element, selectedOpposite.element);
        }
        
        setNumCorrectMatches(prev => prev + 1);
        
        setSelectedWord(null); // Clear selections immediately after correct match
        setSelectedOpposite(null);

      } else {
        setFeedback({ message: 'Incorrect Match. Try again.', type: 'incorrect' });
        
        // Visual feedback for incorrect (e.g., flash border red)
        if(selectedWord.element) selectedWord.element.classList.add('incorrect-flash');
        if(selectedOpposite.element) selectedOpposite.element.classList.add('incorrect-flash');
        
        setTimeout(() => {
            if(selectedWord && selectedWord.element) selectedWord.element.classList.remove('incorrect-flash');
            if(selectedOpposite && selectedOpposite.element) selectedOpposite.element.classList.remove('incorrect-flash');
            setSelectedWord(null);
            setSelectedOpposite(null);
        }, 1000);
      }
    }
  }, [selectedWord, selectedOpposite, pairs, drawLine]);

  useEffect(() => {
    if (pairs.length > 0 && numCorrectMatches === pairs.length && !isRevealed) {
      setFeedback({ message: 'All pairs matched! Well done!', type: 'success' });
    }
  }, [numCorrectMatches, pairs.length, isRevealed]);

  const showHint = () => {
    if (isRevealed || numCorrectMatches === pairs.length) return;
    const unMatchedPairs = pairs.filter(p => !matchedItems[p.word] && !matchedItems[p.opposite]);
    if (unMatchedPairs.length > 0) {
      const hintPair = unMatchedPairs[0];
      setFeedback({ message: `Hint: Try matching "${getLatinizedText(hintPair.word, language)}" or "${getLatinizedText(hintPair.opposite, language)}".`, type: 'hint' });
    } else {
      setFeedback({ message: "No more hints available.", type: 'info' });
    }
  };

  const revealAllAnswers = () => {
    setIsRevealed(true);
    const allCurrentlyMatched = {};
    const linesForRevealed = []; 
    pairs.forEach(pair => {
      allCurrentlyMatched[pair.word] = true;
      allCurrentlyMatched[pair.opposite] = true;

      const el1 = itemRefs.current[`word-${pair.word}`];
      const el2 = itemRefs.current[`opposite-${pair.opposite}`];
      if (el1 && el2 && columnsContainerRef.current) {
        const containerRect = columnsContainerRef.current.getBoundingClientRect();
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        const x1 = rect1.left + rect1.width / 2 - containerRect.left + columnsContainerRef.current.scrollLeft;
        const y1 = rect1.top + rect1.height / 2 - containerRect.top + columnsContainerRef.current.scrollTop;
        const x2 = rect2.left + rect2.width / 2 - containerRect.left + columnsContainerRef.current.scrollLeft;
        const y2 = rect2.top + rect2.height / 2 - containerRect.top + columnsContainerRef.current.scrollTop;
        linesForRevealed.push({ x1, y1, x2, y2, key: `line-${normalizeString(pair.word)}-${normalizeString(pair.opposite)}` });
      }
    });
    setMatchedItems(allCurrentlyMatched);
    setLines(linesForRevealed); // Use the new variable here
    setNumCorrectMatches(pairs.length);
    setFeedback({ message: "All pairs revealed.", type: 'info' });
  };

  if (isLoading) return <p>Loading matching exercise...</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (pairs.length === 0 && !isLoading) return <FeedbackDisplay message="No pairs available for this exercise." type="info" />;

  const columnStyle = { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', margin: '0 15px', flex: 1 };
  const itemStyle = (value, type) => {
    let base = {
      padding: '12px 18px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      minWidth: '150px',
      textAlign: 'center',
      backgroundColor: '#fff',
      transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    };
    if (matchedItems[value]) {
      base.backgroundColor = '#e6ffed';
      base.borderColor = '#b7eac9';
      base.cursor = 'default';
      base.fontWeight = 'bold';
    } else if ((type === 'word' && selectedWord?.value === value) || (type === 'opposite' && selectedOpposite?.value === value)) {
      base.backgroundColor = '#e0efff';
      base.borderColor = '#90caf9';
      base.transform = 'scale(1.03)';
    }
    return base;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
      <h3>Match the Opposites</h3>
      <div 
        ref={columnsContainerRef} 
        style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', position: 'relative' }}
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
        <div style={{...columnStyle, zIndex: 1}}> {/* Ensure columns are above SVG lines */}
          <h4>Words</h4>
          {wordsColumn.map(word => (
            <button
              key={`word-${word}`}
              ref={el => itemRefs.current[`word-${word}`] = el}
              style={itemStyle(word, 'word')}
              onClick={(e) => handleItemClick(word, 'word', e)}
              disabled={matchedItems[word] || isRevealed}
              className={ (selectedWord?.value === word && !matchedItems[word]) ? 'selected-match-item' : '' }
            >
              {getLatinizedText(word, language)}
            </button>
          ))}
        </div>
        <div style={{...columnStyle, zIndex: 1}}>
          <h4>Opposites</h4>
          {oppositesColumn.map(opposite => (
            <button
              key={`opp-${opposite}`}
              ref={el => itemRefs.current[`opposite-${opposite}`] = el}
              style={itemStyle(opposite, 'opposite')}
              onClick={(e) => handleItemClick(opposite, 'opposite', e)}
              disabled={matchedItems[opposite] || isRevealed}
              className={ (selectedOpposite?.value === opposite && !matchedItems[opposite]) ? 'selected-match-item' : '' }
            >
              {getLatinizedText(opposite, language)}
            </button>
          ))}
        </div>
      </div>
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      <ExerciseControls
        onShowHint={!isRevealed && numCorrectMatches < pairs.length ? showHint : undefined}
        onRevealAnswer={!isRevealed && numCorrectMatches < pairs.length ? revealAllAnswers : undefined}
        onNextExercise={setupExercise}
        config={{
          showCheck: false,
          showHint: !isRevealed && numCorrectMatches < pairs.length && pairs.length > 0,
          showReveal: !isRevealed && numCorrectMatches < pairs.length && pairs.length > 0,
          showNext: true,
        }}
      />
    </div>
  );
};

export default MatchOppositesExercise;
