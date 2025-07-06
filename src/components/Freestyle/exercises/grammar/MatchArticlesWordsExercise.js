import React, { useState, useEffect, useCallback } from 'react';
import { loadGenderGrammarData } from '../../../../utils/exerciseDataService';
// import { useLatinizationContext } from '../../../../contexts/LatinizationContext'; // Commented out: isLatinized from here is unused
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';

const MatchArticlesWordsExercise = ({ language, days, exerciseKey }) => {
  const [actualPairs, setActualPairs] = useState([]); 
  const [articlesColumn, setArticlesColumn] = useState([]);
  const [wordsColumn, setWordsColumn] = useState([]);
  
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  
  const [matchedPairs, setMatchedPairs] = useState({});
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numCorrectMatches, setNumCorrectMatches] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // const { isLatinized } = useLatinizationContext(); // ESLint: 'isLatinized' is assigned a value but never used.
  const getLatinizedText = useLatinization;

  const NUM_PAIRS_TO_DISPLAY = 4;

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setSelectedArticle(null);
    setSelectedWord(null);
    setMatchedPairs({});
    setNumCorrectMatches(0);
    setIsRevealed(false);
    setActualPairs([]);
    setArticlesColumn([]);
    setWordsColumn([]);

    try {
      const { data: items, error: fetchError } = await loadGenderGrammarData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load gender grammar data.');
      }

      if (!items || items.length < NUM_PAIRS_TO_DISPLAY) {
        setError(`Not enough gender grammar data (found ${items?.length || 0}). Need at least ${NUM_PAIRS_TO_DISPLAY} items.`);
        setIsLoading(false);
        return;
      }

      const uniqueItems = [];
      const seenWords = new Set();
      for (const item of items) {
        if (!seenWords.has(item.word)) {
          uniqueItems.push(item);
          seenWords.add(item.word);
        }
      }
      
      if (uniqueItems.length < NUM_PAIRS_TO_DISPLAY) {
         setError(`Not enough unique gender grammar items (found ${uniqueItems.length}). Need at least ${NUM_PAIRS_TO_DISPLAY} unique items.`);
         setIsLoading(false);
         return;
      }

      const selectedItems = shuffleArray(uniqueItems).slice(0, NUM_PAIRS_TO_DISPLAY);
      setActualPairs(selectedItems);
      setArticlesColumn(shuffleArray(selectedItems.map(p => p.article)));
      setWordsColumn(shuffleArray(selectedItems.map(p => p.word)));

    } catch (err) {
      console.error("MatchArticlesWordsExercise - Error setting up:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [language, days]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupNewExercise();
    } else {
      setIsLoading(false);
      setError("Please select a language and day(s).");
    }
  }, [setupNewExercise, exerciseKey, language, days]);
  
  const handleItemClick = (value, type, ref) => {
    if (matchedPairs[value] || isRevealed) return;

    if (type === 'article') {
      if (selectedArticle && selectedArticle.elementRef === ref) {
        setSelectedArticle(null);
      } else {
        setSelectedArticle({ value, elementRef: ref });
      }
      setFeedback({message: '', type: ''});
    } else if (type === 'word') {
      if (selectedWord && selectedWord.elementRef === ref) {
        setSelectedWord(null);
      } else {
        setSelectedWord({ value, elementRef: ref });
      }
      setFeedback({message: '', type: ''});
    }
  };

  useEffect(() => {
    if (selectedArticle && selectedWord) {
      const currentWordValue = selectedWord.value; // To avoid issues with stale closure
      const currentArticleValue = selectedArticle.value;
      const isCorrectMatch = actualPairs.some(pair => 
        pair.article === currentArticleValue && pair.word === currentWordValue
      );
      // const itemId = `gender_${currentWordValue}_${currentArticleValue}`; // ESLint: 'itemId' is assigned a value but never used.

      if (isCorrectMatch) {
        setFeedback({ message: 'Correct Match!', type: 'correct' });
        setMatchedPairs(prev => ({ ...prev, [currentArticleValue]: true, [currentWordValue]: true }));
        setNumCorrectMatches(prev => prev + 1);
      } else {
        setFeedback({ message: 'Incorrect Match. Try again.', type: 'incorrect' });
        if (selectedArticle.elementRef) selectedArticle.elementRef.classList.add('incorrect-flash');
        if (selectedWord.elementRef) selectedWord.elementRef.classList.add('incorrect-flash');
        setTimeout(() => {
            if (selectedArticle && selectedArticle.elementRef) selectedArticle.elementRef.classList.remove('incorrect-flash');
            if (selectedWord && selectedWord.elementRef) selectedWord.elementRef.classList.remove('incorrect-flash');
        }, 1000);
      }
      setSelectedArticle(null);
      setSelectedWord(null);
    }
  }, [selectedArticle, selectedWord, actualPairs]); // Removed 'language' as getLatinizedText not used here

  useEffect(() => {
    if (actualPairs.length > 0 && numCorrectMatches === actualPairs.length && !isRevealed) {
      setFeedback({ message: 'All pairs matched! Well done!', type: 'success' });
    }
  }, [numCorrectMatches, actualPairs.length, isRevealed]);

  const showHint = () => {
    if (isRevealed || numCorrectMatches === actualPairs.length) return;
    const unMatched = actualPairs.filter(p => !matchedPairs[p.article] || !matchedPairs[p.word]); // This logic might be tricky if one part of pair is matched
    if (unMatched.length > 0) {
      const hintPair = unMatched[0]; // Simplified hint: reveals one correct pair
      setFeedback({ 
        message: `Hint: Try matching "${getLatinizedText(hintPair.article, language)}" with "${getLatinizedText(hintPair.word, language)}".`, 
        type: 'hint' 
      });
    } else {
      setFeedback({ message: "No more hints available.", type: 'info' });
    }
  };
  
  const revealAllAnswers = () => {
    setIsRevealed(true);
    const allMatched = {};
    actualPairs.forEach(p => {
      allMatched[p.article] = true;
      allMatched[p.word] = true;
    });
    setMatchedPairs(allMatched);
    setNumCorrectMatches(actualPairs.length);
    setFeedback({ message: "All pairs revealed.", type: 'info' });
  };

  if (isLoading) return <p>Loading matching exercise...</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (actualPairs.length === 0 && !isLoading) return <FeedbackDisplay message="No pairs available for this exercise." type="info" />;

  const columnStyle = { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch', margin: '0 15px', flex: 1 };
  const itemStyleBuilder = (value, type) => { // Removed 'ref' as it's not used for styling directly here
    let isSelected = (type === 'article' && selectedArticle?.value === value) || (type === 'word' && selectedWord?.value === value);
    return { 
        padding: '12px 18px', 
        border: `2px solid ${isSelected ? '#007bff' : (matchedPairs[value] ? '#28a745' : '#ccc')}`, 
        borderRadius: '8px', 
        cursor: (matchedPairs[value] || isRevealed) ? 'default' : 'pointer', 
        textAlign: 'center',
        backgroundColor: matchedPairs[value] ? '#d4edda' : (isSelected ? '#cfe2ff' : '#f8f9fa'),
        transition: 'background-color 0.2s, border-color 0.2s',
        opacity: (isRevealed && !matchedPairs[value]) ? 0.5 : 1, // Dim if revealed and not part of a correct pair
    };
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Match Articles with Words</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', margin: '20px 0' }}>
        <div style={columnStyle}>
          <h4>Articles</h4>
          {articlesColumn.map(article => {
            const ref = React.createRef(); // Keep ref for click handler to pass element
            return (
            <button 
              key={`article-${article}`} 
              ref={ref}
              style={itemStyleBuilder(article, 'article')}
              onClick={() => handleItemClick(article, 'article', ref.current)}
              disabled={matchedPairs[article] || isRevealed}
            >
              {getLatinizedText(article, language)}
            </button>
          )})}
        </div>
        <div style={columnStyle}>
          <h4>Words</h4>
          {wordsColumn.map(word => {
            const ref = React.createRef(); // Keep ref for click handler
            return (
            <button 
              key={`word-${word}`} 
              ref={ref}
              style={itemStyleBuilder(word, 'word')}
              onClick={() => handleItemClick(word, 'word', ref.current)}
              disabled={matchedPairs[word] || isRevealed}
            >
              {getLatinizedText(word, language)}
            </button>
          )})}
        </div>
      </div>
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      <ExerciseControls
        onShowHint={!isRevealed && numCorrectMatches < actualPairs.length ? showHint : undefined}
        onRevealAnswer={!isRevealed && numCorrectMatches < actualPairs.length ? revealAllAnswers : undefined}
        onNextExercise={setupNewExercise}
        config={{
          showCheck: false, 
          showHint: !isRevealed && numCorrectMatches < actualPairs.length,
          showReveal: !isRevealed && numCorrectMatches < actualPairs.length,
          showNext: true,
        }}
      />
    </div>
  );
};

export default MatchArticlesWordsExercise;
