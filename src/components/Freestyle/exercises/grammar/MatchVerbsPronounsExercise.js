import React, { useState, useEffect, useCallback } from 'react';
import { loadVerbGrammarData } from '../../../../utils/exerciseDataService';
import { processVerbData } from '../../../../utils/grammarSentenceGenerator';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';
import { useProgress } from '../../../../contexts/ProgressContext'; // Import useProgress

const MatchVerbsPronounsExercise = ({ language, days, exerciseKey }) => {
  const [targetVerbInfinitive, setTargetVerbInfinitive] = useState('');
  const [actualPairs, setActualPairs] = useState([]); 
  const [pronounsColumn, setPronounsColumn] = useState([]);
  const [formsColumn, setFormsColumn] = useState([]);
  
  const [selectedPronoun, setSelectedPronoun] = useState(null); 
  const [selectedForm, setSelectedForm] = useState(null); 
  
  const [matchedItems, setMatchedItems] = useState({}); 
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numCorrectMatches, setNumCorrectMatches] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();
  const progress = useProgress();

  const NUM_PAIRS_TO_DISPLAY = 6;

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setSelectedPronoun(null);
    setSelectedForm(null);
    setMatchedItems({});
    setNumCorrectMatches(0);
    setIsRevealed(false);
    setTargetVerbInfinitive('');
    setActualPairs([]);
    setPronounsColumn([]);
    setFormsColumn([]);

    try {
      const { data: rawVerbItems, error: fetchError } = await loadVerbGrammarData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load verb grammar data.');
      }

      if (!rawVerbItems || rawVerbItems.length === 0) {
        setError(t('errors.noVerbData', 'No verb grammar data found for the selected criteria.'));
        setIsLoading(false);
        return;
      }
      
      const processedVerbItems = processVerbData(rawVerbItems, language);
      if (!processedVerbItems || processedVerbItems.length === 0) {
        setError(t('errors.noProcessableVerbData', 'No processable verb items found.'));
        setIsLoading(false);
        return;
      }

      const randomVerbInfinitive = processedVerbItems[Math.floor(Math.random() * processedVerbItems.length)].verb;
      setTargetVerbInfinitive(randomVerbInfinitive);

      const itemsForThisVerb = processedVerbItems.filter(item => item.verb === randomVerbInfinitive);

      if (!itemsForThisVerb || itemsForThisVerb.length < 2) {
        setError(t('errors.notEnoughVerbForms', `Not enough forms for the verb "${randomVerbInfinitive}" to create this exercise. Need at least 2.`, {verb: randomVerbInfinitive}));
        setIsLoading(false);
        return;
      }
      
      const selectedItems = shuffleArray(itemsForThisVerb).slice(0, NUM_PAIRS_TO_DISPLAY);
      setActualPairs(selectedItems);
      setPronounsColumn(shuffleArray(selectedItems.map(p => p.pronoun)));
      setFormsColumn(shuffleArray(selectedItems.map(p => p.form)));

    } catch (err) {
      console.error("MatchVerbsPronounsExercise - Error setting up:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupNewExercise();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [setupNewExercise, exerciseKey, language, days, t]);
  
  const handleItemClick = (value, type, ref) => {
    if (matchedItems[value] || isRevealed) return;

    if (type === 'pronoun') {
      if (selectedPronoun && selectedPronoun.elementRef === ref) setSelectedPronoun(null);
      else setSelectedPronoun({ value, elementRef: ref });
      setFeedback({message: '', type: ''});
    } else if (type === 'form') {
      if (selectedForm && selectedForm.elementRef === ref) setSelectedForm(null);
      else setSelectedForm({ value, elementRef: ref });
      setFeedback({message: '', type: ''});
    }
  };

  useEffect(() => {
    if (selectedPronoun && selectedForm) {
      const currentPronounValue = selectedPronoun.value;
      const currentFormValue = selectedForm.value;
      const isCorrectMatch = actualPairs.some(pair => 
        pair.pronoun === currentPronounValue && pair.form === currentFormValue
      );
      // Construct a unique ID for the specific pronoun-form pair of this verb
      const itemId = `verbmatch_${targetVerbInfinitive}_${currentPronounValue}_${currentFormValue}`;

      if (isCorrectMatch) {
        setFeedback({ message: t('feedback.correctMatch', 'Correct Match!'), type: 'correct' });
        setMatchedItems(prev => ({ ...prev, [currentPronounValue]: true, [currentFormValue]: true }));
        setNumCorrectMatches(prev => prev + 1);
        progress.awardCorrectAnswer(itemId, 'grammar-match-verb');
      } else {
        setFeedback({ message: t('feedback.incorrectMatch', 'Incorrect Match. Try again.'), type: 'incorrect' });
        progress.awardIncorrectAnswer(itemId, 'grammar-match-verb');
        if (selectedPronoun.elementRef) selectedPronoun.elementRef.classList.add('incorrect-flash');
        if (selectedForm.elementRef) selectedForm.elementRef.classList.add('incorrect-flash');
        setTimeout(() => {
            if (selectedPronoun && selectedPronoun.elementRef) selectedPronoun.elementRef.classList.remove('incorrect-flash');
            if (selectedForm && selectedForm.elementRef) selectedForm.elementRef.classList.remove('incorrect-flash');
        }, 1000);
      }
      setSelectedPronoun(null);
      setSelectedForm(null);
    }
  }, [selectedPronoun, selectedForm, actualPairs, t, language, progress, targetVerbInfinitive]);

  useEffect(() => {
    if (actualPairs.length > 0 && numCorrectMatches === actualPairs.length && !isRevealed) {
      setFeedback({ message: t('feedback.allPairsMatched', 'All pairs matched! Well done!'), type: 'success' });
    }
  }, [numCorrectMatches, actualPairs.length, isRevealed, t]);

  const showHint = () => {
    if (isRevealed || numCorrectMatches === actualPairs.length) return;
    const unMatched = actualPairs.filter(p => !matchedItems[p.pronoun] || !matchedItems[p.form]);
    if (unMatched.length > 0) {
      const hintPair = unMatched[0];
      setFeedback({ 
        message: t('feedback.hintMatchVerb', `Hint: Try matching "${getLatinizedText(hintPair.pronoun, language)}" with "${getLatinizedText(hintPair.form, language)}".`, {item1: getLatinizedText(hintPair.pronoun, language), item2: getLatinizedText(hintPair.form, language)}), 
        type: 'hint' 
      });
    } else {
      setFeedback({ message: t('feedback.noMoreHints', "No more hints available."), type: 'info' });
    }
  };
  
  const revealAllAnswers = () => {
    setIsRevealed(true);
    const allMatched = {};
    actualPairs.forEach(p => {
      allMatched[p.pronoun] = true;
      allMatched[p.form] = true;
      const itemId = `verbmatch_${targetVerbInfinitive}_${p.pronoun}_${p.form}`;
      progress.scheduleReview(itemId, 'grammar-match-verb', false);
    });
    setMatchedItems(allMatched);
    setNumCorrectMatches(actualPairs.length);
    setFeedback({ message: t('feedback.allPairsRevealed', "All pairs revealed."), type: 'info' });
  };

  if (isLoading) return <p>{t('loading.matchVerbExercise', 'Loading match verbs exercise...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (actualPairs.length === 0 && !isLoading) return <FeedbackDisplay message={t('exercises.noData', "No pairs available for this exercise.")} type="info" />;

  const columnStyle = { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch', margin: '0 15px', flex: 1 };
  const itemStyleBuilder = (value, type) => {
    let isSelected = (type === 'pronoun' && selectedPronoun?.value === value) || (type === 'form' && selectedForm?.value === value);
    return { 
        padding: '12px 18px', 
        border: `2px solid ${isSelected ? '#007bff' : (matchedItems[value] ? '#28a745' : '#ccc')}`, 
        borderRadius: '8px', 
        cursor: (matchedItems[value] || isRevealed) ? 'default' : 'pointer', 
        textAlign: 'center',
        backgroundColor: matchedItems[value] ? '#d4edda' : (isSelected ? '#cfe2ff' : '#f8f9fa'),
        transition: 'background-color 0.2s, border-color 0.2s',
        opacity: (isRevealed && !matchedItems[value]) ? 0.5 : 1,
    };
  };
  const latinizedVerbInfinitive = getLatinizedText(targetVerbInfinitive, language);

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.matchVerbPronoun', 'Match Pronouns with Verb Forms')}</h3>
      <p style={{fontSize: '1.2em', fontWeight: 'bold', ...(isLatinized && targetVerbInfinitive !== latinizedVerbInfinitive && {fontStyle: 'italic'})}}>
        {t('labels.verb', 'Verb')}: {latinizedVerbInfinitive || targetVerbInfinitive}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', margin: '20px 0' }}>
        <div style={columnStyle}>
          <h4>{t('labels.pronouns', 'Pronouns')}</h4>
          {pronounsColumn.map(pronoun => {
            const ref = React.createRef();
            return (
            <button 
              key={`pronoun-${pronoun}`} 
              ref={ref}
              style={itemStyleBuilder(pronoun, 'pronoun')}
              onClick={() => handleItemClick(pronoun, 'pronoun', ref.current)}
              disabled={matchedItems[pronoun] || isRevealed}
            >
              {getLatinizedText(pronoun, language)}
            </button>
          )})}
        </div>
        <div style={columnStyle}>
          <h4>{t('labels.verbForms', 'Verb Forms')}</h4>
          {formsColumn.map(form => {
            const ref = React.createRef();
            return (
            <button 
              key={`form-${form}`} 
              ref={ref}
              style={itemStyleBuilder(form, 'form')}
              onClick={() => handleItemClick(form, 'form', ref.current)}
              disabled={matchedItems[form] || isRevealed}
            >
              {getLatinizedText(form, language)}
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

export default MatchVerbsPronounsExercise;
