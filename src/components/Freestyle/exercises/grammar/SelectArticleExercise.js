import React, { useState, useEffect, useCallback } from 'react';
import { loadGenderGrammarData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import { pronounceText } from '../../../../utils/speechUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
// import { useProgress } from '../../../../contexts/ProgressContext'; // Removed useProgress
import { useI18n } from '../../../../i18n/I18nContext';

const SelectArticleExercise = ({ language, days, exerciseKey }) => {
  const [currentItem, setCurrentItem] = useState(null); 
  const [articleOptions, setArticleOptions] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  // const progress = useProgress(); // Removed progress
  const { t } = useI18n();

  const NUM_ARTICLE_OPTIONS = 4;

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setCurrentItem(null);
    setArticleOptions([]);
    setIsRevealed(false);
    setSelectedOption(null);

    try {
      const { data: grammarItems, error: fetchError } = await loadGenderGrammarData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load gender grammar data.');
      }

      if (!grammarItems || grammarItems.length === 0) {
        setError(t('errors.noGenderData', 'No gender grammar data found for the selected criteria.'));
        setIsLoading(false);
        return;
      }

      const randomItem = grammarItems[Math.floor(Math.random() * grammarItems.length)];
      setCurrentItem(randomItem);

      const correctArticle = randomItem.article;
      let options = [correctArticle];
      
      const allPossibleArticles = [...new Set(grammarItems.map(item => item.article))];
      let distractors = allPossibleArticles.filter(art => art !== correctArticle);
      distractors = shuffleArray(distractors);

      for (let i = 0; i < Math.min(NUM_ARTICLE_OPTIONS - 1, distractors.length); i++) {
        options.push(distractors[i]);
      }
      
      while (options.length < NUM_ARTICLE_OPTIONS && allPossibleArticles.length > options.length) {
        const potentialOption = allPossibleArticles.find(art => !options.includes(art));
        if(potentialOption) options.push(potentialOption); else break;
      }
      
      setArticleOptions(shuffleArray(options));

    } catch (err) {
      console.error("SelectArticleExercise - Error setting up:", err);
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

  const handleOptionClick = (selectedArticleValue) => {
    if (isRevealed || selectedOption || !currentItem) return;

    setSelectedOption(selectedArticleValue);
    const correctArticle = currentItem.article;
    const latinizedCorrect = getLatinizedText(correctArticle, language);
    const displayCorrect = isLatinized ? latinizedCorrect : correctArticle;
    // const itemId = `gender_${currentItem.word}_${correctArticle}`; // Removed

    if (selectedArticleValue === correctArticle) {
      setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      // progress.awardCorrectAnswer(itemId, 'grammar-select-article'); // Removed
    } else {
      setFeedback({ message: t('feedback.incorrectArticle', `Incorrect. The correct article is: ${displayCorrect}`, { correctAnswer: displayCorrect }), type: 'incorrect' });
      // progress.awardIncorrectAnswer(itemId, 'grammar-select-article'); // Removed
    }
  };

  const showHint = () => {
    if (isRevealed || !currentItem || selectedOption) return;
    const incorrectOptions = articleOptions.filter(opt => opt !== currentItem.article);
    if (incorrectOptions.length > 1) {
      const optionToRemove = incorrectOptions[0];
      setArticleOptions(prevOptions => prevOptions.filter(opt => opt !== optionToRemove));
      setFeedback({ message: t('feedback.hintOptionRemoved', 'Hint: One incorrect option removed.'), type: 'hint' });
    } else {
      setFeedback({ message: t('feedback.noMoreHints', 'No more hints available for this question.'), type: 'info' });
    }
  };

  const revealTheAnswer = () => {
    if (!currentItem) return;
    
    const correctArticle = currentItem.article;
    const latinizedCorrect = getLatinizedText(correctArticle, language);
    const displayCorrect = isLatinized ? latinizedCorrect : correctArticle;
    // const itemId = `gender_${currentItem.word}_${correctArticle}`; // Removed
    
    setFeedback({ message: t('feedback.revealedArticle', `The correct article for "${getLatinizedText(currentItem.word, language)}" is: ${displayCorrect}`, { word: getLatinizedText(currentItem.word, language), correctAnswer: displayCorrect }), type: 'info' });
    setIsRevealed(true);
    setSelectedOption(correctArticle); 
    // progress.scheduleReview(itemId, 'grammar-select-article', false); // Removed
  };

  const handlePronounceWord = () => {
    if (currentItem && currentItem.word && language) {
      pronounceText(currentItem.word, language).catch(err => {
        console.error("Pronunciation error:", err);
        setFeedback({message: t('errors.pronunciationError', "Could not pronounce the word."), type: "error"});
      });
    }
  };

  if (isLoading) return <p>{t('loading.selectArticleExercise', 'Loading select article exercise...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />; // FeedbackDisplay might be an issue if not present
  if (!currentItem && !isLoading) return <FeedbackDisplay message={t('exercises.noData', "No exercise data available. Try different selections.")} type="info" />; // FeedbackDisplay might be an issue
  
  const wordToDisplay = currentItem ? getLatinizedText(currentItem.word, language) : "";

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.selectCorrectArticle', 'Select the Correct Article for:')}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '2rem' }}>
        <span style={{...(isLatinized && currentItem && currentItem.word !== wordToDisplay && {fontStyle: 'italic'})}}>{wordToDisplay}</span>
        {currentItem && currentItem.word && (
          <button 
            onClick={handlePronounceWord} 
            title={t('tooltips.pronounceWord', `Pronounce "${currentItem.word}"`)}
            style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', marginLeft:'10px'}}
          >
            🔊
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {articleOptions.map(option => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={isRevealed || !!selectedOption}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              cursor: (isRevealed || !!selectedOption) ? 'default' : 'pointer',
              border: `2px solid ${(selectedOption === option && feedback.type === 'correct') ? '#28a745' : (selectedOption === option && feedback.type === 'incorrect') ? '#dc3545' : (isRevealed && option === currentItem?.article) ? '#28a745' : '#007bff'}`,
              backgroundColor: (selectedOption === option && feedback.type === 'correct') ? '#d4edda' : (selectedOption === option && feedback.type === 'incorrect') ? '#f8d7da' : (isRevealed && option === currentItem?.article) ? '#d4edda' :'#007bff',
              color: (selectedOption === option && (feedback.type === 'correct' || feedback.type === 'incorrect')) ? '#000' : (isRevealed && option === currentItem?.article) ? '#000' : '#fff',
              borderRadius: '5px',
              opacity: (isRevealed && selectedOption !== option && option !== currentItem?.article) ? 0.5 : 1,
            }}
          >
            {getLatinizedText(option, language)}
          </button>
        ))}
      </div>
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      
      <ExerciseControls
        onShowHint={!isRevealed && !selectedOption && articleOptions.length > 1 && articleOptions.filter(opt => opt !== currentItem?.article).length > 1 ? showHint : undefined}
        onRevealAnswer={!isRevealed && !selectedOption ? revealTheAnswer : undefined}
        onNextExercise={setupNewExercise}
        config={{ 
            showCheck: false,
            showHint: !isRevealed && !selectedOption && articleOptions.length > 1 && articleOptions.filter(opt => opt !== currentItem?.article).length > 1,
            showReveal: !isRevealed && !selectedOption,
            showNext: true,
        }}
      />
    </div>
  );
};

export default SelectArticleExercise;
