// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService';
import { shuffleArray } from '../../../../utils/arrayUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { useI18n } from '../../../../i18n/I18nContext';
import './MatchWordsWithPicturesExercise.css'; // To be created

const NUM_ITEMS_FOR_EXERCISE = 4; // e.g., 4 pictures and 4 words

const MatchWordsWithPicturesExercise = ({ language, days, exerciseKey, onComplete }) => {
  const { t } = useI18n();
  const { isLatinized } = useLatinizationContext(); // Not directly used for image matching, but good to have if text appears
  const getLatinizedText = useLatinization;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [displayPictures, setDisplayPictures] = useState([]); // { id, imageUrl, originalWord, status, matchedWordId }
  const [displayWords, setDisplayWords] = useState([]);       // { id, text, status, matchedPicId }
  const [internalCorrectPairs, setInternalCorrectPairs] = useState([]); // { word, image } for validation

  const [selectedItem, setSelectedItem] = useState(null); // { type: 'word'|'picture', id: string, data: any }
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [matchedCount, setMatchedCount] = useState(0);

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setDisplayPictures([]);
    setDisplayWords([]);
    setInternalCorrectPairs([]);
    setSelectedItem(null);
    setMatchedCount(0);

    try {
      const { data: allVocabItems, error: fetchError } = await loadVocabularyData(language, days);
      if (fetchError) throw new Error(fetchError.message || t('errors.failedToLoadData', 'Failed to load data.'));
      
      const itemsWithImages = allVocabItems.filter(item => item.word && item.image);
      if (itemsWithImages.length < NUM_ITEMS_FOR_EXERCISE) {
        setError(t('exercises.notEnoughImageWordPairs', 'Not enough word-picture pairs found for this exercise.'));
        setIsLoading(false);
        return;
      }

      const shuffledData = shuffleArray(itemsWithImages);
      const selectedItemsForGame = shuffledData.slice(0, NUM_ITEMS_FOR_EXERCISE);
      
      setInternalCorrectPairs(selectedItemsForGame.map(item => ({ word: item.word, image: item.image })));

      const pictures = selectedItemsForGame.map((item, index) => ({
        id: `pic_${item.word}_${index}`,
        imageUrl: item.image,
        originalWord: item.word,
        status: 'unselected',
        matchedWordId: null,
      }));
      setDisplayPictures(shuffleArray(pictures));

      const words = selectedItemsForGame.map((item, index) => ({
        id: `word_${item.word}_${index}`,
        text: item.word,
        status: 'unselected',
        matchedPicId: null,
      }));
      setDisplayWords(shuffleArray(words));

    } catch (err) {
      console.error("MatchWordsWithPicturesExercise - Error setting up:", err);
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

  const handleWordClick = (wordItem) => {
    if (wordItem.status === 'matched' || isLoading || (selectedItem && selectedItem.type === 'word')) return;
    setFeedback({ message: '', type: '' });

    if (selectedItem && selectedItem.type === 'picture') {
      // A picture was selected, now a word is clicked - check match
      checkMatch(selectedItem, wordItem);
    } else {
      // This is the first selection, or deselecting a word to select another
      setSelectedItem({ type: 'word', id: wordItem.id, data: wordItem });
      setDisplayWords(prev => prev.map(w => 
        w.id === wordItem.id ? {...w, status: 'selected'} : {...w, status: w.status === 'selected' ? 'unselected' : w.status}
      ));
      // Deselect any selected picture
      setDisplayPictures(prev => prev.map(p => ({...p, status: p.status === 'selected' ? 'unselected' : p.status })));
    }
  };

  const handlePictureClick = (picItem) => {
    if (picItem.status === 'matched' || isLoading || (selectedItem && selectedItem.type === 'picture')) return;
    setFeedback({ message: '', type: '' });

    if (selectedItem && selectedItem.type === 'word') {
      // A word was selected, now a picture is clicked - check match
      checkMatch(selectedItem, picItem);
    } else {
      // This is the first selection, or deselecting a picture to select another
      setSelectedItem({ type: 'picture', id: picItem.id, data: picItem });
      setDisplayPictures(prev => prev.map(p => 
        p.id === picItem.id ? {...p, status: 'selected'} : {...p, status: p.status === 'selected' ? 'unselected' : p.status}
      ));
      // Deselect any selected word
      setDisplayWords(prev => prev.map(w => ({...w, status: w.status === 'selected' ? 'unselected' : w.status })));
    }
  };

  const checkMatch = (item1, item2) => {
    // item1 is the first selected, item2 is the second. One is word, one is picture.
    const wordData = item1.type === 'word' ? item1.data : item2.data;
    const pictureData = item1.type === 'picture' ? item1.data : item2.data;

    const isCorrect = pictureData.originalWord === wordData.text;

    if (isCorrect) {
      setFeedback({ message: t('feedback.matchCorrect', 'Match found!'), type: 'correct' });
      const newMatchedCount = matchedCount + 1;
      setMatchedCount(newMatchedCount);

      setDisplayWords(prev => prev.map(w => w.id === wordData.id ? { ...w, status: 'matched', matchedPicId: pictureData.id } : w));
      setDisplayPictures(prev => prev.map(p => p.id === pictureData.id ? { ...p, status: 'matched', matchedWordId: wordData.id } : p));
      
      if (newMatchedCount === internalCorrectPairs.length) {
        setFeedback({ message: t('feedback.allPairsMatched', 'Well done! All pairs matched.'), type: 'success' });
        if(onComplete) onComplete();
      }
    } else {
      setFeedback({ message: t('feedback.matchIncorrect', 'Not a match. Try again.'), type: 'incorrect' });
      // Briefly show selection then unselect both if incorrect
      setTimeout(() => {
        if (wordData.status !== 'matched') setDisplayWords(prev => prev.map(w => w.id === wordData.id ? { ...w, status: 'unselected' } : w));
        if (pictureData.status !== 'matched') setDisplayPictures(prev => prev.map(p => p.id === pictureData.id ? { ...p, status: 'unselected' } : p));
      }, 700);
    }
    setSelectedItem(null); // Reset selection
  };
  
  const isCompleted = matchedCount === internalCorrectPairs.length && internalCorrectPairs.length > 0;

  if (isLoading) return <p>{t('loading.matchWordsPictures', 'Loading Match Words with Pictures exercise...')}</p>;
  if (error) return (
    <div>
        <FeedbackDisplay message={error} type="error" />
        <ExerciseControls onNextExercise={setupNewExercise} config={{showNext: true}} />
    </div>
  );
   if (displayPictures.length === 0 && displayWords.length === 0 && !isLoading) {
    return <FeedbackDisplay message={t('exercises.noData', "No exercise data available. Try different selections.")} type="info" />;
  }

  return (
    <div className="match-words-pictures-exercise">
      <h3>{t('titles.matchWordsToPictures', 'Match the Words to the Pictures')}</h3>
      
      <div className="pictures-area-mwp">
        {displayPictures.map(pic => (
          <div 
            key={pic.id} 
            className={`picture-item-mwp ${pic.status} ${selectedItem?.id === pic.id ? 'selected' : ''}`}
            onClick={() => handlePictureClick(pic)}
            role="button"
            aria-pressed={selectedItem?.id === pic.id}
            tabIndex={pic.status !== 'matched' ? 0 : -1}
          >
            <img src={pic.imageUrl} alt={t('altTexts.pictureForMatching', `Picture ${pic.originalWord}`)} />
            {pic.status === 'matched' && <span className="checkmark-mwp">✅</span>}
          </div>
        ))}
      </div>

      <div className="words-area-mwp">
        {displayWords.map(word => (
          <button
            key={word.id}
            className={`word-item-mwp ${word.status} ${selectedItem?.id === word.id ? 'selected' : ''}`}
            onClick={() => handleWordClick(word)}
            disabled={word.status === 'matched' || isLoading}
          >
            {getLatinizedText(word.text, language)}
          </button>
        ))}
      </div>

      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <ExerciseControls
        onNextExercise={setupNewExercise}
        config={{ showCheck: false, showHint: false, showReveal: false, showNext: true }}
        isAnswerCorrect={isCompleted}
      />
    </div>
  );
};

export default MatchWordsWithPicturesExercise;
