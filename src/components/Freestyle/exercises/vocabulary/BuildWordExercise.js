import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { normalizeString } from '../../../../utils/stringUtils';
import { useI18n } from '../../../../i18n/I18nContext'; // Assuming i18n for texts


const BuildWordExercise = ({ language, days, exerciseKey }) => {
  const [correctWord, setCorrectWord] = useState('');
  const [shuffledLetters, setShuffledLetters] = useState([]); 
  const [wordSlots, setWordSlots] = useState([]); 
  
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrectState, setIsCorrectState] = useState(false); // Renamed to avoid conflict with isCorrect variable in checkAnswer

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization; // Use the hook directly
  const { t } = useI18n(); // For internationalized strings

  const latinizedCorrectWord = getLatinizedText(correctWord, language);

  const setupNewWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setIsRevealed(false);
    setIsCorrectState(false); // Use the new state variable
    setCorrectWord('');
    setShuffledLetters([]);
    setWordSlots([]);

    try {
      const { data: words, error: fetchError } = await loadVocabularyData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load vocabulary words.');
      }
      if (words && words.length > 0) {
        let wordForExercise;
        const singleWords = words.filter(w => !w.includes(' ') && w.length > 2 && w.length < 15);
        if (singleWords.length > 0) {
            wordForExercise = singleWords[Math.floor(Math.random() * singleWords.length)];
        } else {
            // Fallback if no suitable single words are found, though less ideal for "Build Word"
            wordForExercise = words[Math.floor(Math.random() * words.length)].split(' ')[0]; 
            if(wordForExercise.length <= 2 || wordForExercise.length >=15) { 
                 setError(t('exercises.noSuitableWordBuild', 'Could not find a suitable word (3-14 letters, no spaces) for "Build Word" exercise.'));
                 setIsLoading(false);
                 return;
            }
        }
        
        setCorrectWord(wordForExercise);
        setWordSlots(Array(wordForExercise.length).fill({ char: null, originalTileId: null }));
        setShuffledLetters(
          shuffleArray(
            wordForExercise.split('').map((char, index) => ({ char, id: index, inSlot: false, slotIndex: null }))
          )
        );
      } else {
        setError(t('exercises.noWordsFound', 'No vocabulary words found for the selected criteria.'));
      }
    } catch (err) {
      console.error("BuildWordExercise - Error fetching word:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupNewWord();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [setupNewWord, exerciseKey, language, days, t]);

  const handleTileClick = (tile) => {
    if (isRevealed || isCorrectState || tile.inSlot) return;

    const newWordSlots = [...wordSlots];
    const firstEmptySlotIndex = newWordSlots.findIndex(slot => slot.char === null);

    if (firstEmptySlotIndex !== -1) {
      newWordSlots[firstEmptySlotIndex] = { char: tile.char, originalTileId: tile.id };
      setWordSlots(newWordSlots);

      const newShuffledLetters = shuffledLetters.map(t =>
        t.id === tile.id ? { ...t, inSlot: true, slotIndex: firstEmptySlotIndex } : t
      );
      setShuffledLetters(newShuffledLetters);
      setFeedback({ message: '', type: '' });
    }
  };

  const handleSlotClick = (slotIndex) => {
    if (isRevealed || isCorrectState || !wordSlots[slotIndex] || wordSlots[slotIndex].char === null) return;

    const tileToReturnId = wordSlots[slotIndex].originalTileId;
    
    const newWordSlots = [...wordSlots];
    newWordSlots[slotIndex] = { char: null, originalTileId: null };
    setWordSlots(newWordSlots);

    const newShuffledLetters = shuffledLetters.map(t =>
      t.id === tileToReturnId ? { ...t, inSlot: false, slotIndex: null } : t
    );
    setShuffledLetters(newShuffledLetters);
    setFeedback({ message: '', type: '' });
  };
  
  const checkAnswer = () => {
    if (isRevealed || isCorrectState || !correctWord) return;
    const constructedWord = wordSlots.map(slot => slot.char).join('');
    const itemId = `buildword_${normalizeString(correctWord)}`;
    const isCorrectNow = normalizeString(constructedWord) === normalizeString(correctWord);

    if (isCorrectNow) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setIsCorrectState(true);
      setTimeout(() => {
        setupNewWord();
      }, 1500); // Auto-progress
    } else {
      setFeedback({ message: t('feedback.incorrectKeepTrying', `Incorrect. Keep trying or use a hint.`), type: 'incorrect' });
    }
  };

  const showHint = () => {
    if (isRevealed || isCorrectState || !correctWord) return;
    let hintSlotIndex = -1;
    const currentConstructedWord = wordSlots.map(slot => slot.char).join('');

    for (let i = 0; i < correctWord.length; i++) {
      if (!wordSlots[i] || !wordSlots[i].char || normalizeString(wordSlots[i].char) !== normalizeString(correctWord[i])) {
        hintSlotIndex = i;
        break;
      }
    }
    if (hintSlotIndex === -1 && currentConstructedWord.length < correctWord.length) {
        hintSlotIndex = currentConstructedWord.length;
    }

    if (hintSlotIndex !== -1) {
      const correctCharForHint = correctWord[hintSlotIndex];
      // If the slot is filled but incorrect, clear it first
      if (wordSlots[hintSlotIndex] && wordSlots[hintSlotIndex].char && normalizeString(wordSlots[hintSlotIndex].char) !== normalizeString(correctCharForHint)) {
        handleSlotClick(hintSlotIndex); // This will update slots and letters, then we re-evaluate
         // We need to re-find the tile after state update, so this hint action becomes more complex
         // For simplicity now, we'll just place it if the slot is empty or correctly filled by this hint
      }
      
      const tileToPlace = shuffledLetters.find(t => !t.inSlot && normalizeString(t.char) === normalizeString(correctCharForHint));
      if (tileToPlace) {
        const newSlots = [...wordSlots]; // Use fresh slots state in case handleSlotClick was called
        newSlots[hintSlotIndex] = { char: tileToPlace.char, originalTileId: tileToPlace.id };
        setWordSlots(newSlots);
        setShuffledLetters(prevLetters => prevLetters.map(t => t.id === tileToPlace.id ? {...t, inSlot:true, slotIndex: hintSlotIndex} : t));
        setFeedback({ message: t('feedback.hintLetterPlaced', `Hint: Letter "${getLatinizedText(correctCharForHint, language)}" placed.`, { letter: getLatinizedText(correctCharForHint, language) }), type: 'hint' });
      } else {
         setFeedback({ message: t('feedback.hintLetterMisplaced', 'Hint: Could not find the next correct letter in the pool (it might be misplaced).'), type: 'info' });
      }
    } else {
      setFeedback({ message: t('feedback.hintWordCorrectOrNoMore', 'Word seems correct or no more hints applicable.'), type: 'info' });
    }
  };
  
  const revealTheAnswer = () => { // Renamed from revealAnswer
    if (!correctWord) return;
    const itemId = `buildword_${normalizeString(correctWord)}`;
    setWordSlots(correctWord.split('').map((char, index) => ({ char, originalTileId: -1-index }))); 
    setShuffledLetters(shuffledLetters.map(tile => ({...tile, inSlot: true, slotIndex: correctWord.indexOf(tile.char) }))); 
    setFeedback({ message: t('feedback.answerIs', `The word is: ${latinizedCorrectWord || correctWord}`, { answer: latinizedCorrectWord || correctWord }), type: 'info' });
    setIsRevealed(true);
    setIsCorrectState(true); 
    if(!isCorrectState) { // Only auto-progress if not already answered correctly before reveal
        setTimeout(() => {
            setupNewWord();
        }, 2000); // Auto-progress
    }
  };

  const handleReset = () => {
     if (!correctWord || isRevealed || isCorrectState) return; // Prevent reset if already solved/revealed
     setWordSlots(Array(correctWord.length).fill({ char: null, originalTileId: null }));
     setShuffledLetters(
          shuffleArray( 
            correctWord.split('').map((char, index) => ({ char, id: index, inSlot: false, slotIndex: null }))
          )
     );
     setFeedback({ message: '', type: '' });
     // setIsRevealed(false); // Should not reset revealed status on tile reset
     // setIsCorrectState(false); // Should not reset correct status on tile reset
  };

  if (isLoading) return <p>{t('loading.buildWordExercise', 'Loading word building exercise...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!correctWord) return <p>{t('exercises.noWordForBuild', 'No word available for this exercise.')}</p>;

  const tileBaseStyle = { padding: '10px 15px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', minWidth: '40px', textAlign: 'center', userSelect: 'none', backgroundColor: '#f8f9fa' };
  const slotBaseStyle = { ...tileBaseStyle, backgroundColor: '#e9ecef', cursor: 'default', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '48px' };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.buildTheWord', 'Build the Word')}</h3>
      <button onClick={() => pronounceText(correctWord, language)} disabled={!correctWord} title={t('tooltips.pronounceWord', "Pronounce the word")} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', verticalAlign:'middle', marginBottom:'10px'}}>🔊</button>
      <div id="word-slots" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', minHeight: '50px', flexWrap: 'wrap' }}>
        {wordSlots.map((slot, index) => (
          <div key={`slot-${index}`} style={slotBaseStyle} onClick={() => handleSlotClick(index)}>
            {slot.char ? <span style={{...(isLatinized && slot.char !== getLatinizedText(slot.char, language) && {fontStyle:'italic'})}}>{getLatinizedText(slot.char, language)}</span> : '?'}
          </div>
        ))}
      </div>
      <div id="letter-pool" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px', minHeight: '50px', border: '1px dashed #ddd', padding: '10px', borderRadius: '5px' }}>
        {shuffledLetters.filter(tile => !tile.inSlot).map(tile => (
          <button 
            key={`tile-${tile.id}`} 
            style={tileBaseStyle} 
            onClick={() => handleTileClick(tile)}
            disabled={isRevealed || isCorrectState}
          >
            <span style={{...(isLatinized && tile.char !== getLatinizedText(tile.char, language) && {fontStyle:'italic'})}}>{getLatinizedText(tile.char, language)}</span>
          </button>
        ))}
         {shuffledLetters.filter(tile => !tile.inSlot).length === 0 && !isCorrectState && <span style={{color: '#888'}}>{t('feedback.allLettersPlaced', 'All letters placed!')}</span>}
      </div>
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      <ExerciseControls
        onCheckAnswer={!isRevealed && !isCorrectState && wordSlots.every(s => s.char) && correctWord ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isCorrectState && correctWord ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isCorrectState && correctWord ? revealTheAnswer : undefined} // Changed to revealTheAnswer
        onNextExercise={setupNewWord} 
        config={{ 
            showCheck: !isRevealed && !isCorrectState && wordSlots.every(s => s.char) && !!correctWord, 
            showHint: !isRevealed && !isCorrectState && !!correctWord, 
            showReveal: !isRevealed && !isCorrectState && !!correctWord,
            showNext: true, 
        }}
      />
       <button onClick={handleReset} style={{...tileBaseStyle, backgroundColor: '#6c757d', color: 'white', marginTop:'10px'}} disabled={isRevealed || isCorrectState || !correctWord}>
        🔄 {t('buttons.resetTiles', 'Reset Tiles')}
      </button>
    </div>
  );
};

export default BuildWordExercise;
