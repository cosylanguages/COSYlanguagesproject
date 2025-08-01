import React, { useState, useEffect, useCallback } from 'react';
import { loadVerbGrammarData, loadVocabularyData } from '../../../../utils/exerciseDataService';
import { processVerbData, generateGrammarExerciseSentence, setGrammarGeneratorTranslations } from '../../../../utils/grammarSentenceGenerator'; 
// import { useLatinizationContext } from '../../../../contexts/LatinizationContext'; // Commented out: isLatinized from here is unused
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { normalizeString } from '../../../../utils/stringUtils';
import { logMistake } from '../../../../utils/mistakeLogger';
import { getNextGrammarReviewInterval, getGrammarReviewSchedule, updateGrammarReviewSchedule } from '../../../../utils/srs';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';

const WordOrderExercise = ({ language, days, exerciseKey }) => {
  const [exerciseData, setExerciseData] = useState(null); 
  const [wordPool, setWordPool] = useState([]); 
  const [constructedSentence, setConstructedSentence] = useState([]); 
  
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // const { isLatinized } = useLatinizationContext(); // ESLint: 'isLatinized' is assigned a value but never used.
  const getLatinizedText = useLatinization;
  const { t, allTranslations } = useI18n();

  useEffect(() => {
    if (allTranslations) {
      setGrammarGeneratorTranslations(allTranslations);
    }
  }, [allTranslations]);

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setExerciseData(null);
    setWordPool([]);
    setConstructedSentence([]);
    setIsRevealed(false);
    setIsCorrect(false);

    try {
      const { data: rawVerbItems, error: verbError } = await loadVerbGrammarData(language, days);
      if (verbError) throw new Error(verbError.message || verbError.error || 'Failed to load verb grammar data.');
      
      const { data: vocabItems, error: vocabError } = await loadVocabularyData(language, days);
      if (vocabError) console.warn("WordOrderExercise: Failed to load vocabulary data.");

      if (rawVerbItems && rawVerbItems.length > 0) {
        const processedVerbItems = processVerbData(rawVerbItems, language);
        if (!processedVerbItems || processedVerbItems.length === 0) {
            setError(t('errors.noProcessableVerbData', 'No processable verb items found.'));
            setIsLoading(false); return;
        }
        const sentenceDetails = await generateGrammarExerciseSentence(language, days, processedVerbItems, vocabItems || []);
        
        if (sentenceDetails && sentenceDetails.correctSentence) {
          let components = sentenceDetails.sentenceComponents;
          if (!components || components.length === 0) {
            components = sentenceDetails.correctSentence.replace(/[.?]$/, "").split(' ');
          }
          setExerciseData({
            correctSentence: sentenceDetails.correctSentence,
            sentenceComponents: components
          });
          setWordPool(shuffleArray(components.map((word, index) => ({ word, id: index }))));
        } else {
          setError(t('errors.couldNotGenerateSentence', 'Could not generate a word order exercise sentence.'));
        }
      } else {
        setError(t('errors.noVerbData', 'No verb grammar data found.'));
      }
    } catch (err) {
      console.error("WordOrderExercise - Error setting up:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) setupNewExercise();
    else { setIsLoading(false); setError(t('errors.selectLangDay', "Please select a language and day(s).")); }
  }, [setupNewExercise, exerciseKey, language, days, t]);

  const handleTileClick = (tile) => {
    if (isRevealed || isCorrect) return;
    setConstructedSentence(prev => [...prev, tile]);
    setWordPool(prev => prev.filter(item => item.id !== tile.id));
    setFeedback({ message: '', type: '' });
  };

  const handleSlotClick = (indexToRemove) => {
    if (isRevealed || isCorrect) return;
    const tileToReturn = constructedSentence[indexToRemove];
    setConstructedSentence(prev => prev.filter((_, index) => index !== indexToRemove));
    setWordPool(prev => shuffleArray([...prev, tileToReturn])); 
    setFeedback({ message: '', type: '' });
  };
  
  const checkAnswer = () => {
    // This function will only be called if the button is active,
    // ExerciseControls handles disabling based on isCorrect/isRevealed.
    if (!exerciseData) return; 
    const userAnswerSentence = constructedSentence.map(item => item.word).join(' ').trim();
    const correctAnswerSentence = exerciseData.correctSentence.replace(/[.?]$/, "").trim();
    // const itemId = `wordorder_${normalizeString(correctAnswerSentence)}`; // itemId not used currently for feedback

    const schedule = getGrammarReviewSchedule();
    const itemId = `wordorder_${normalizeString(correctAnswerSentence)}`;
    const itemSchedule = schedule[itemId] || { interval: 1, factor: 2.5 };

    if (normalizeString(userAnswerSentence) === normalizeString(correctAnswerSentence)) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      setIsCorrect(true);
      const newInterval = getNextGrammarReviewInterval(itemSchedule.interval, itemSchedule.factor);
      schedule[itemId] = { ...itemSchedule, interval: newInterval, nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000) };
    } else {
      setFeedback({ message: t('feedback.incorrectWordOrder', `Incorrect order. The correct sentence is: "${getLatinizedText(exerciseData.correctSentence, language)}"`, {correctSentence: getLatinizedText(exerciseData.correctSentence, language)}), type: 'incorrect' });
      logMistake({
        exercise: 'Word Order',
        userAnswer: userAnswerSentence,
        correctAnswer: correctAnswerSentence,
      });
      schedule[itemId] = { ...itemSchedule, interval: 1 };
    }
    updateGrammarReviewSchedule(schedule);
  };

  const showHint = () => {
    // This function will only be called if the button is active.
    if (!exerciseData || constructedSentence.length >= exerciseData.sentenceComponents.length) return;
    const nextCorrectWordIndex = constructedSentence.length;
    const nextCorrectWordObject = exerciseData.sentenceComponents[nextCorrectWordIndex];
    setFeedback({ message: t('feedback.hintWordOrder', `Hint: The next word is "${getLatinizedText(nextCorrectWordObject, language)}".`, {word: getLatinizedText(nextCorrectWordObject, language)}), type: 'hint' });
  };

  const revealTheAnswer = () => {
    // This function will only be called if the button is active.
    if (!exerciseData) return;
    // const correctAnswerSentence = exerciseData.correctSentence.replace(/[.?]$/, "").trim(); // Not directly used for itemId
    // const itemId = `wordorder_${normalizeString(correctAnswerSentence)}`; // itemId not used currently for feedback
    setConstructedSentence(exerciseData.sentenceComponents.map((word, index) => ({word, id: index})));
    setWordPool([]);
    setFeedback({ message: t('feedback.revealedWordOrder', `The correct order is: "${getLatinizedText(exerciseData.correctSentence, language)}"`, {correctSentence: getLatinizedText(exerciseData.correctSentence, language)}), type: 'info' });
    setIsRevealed(true);
    setIsCorrect(true); // Revealing implies it's "correctly" completed by reveal
  };

  // This function will be passed as onRandomize to ExerciseControls
  const handleResetForRandomize = () => {
    if (!exerciseData) return; // Should not happen if button is active
    setConstructedSentence([]);
    setWordPool(shuffleArray(exerciseData.sentenceComponents.map((word, index) => ({ word, id: index }))));
    setFeedback({ message: '', type: '' });
    setIsCorrect(false);
    setIsRevealed(false);
  };

  if (isLoading) return <p>{t('loading.wordOrderExercise', 'Loading word order exercise...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!exerciseData && !isLoading) return <FeedbackDisplay message={t('exercises.noData', "No exercise data available.")} type="info" />;

  const tileStyle = { padding: '10px 15px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', background: '#f0f0f0'};
  const slotAreaStyle = { minHeight: '50px', border: '2px dashed #ddd', padding: '10px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.arrangeTheWords', 'Arrange the Words to Form a Sentence')}</h3>
      
      <div style={{...slotAreaStyle, justifyContent: 'flex-start', backgroundColor: '#e9ecef'}}>
        {constructedSentence.map((item, index) => (
          <button key={`slot-${item.id}`} onClick={() => handleSlotClick(index)} style={tileStyle} disabled={isRevealed || isCorrect}>
            {getLatinizedText(item.word, language)}
          </button>
        ))}
        {constructedSentence.length === 0 && <span style={{color: '#888'}}>{t('labels.dropWordsHere', 'Click words from below to place them here')}</span>}
      </div>

      <div style={{...slotAreaStyle, justifyContent: 'center', backgroundColor: '#fff'}}>
        {wordPool.map(item => (
          <button key={`pool-${item.id}`} onClick={() => handleTileClick(item)} style={tileStyle} disabled={isRevealed || isCorrect}>
            {getLatinizedText(item.word, language)}
          </button>
        ))}
        {wordPool.length === 0 && constructedSentence.length > 0 && <span style={{color: '#888'}}>{t('labels.allWordsPlaced', 'All words placed!')}</span>}
      </div>
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      
      <ExerciseControls
        onCheckAnswer={checkAnswer}
        onShowHint={showHint}
        onRevealAnswer={revealTheAnswer}
        onRandomize={handleResetForRandomize} 
        onNextExercise={setupNewExercise}
        isAnswerCorrect={isCorrect}
        isRevealed={isRevealed}
        config={{
          showCheck: (exerciseData?.sentenceComponents?.length > 0 && constructedSentence.length === exerciseData.sentenceComponents.length),
          showHint: (exerciseData?.sentenceComponents?.length > 0 && constructedSentence.length < exerciseData.sentenceComponents.length),
          showReveal: true, 
          showRandomize: true, 
          showNext: true,
        }}
      />
      {/* Custom Reset button removed */}
    </div>
  );
};

export default WordOrderExercise;
