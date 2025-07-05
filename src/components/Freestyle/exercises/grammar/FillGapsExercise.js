import React, { useState, useEffect, useCallback } from 'react';
import { loadVerbGrammarData, loadVocabularyData } from '../../../../utils/exerciseDataService';
import { processVerbData, generateGrammarExerciseSentence, setGrammarGeneratorTranslations } from '../../../../utils/grammarSentenceGenerator'; 
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { normalizeString } from '../../../../utils/stringUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { pronounceText } from '../../../../utils/speechUtils';
import { useI18n } from '../../../../i18n/I18nContext';

const FillGapsExercise = ({ language, days, exerciseKey, onComplete }) => { // Added onComplete
  const [exerciseData, setExerciseData] = useState(null); 
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAttemptFinished, setIsAttemptFinished] = useState(false); // New state

  const { isLatinized } = useLatinizationContext();
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
    setUserInput('');
    setIsRevealed(false);
    setIsAttemptFinished(false); // Reset on new exercise
    setExerciseData(null);

    try {
      const { data: rawVerbItems, error: verbError } = await loadVerbGrammarData(language, days);
      if (verbError) throw new Error(verbError.message || verbError.error || 'Failed to load verb grammar data.');
      
      const { data: vocabItems, error: vocabError } = await loadVocabularyData(language, days);
      if (vocabError) console.warn("FillGapsExercise: Failed to load vocabulary data.");
      
      if (rawVerbItems && rawVerbItems.length > 0) {
        const processedVerbItems = processVerbData(rawVerbItems, language);
        if (!processedVerbItems || processedVerbItems.length === 0) {
            setError(t('errors.noProcessableVerbData', 'No processable verb items found.'));
            setIsLoading(false); return;
        }
        const sentenceDetails = await generateGrammarExerciseSentence(language, days, processedVerbItems, vocabItems || []);
        if (sentenceDetails && sentenceDetails.questionPrompt && sentenceDetails.answer) {
          setExerciseData(sentenceDetails);
        } else {
          setError(t('errors.couldNotGenerateSentence', 'Could not generate a fill-gaps exercise sentence.'));
        }
      } else {
        setError(t('errors.noVerbData', 'No verb grammar data found for the selected criteria.'));
      }
    } catch (err) {
      console.error("FillGapsExercise - Error setting up:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]); // Removed getLatinizedText as it's not used directly in useCallback here

  useEffect(() => {
    if (language && days && days.length > 0) {
      setupNewExercise();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [setupNewExercise, exerciseKey, language, days, t]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' }); // Clear feedback on new input
  };

  const checkAnswer = () => {
    if (!exerciseData || isRevealed || isAttemptFinished) return;
    
    setIsAttemptFinished(true); // Mark attempt as finished
    const originalCorrectAnswerString = exerciseData.answer;
    const normalizedUserInput = normalizeString(userInput);
    let isCorrect = false;
    let matchedOriginalAnswer = '';

    const possibleOriginalAnswers = originalCorrectAnswerString.split('/');
    for (const originalAnswerPart of possibleOriginalAnswers) {
      const trimmedOriginalAnswerPart = originalAnswerPart.trim();
      if (normalizeString(trimmedOriginalAnswerPart) === normalizedUserInput) {
        isCorrect = true;
        matchedOriginalAnswer = trimmedOriginalAnswerPart;
        break;
      }
    }

    let timeoutDuration = 1500;
    if (isCorrect) {
      if (userInput.trim() === matchedOriginalAnswer) {
        setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      } else {
        const feedbackMessage = t('feedback.correctAnswerIs', `Correct! The answer is: ${getLatinizedText(matchedOriginalAnswer, language)}`, { correctAnswer: getLatinizedText(matchedOriginalAnswer, language) });
        setFeedback({ message: feedbackMessage, type: 'correct' });
      }
    } else {
      timeoutDuration = 1800; // Longer for incorrect to read
      const firstOriginalAnswerForDisplay = getLatinizedText(possibleOriginalAnswers[0].trim(), language);
      let fullCorrectSentenceForDisplay = exerciseData.correctSentence;
      if (exerciseData.questionPrompt && exerciseData.questionPrompt.includes('___')) {
          fullCorrectSentenceForDisplay = exerciseData.questionPrompt.replace('___', possibleOriginalAnswers[0].trim());
      }
      setFeedback({ 
        message: t('feedback.incorrectFillGaps', `Incorrect. The correct answer is: ${firstOriginalAnswerForDisplay}. Full sentence: ${getLatinizedText(fullCorrectSentenceForDisplay, language)}`, { correctAnswer: firstOriginalAnswerForDisplay, correctSentence: getLatinizedText(fullCorrectSentenceForDisplay, language) }), 
        type: 'incorrect' 
      });
    }

    if (onComplete) {
      setTimeout(() => onComplete(), timeoutDuration);
    }
  };

  const showHint = () => {
    if (!exerciseData || isRevealed || isAttemptFinished) return;
    const answerForHint = exerciseData.answer.split('/')[0].trim();
    let hintLetter = '';
    if (answerForHint && answerForHint.length > 0) {
      hintLetter = answerForHint[0];
    }
    setFeedback({ message: t('feedback.hintFillGaps', `Hint: The answer starts with '${getLatinizedText(hintLetter, language)}'.`, { letter: getLatinizedText(hintLetter, language) }), type: 'hint' });
  };

  const revealTheAnswer = () => {
    if (!exerciseData || isRevealed) return; // Can reveal even if attempt was made but incorrect
    const correctAnswer = exerciseData.answer.split('/')[0].trim();
    const latinizedCorrect = getLatinizedText(correctAnswer, language);
    let fullCorrectSentenceForDisplay = exerciseData.correctSentence;
    if (exerciseData.questionPrompt && exerciseData.questionPrompt.includes('___')) {
        fullCorrectSentenceForDisplay = exerciseData.questionPrompt.replace('___', correctAnswer);
    }

    setUserInput(correctAnswer); 
    setFeedback({ 
      message: t('feedback.revealedFillGaps', `The correct answer is: ${latinizedCorrect}. Full sentence: ${getLatinizedText(fullCorrectSentenceForDisplay, language)}`, { correctAnswer: latinizedCorrect, correctSentence: getLatinizedText(fullCorrectSentenceForDisplay, language) }),
      type: 'info' 
    });
    setIsRevealed(true);
    setIsAttemptFinished(true); // Revealing also finishes the attempt
    if (onComplete) {
      setTimeout(() => onComplete(), 2000);
    }
  };
  
  const handleNextRequest = () => {
    if (onComplete) {
      onComplete();
    } else {
      setupNewExercise(); // Fallback for standalone use
    }
  };

  const handlePronounceSentence = () => {
    if (exerciseData && exerciseData.correctSentence && language) {
        let sentenceToPronounce = exerciseData.correctSentence;
        if (exerciseData.questionPrompt && exerciseData.questionPrompt.includes('___') && exerciseData.answer) {
            const firstCorrectAnswer = exerciseData.answer.split('/')[0].trim();
            sentenceToPronounce = exerciseData.questionPrompt.replace('___', firstCorrectAnswer);
        }
        pronounceText(sentenceToPronounce, language).catch(err => {
            console.error("Pronunciation error:", err);
            setFeedback({message: t('errors.pronunciationError', "Could not pronounce the sentence."), type: "error"});
        });
    }
  };

  if (isLoading) return <p>{t('loading.fillGapsExercise', 'Loading fill the gaps exercise...')}</p>;
  if (error) return (
    <>
      <FeedbackDisplay message={error} type="error" />
      <ExerciseControls onNextExercise={handleNextRequest} onRandomize={handleNextRequest} config={{showNext: true, showRandomize: true}} />
    </>
  );
  if (!exerciseData && !isLoading) return (
    <>
      <FeedbackDisplay message={t('exercises.noData', "No exercise data available. Try different selections.")} type="info" />
      <ExerciseControls onNextExercise={handleNextRequest} onRandomize={handleNextRequest} config={{showNext: true, showRandomize: true}} />
    </>
  );


  const questionParts = exerciseData.questionPrompt.split('___');
  const questionDisplay = (
    <span style={{lineHeight: '2'}}> 
      {getLatinizedText(questionParts[0], language)}
      {questionParts.length > 1 && (
        <>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder={t('placeholders.typeHere', "type here")}
            disabled={isRevealed || isAttemptFinished} // Use isAttemptFinished
            style={{ margin: '0 5px', padding: '5px', fontSize: 'inherit', width: '120px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
            onKeyPress={(event) => {
                if (event.key === 'Enter' && !isRevealed && !isAttemptFinished) {
                  checkAnswer();
                }
            }}
          />
          {getLatinizedText(questionParts[1], language)}
        </>
      )}
    </span>
  );

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.fillTheGap', 'Fill in the Gap')}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '1.3rem', flexWrap: 'wrap' }}>
        <div>{questionDisplay}</div>
        {exerciseData.correctSentence && (
            <button 
                onClick={handlePronounceSentence} 
                title={t('tooltips.pronounceSentence',`Pronounce sentence`)}
                style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', marginLeft:'10px'}}
            >
            🔊
          </button>
        )}
      </div>
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      
      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAttemptFinished ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAttemptFinished ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAttemptFinished ? revealTheAnswer : undefined} // Can reveal even if attempt made but incorrect, if !isRevealed
        onNextExercise={handleNextRequest}
        onRandomize={handleNextRequest} // Randomize also calls onComplete via handleNextRequest
        isAnswerCorrect={isAttemptFinished && feedback.type === 'correct'}
        isRevealed={isRevealed}
        config={{ 
            showCheck: !isRevealed && !isAttemptFinished, 
            showHint: !isRevealed && !isAttemptFinished, 
            showReveal: !isRevealed && !isAttemptFinished, // Only show reveal if not already revealed OR successfully answered
            showNext: true,
            showRandomize: true, // Allow randomize to also mean "next item from host"
        }}
      />
    </div>
  );
};

export default FillGapsExercise;
