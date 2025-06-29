import React, { useState, useEffect, useCallback } from 'react';
import { loadSpeakingPromptsData } from '../../../../utils/exerciseDataService'; // Reusing speaking prompts
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { shuffleArray } from '../../../../utils/arrayUtils';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';

const WritingQuestionExercise = ({ language, days, exerciseKey }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const fetchQuestionsForWriting = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setWrittenAnswer('');
    setFeedback({ message: '', type: '' });

    try {
      const { data, error: fetchError } = await loadSpeakingPromptsData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load questions.');
      }
      if (data && data.length > 0) {
        setQuestions(shuffleArray(data));
      } else {
        setError(t('exercises.noWritingQuestions', 'No questions found for writing practice for the selected criteria.'));
      }
    } catch (err) {
      console.error("WritingQuestionExercise - Error fetching questions:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchQuestionsForWriting();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchQuestionsForWriting, exerciseKey, language, days, t]);

  const handleAnswerChange = (event) => {
    setWrittenAnswer(event.target.value);
    if (feedback.message) setFeedback({message: '', type: ''});
  };

  const handleSubmitAnswer = () => {
    if (!writtenAnswer.trim()) {
      setFeedback({ message: t('feedback.pleaseWriteAnswer', 'Please write an answer before submitting.'), type: 'warning' });
      return;
    }
    // In a real app, this might submit to a backend or local storage.
    // For now, just acknowledge submission.
    setFeedback({ message: t('feedback.answerSubmittedWriting', 'Answer submitted. Remember to check for grammar and clarity.'), type: 'success' });
    // Consider if the text area should be cleared or disabled after submission.
    // For now, it remains editable for self-review.
  };
  
  const currentQuestionText = questions[currentQuestionIndex] || "";
  const latinizedQuestion = getLatinizedText(currentQuestionText, language);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setWrittenAnswer('');
      setFeedback({ message: '', type: '' });
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setWrittenAnswer('');
      setFeedback({ message: '', type: '' });
    }
  };
  
  const showHint = () => {
     const questionForHint = questions[currentQuestionIndex] || "";
     setFeedback({ message: t('feedback.hintWritingQuestion', `Hint: Address all parts of the question. Structure your answer with an introduction, body, and conclusion if applicable. The question is: '${getLatinizedText(questionForHint, language)}'`, {question: getLatinizedText(questionForHint, language)}), type: 'hint'});
  };

  if (isLoading) return <p>{t('loading.writingExercise', 'Loading writing questions...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (questions.length === 0 && !isLoading) return <FeedbackDisplay message={t('exercises.noWritingQuestionsToDisplay', 'No questions to display for writing practice.')} type="info" />;

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{textAlign: 'center'}}>{t('titles.answerTheQuestionWriting', 'Answer the Question (Writing)')}</h3>
      <div style={{ 
          fontSize: '1.3em', margin: '20px 0', padding: '15px', 
          minHeight: '60px', backgroundColor: '#f9f9f9', 
          borderLeft: '4px solid #007bff', borderRadius: '4px',
          ...(isLatinized && currentQuestionText !== latinizedQuestion && {fontStyle: 'italic'}) 
        }}>
        {latinizedQuestion}
      </div>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0} style={{marginRight: '10px'}}>
          &lt; {t('buttons.previous', 'Previous')}
        </button>
        <span>{currentQuestionIndex + 1} / {questions.length}</span>
        <button onClick={goToNextQuestion} disabled={currentQuestionIndex === questions.length - 1} style={{marginLeft: '10px'}}>
          {t('buttons.next', 'Next')} &gt;
        </button>
      </div>

      <textarea 
        value={writtenAnswer}
        onChange={handleAnswerChange}
        rows="10"
        spellCheck="true"
        placeholder={t('placeholders.typeYourAnswerHere', 'Type your answer here...')}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em', boxSizing: 'border-box' }}
      />
      
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      
      <ExerciseControls
        onCheckAnswer={handleSubmitAnswer} // "Check" button will act as "Submit"
        onShowHint={showHint}
        onNextExercise={fetchQuestionsForWriting} // To get a new set of questions
        config={{
          showCheck: true, 
          checkButtonText: t('buttons.submitAnswer', 'Submit Answer'), // Custom text for check button
          showReveal: false, // No direct answer to reveal for this type
          showHint: true,
          showNext: true, // "Next Exercise" button to refresh all questions
        }}
      />
    </div>
  );
};

export default WritingQuestionExercise;
