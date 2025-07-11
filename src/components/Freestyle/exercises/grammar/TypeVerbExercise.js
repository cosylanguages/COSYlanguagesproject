import React, { useState, useEffect, useCallback } from 'react';
import { loadVerbGrammarData, loadVocabularyData } from '../../../../utils/exerciseDataService';
import { processVerbData, generateGrammarExerciseSentence, setGrammarGeneratorTranslations } from '../../../../utils/grammarSentenceGenerator'; 
// import { useLatinizationContext } from '../../../../contexts/LatinizationContext'; // Commented out: isLatinized from here is unused
import useLatinization from '../../../../hooks/useLatinization';
import { normalizeString } from '../../../../utils/stringUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { pronounceText } from '../../../../utils/speechUtils'; 
import { useI18n } from '../../../../i18n/I18nContext';

const TypeVerbExercise = ({ language, days, exerciseKey }) => {
  const [exerciseData, setExerciseData] = useState(null); 
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);

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
    setUserInput('');
    setIsRevealed(false);
    setIsAnsweredCorrectly(false);
    setExerciseData(null);

    try {
      const { data: rawVerbItems, error: verbError } = await loadVerbGrammarData(language, days);
      if (verbError) {
        throw new Error(verbError.message || verbError.error || 'Failed to load verb grammar data.');
      }

      const { data: vocabItems, error: vocabError } = await loadVocabularyData(language, days);
      if (vocabError) {
        console.warn("TypeVerbExercise: Failed to load vocabulary data for sentence objects. Proceeding without it, quality might be affected.");
      }
      
      if (rawVerbItems && rawVerbItems.length > 0) {
        const processedVerbItems = processVerbData(rawVerbItems, language);
        if (!processedVerbItems || processedVerbItems.length === 0) {
            setError(t('exercises.noProcessableVerbItems', 'No processable verb items found after initial load.'));
            setIsLoading(false);
            return;
        }

        const sentenceDetails = await generateGrammarExerciseSentence(language, days, processedVerbItems, vocabItems || []);
        
        if (sentenceDetails && sentenceDetails.questionPrompt && sentenceDetails.answer) {
          setExerciseData(sentenceDetails);
        } else {
          setError(t('exercises.generateVerbSentenceError','Could not generate a verb exercise sentence from processed data.'));
        }
      } else {
        setError(t('exercises.noVerbData', 'No verb grammar data found for the selected criteria.'));
      }
    } catch (err) {
      console.error("TypeVerbExercise - Error setting up:", err);
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
      setError(t('errors.selectLangDay',"Please select a language and day(s)."));
    }
  }, [setupNewExercise, exerciseKey, language, days, t]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (feedback.message) setFeedback({ message: '', type: '' });
  };

  const checkAnswer = () => {
    if (!exerciseData || isRevealed || isAnsweredCorrectly) return;
    
    const originalCorrectAnswerString = exerciseData.answer; // e.g., "réponse/reponse"
    const normalizedUserInput = normalizeString(userInput);

    let isCorrect = false;
    let matchedOriginalAnswer = ''; // The specific original answer part that matched

    const possibleOriginalAnswers = originalCorrectAnswerString.split('/');
    for (const originalAnswerPart of possibleOriginalAnswers) {
      const trimmedOriginalAnswerPart = originalAnswerPart.trim();
      if (normalizeString(trimmedOriginalAnswerPart) === normalizedUserInput) {
        isCorrect = true;
        matchedOriginalAnswer = trimmedOriginalAnswerPart;
        break;
      }
    }

    if (isCorrect) {
      setIsAnsweredCorrectly(true);
      if (userInput.trim() === matchedOriginalAnswer) {
        setFeedback({ message: t('feedback.correct', 'Correct!'), type: 'correct' });
      } else {
        const feedbackMessage = t('feedback.correctAnswerIs', `Correct! The answer is: ${getLatinizedText(matchedOriginalAnswer, language)}`, { correctAnswer: getLatinizedText(matchedOriginalAnswer, language) });
        setFeedback({ message: feedbackMessage, type: 'correct' });
      }
      setTimeout(() => {
        setupNewExercise();
      }, 1500);
    } else {
      const firstOriginalAnswerForDisplay = getLatinizedText(possibleOriginalAnswers[0].trim(), language);
      let fullCorrectSentenceForDisplay = exerciseData.correctSentence; // Fallback
      if (exerciseData.questionPrompt && exerciseData.questionPrompt.includes('___')) {
          fullCorrectSentenceForDisplay = exerciseData.questionPrompt.replace('___', possibleOriginalAnswers[0].trim());
      }
      setFeedback({ 
        message: t('feedback.incorrectVerb', `Incorrect. The correct answer is: ${firstOriginalAnswerForDisplay}. Full sentence: ${getLatinizedText(fullCorrectSentenceForDisplay, language)}`, { correctAnswer: firstOriginalAnswerForDisplay, correctSentence: getLatinizedText(fullCorrectSentenceForDisplay, language) }), 
        type: 'incorrect' 
      });
    }
  };

  const showHint = () => {
    if (!exerciseData || isRevealed || isAnsweredCorrectly) return;
    const answerForHint = exerciseData.answer.split('/')[0].trim();
    let hintLetter = '';
    if (answerForHint && answerForHint.length > 0) {
      hintLetter = answerForHint[0];
    }
    setFeedback({ message: t('feedback.hintVerb', `Hint: The answer starts with '${getLatinizedText(hintLetter, language)}'.`, { letter: getLatinizedText(hintLetter, language) }), type: 'hint' });
  };

  const revealTheAnswer = () => { 
    if (!exerciseData || isAnsweredCorrectly) return;
    const correctAnswer = exerciseData.answer.split('/')[0].trim(); // Show the first variant
    const latinizedCorrect = getLatinizedText(correctAnswer, language);
    
    let fullCorrectSentenceForDisplay = exerciseData.correctSentence; // Fallback
    if (exerciseData.questionPrompt && exerciseData.questionPrompt.includes('___')) {
        fullCorrectSentenceForDisplay = exerciseData.questionPrompt.replace('___', correctAnswer);
    }

    setUserInput(correctAnswer); 
    setFeedback({ 
      message: t('feedback.revealedVerb', `The correct answer is: ${latinizedCorrect}. Full sentence: ${getLatinizedText(fullCorrectSentenceForDisplay, language)}`, { correctAnswer: latinizedCorrect, correctSentence: getLatinizedText(fullCorrectSentenceForDisplay, language) }),
      type: 'info' 
    });
    setIsRevealed(true);
    setIsAnsweredCorrectly(true); 
    
    setTimeout(() => {
        setupNewExercise();
    }, 2500);
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

  if (isLoading) return <p>{t('loading.verbExercise', 'Loading type verb exercise...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!exerciseData && !isLoading) return <FeedbackDisplay message={t('exercises.noVerbExerciseData', "No verb exercise data available. Try different selections.")} type="info" />;

  const questionParts = exerciseData.questionPrompt.split('___');
  const questionDisplay = (
    <span>
      {getLatinizedText(questionParts[0], language)}
      {questionParts.length > 1 && (
        <>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder={t('placeholders.typeVerbForm', "verb form")}
            disabled={isRevealed || isAnsweredCorrectly}
            style={{ margin: '0 5px', padding: '5px', fontSize: 'inherit', width: '120px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
            onKeyPress={(event) => {
                if (event.key === 'Enter' && !isRevealed && !isAnsweredCorrectly) {
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
      <h3>{t('titles.completeSentenceVerb', 'Complete the Sentence (Verb)')}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', fontSize: '1.3rem', lineHeight: '1.8', flexWrap: 'wrap' }}>
        <div style={{textAlign: 'center'}}>{questionDisplay}</div>
        {exerciseData.correctSentence && (
            <button 
                onClick={handlePronounceSentence} 
                title={t('tooltips.pronounceSentence',`Pronounce sentence`)}
                className="action-button" 
                style={{marginLeft:'10px'}}
            >
            🔊
          </button>
        )}
      </div>
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />
      
      <ExerciseControls
        onCheckAnswer={!isRevealed && !isAnsweredCorrectly && exerciseData ? checkAnswer : undefined}
        onShowHint={!isRevealed && !isAnsweredCorrectly && exerciseData ? showHint : undefined}
        onRevealAnswer={!isRevealed && !isAnsweredCorrectly && exerciseData ? revealTheAnswer : undefined}
        onRandomize={setupNewExercise}
        onNextExercise={setupNewExercise}
        isAnswerCorrect={isAnsweredCorrectly}
        isRevealed={isRevealed}
        config={{ 
            showCheck: !!exerciseData && !isAnsweredCorrectly && !isRevealed, 
            showHint: !!exerciseData && !isAnsweredCorrectly && !isRevealed, 
            showReveal: !!exerciseData && !isAnsweredCorrectly && !isRevealed,
            showRandomize: true,
            showNext: true,
        }}
      />
    </div>
  );
};

export default TypeVerbExercise;
