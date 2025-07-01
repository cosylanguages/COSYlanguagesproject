import React, { useState, useEffect, useCallback } from 'react';
import { loadGenderGrammarData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText } from '../../../../utils/speechUtils';
import { normalizeString } from '../../../../utils/stringUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';

const ArticleWordExercise = ({ language, days, exerciseKey }) => {
  const [grammarItem, setGrammarItem] = useState(null); // { word: '...', article: '...' }
  const [variation, setVariation] = useState(null); // { type: 'article'/'word', question: '...', answer: '...' }
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;

  const setupNewExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFeedback({ message: '', type: '' });
    setUserInput('');
    setIsRevealed(false);
    setGrammarItem(null);
    setVariation(null);

    try {
      const { data: items, error: fetchError } = await loadGenderGrammarData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load gender grammar data.');
      }
      if (items && items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setGrammarItem(randomItem);

        if (Math.random() < 0.5) {
          setVariation({ type: 'article', question: randomItem.word, answer: randomItem.article, pronounceable: randomItem.word });
        } else {
          setVariation({ type: 'word', question: randomItem.article, answer: randomItem.word, pronounceable: randomItem.article });
        }
      } else {
        setError('No gender grammar data found for the selected criteria.');
      }
    } catch (err) {
      console.error("ArticleWordExercise - Error setting up:", err);
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

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!variation || !grammarItem || isRevealed) return;
    
    const expectedAnswer = variation.answer;
    const latinizedExpected = getLatinizedText(expectedAnswer, language);
    const displayCorrect = isLatinized ? latinizedExpected : expectedAnswer;

    if (normalizeString(userInput) === normalizeString(expectedAnswer)) {
      setFeedback({ message: 'Correct!', type: 'correct' });
    } else {
      setFeedback({ message: `Incorrect. The correct answer is: ${displayCorrect}`, type: 'incorrect' });
    }
  };

  const showHint = () => {
    if (!variation || isRevealed) return;
    const answerForHint = variation.answer;
    let hintLetter = '';
    if (answerForHint && answerForHint.length > 0) {
      hintLetter = answerForHint[0];
    }
    setFeedback({ message: `Hint: The answer starts with '${getLatinizedText(hintLetter, language)}'.`, type: 'hint' });
  };

  const revealAnswer = () => {
    if (!variation || !grammarItem) return;
    const expectedAnswer = variation.answer;
    const latinizedExpected = getLatinizedText(expectedAnswer, language);
    const displayCorrect = isLatinized ? latinizedExpected : expectedAnswer;

    setUserInput(expectedAnswer); 
    setFeedback({ message: `The correct answer is: ${displayCorrect}`, type: 'info' });
    setIsRevealed(true);
  };

  const handlePronounceQuestion = () => {
    if (variation && variation.pronounceable && language) {
      pronounceText(variation.pronounceable, language).catch(err => {
        console.error("Pronunciation error:", err);
        setFeedback({message: "Could not pronounce the question.", type: "error"});
      });
    }
  };

  if (isLoading) return <p>Loading article/word exercise...</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!variation) return <FeedbackDisplay message="No exercise data available. Try different selections." type="info" />;

  const questionText = getLatinizedText(variation.question, language);
  const promptText = variation.type === 'article' ? `What is the article for "${questionText}"?` : `What is the word for "${questionText}"?`;

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Article & Word Practice</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '1.5rem' }}>
        <p>{promptText}</p>
        {variation.pronounceable && (
          <button 
            onClick={handlePronounceQuestion} 
            title={`Pronounce "${variation.pronounceable}"`}
            style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', marginLeft:'10px'}}
          >
            🔊
          </button>
        )}
      </div>
      
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Type your answer..."
        disabled={isRevealed}
        style={{ padding: '10px', fontSize: '1rem', width: '250px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      
      <ExerciseControls
        onCheckAnswer={!isRevealed ? checkAnswer : undefined}
        onShowHint={!isRevealed ? showHint : undefined}
        onRevealAnswer={!isRevealed ? revealAnswer : undefined}
        onNextExercise={setupNewExercise}
        config={{ 
            showCheck: !isRevealed, 
            showHint: !isRevealed, 
            showReveal: !isRevealed,
            showNext: true,
        }}
      />
    </div>
  );
};

export default ArticleWordExercise;
