import React, { useState, useEffect, useCallback } from 'react';
import { loadSpeakingPromptsData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { mapLanguageToSpeechCode } from '../../../../utils/speechUtils'; // For language mapping
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';
import { shuffleArray } from '../../../../utils/arrayUtils'; 

// TODO: Implement a proper useSpeechRecognition hook or service for STT
const mockStartSpeechRecognition = ({
  language,
  onStart,
  onResult,
  onError,
  onEnd
}) => {
  console.warn("Speech Recognition is mocked. Implement useSpeechRecognition hook.");
  onStart();
  setTimeout(() => {
    const mockTranscript = "This is a mocked transcript.";
    onResult(mockTranscript);
    onEnd();
  }, 2000);
};

const SpeakingQuestionExercise = ({ language, days, exerciseKey }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTranscript('');
    setFeedback({ message: '', type: '' });
    setIsRecording(false); // Ensure recording state is reset

    try {
      const { data, error: fetchError } = await loadSpeakingPromptsData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load speaking questions.');
      }
      if (data && data.length > 0) {
        setQuestions(shuffleArray(data)); 
      } else {
        setError(t('exercises.noSpeakingQuestions', 'No speaking questions found for the selected criteria.'));
      }
    } catch (err) {
      console.error("SpeakingQuestionExercise - Error fetching questions:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]); // shuffleArray is a pure function, not needed in deps if not changing

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchQuestions();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchQuestions, exerciseKey, language, days, t]);

  const handleRecord = () => {
    if (isRecording) {
      console.log("Stopping mocked recording (if applicable)");
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setTranscript('');
    setFeedback({ message: t('feedback.listening', 'Listening...'), type: 'info' });

    mockStartSpeechRecognition({
      language: mapLanguageToSpeechCode(language),
      onStart: () => console.log("Mocked STT started"),
      onResult: (text) => {
        setTranscript(text);
        if (text.trim().length > 0) {
            setFeedback({ message: t('feedback.answerRecorded', 'Answer recorded!'), type: 'success' });
        } else {
            setFeedback({ message: t('feedback.noSpeechDetectedShort', 'No speech detected.'), type: 'warning' });
        }
      },
      onError: (err) => {
        console.error("Mocked STT Error:", err);
        let errorMsg = t('errors.recognitionError', 'Error during speech recognition.');
        if (err.error === 'no-speech') errorMsg = t('errors.noSpeechDetailed', 'No speech was detected. You may need to speak louder or longer.');
        if (err.error === 'audio-capture') errorMsg = t('errors.micError', 'No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.');
        if (err.error === 'not-allowed') errorMsg = t('errors.micPermission', 'Permission to use microphone was denied.');
        setFeedback({ message: errorMsg, type: 'error' });
        setIsRecording(false);
      },
      onEnd: () => {
        setIsRecording(false);
        console.log("Mocked STT ended");
      }
    });
  };
  
  const currentQuestionText = questions[currentQuestionIndex] || "";
  const latinizedQuestion = getLatinizedText(currentQuestionText, language);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
      setFeedback({ message: '', type: '' });
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTranscript('');
      setFeedback({ message: '', type: '' });
    }
  };
  
  const showHint = () => {
    setFeedback({ message: t('feedback.hintSpeaking', 'Try to understand the question fully. Use relevant vocabulary and aim for a complete sentence.'), type: 'hint'});
  };

  if (isLoading) return <p>{t('loading.speakingExercise', 'Loading speaking questions...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (questions.length === 0 && !isLoading) return <FeedbackDisplay message={t('exercises.noSpeakingQuestions', 'No speaking questions available.')} type="info" />;

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.answerTheQuestionSpeaking', 'Answer the Question (Speaking)')}</h3>
      <div style={{ fontSize: '1.5rem', margin: '20px 0', minHeight: '50px', ...(isLatinized && currentQuestionText !== latinizedQuestion && {fontStyle: 'italic'}) }}>
        {latinizedQuestion}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0}>
          &lt; {t('buttons.previous', 'Previous')}
        </button>
        <span style={{ margin: '0 10px' }}>{currentQuestionIndex + 1} / {questions.length}</span>
        <button onClick={goToNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          {t('buttons.next', 'Next')} &gt;
        </button>
      </div>

      <button onClick={handleRecord} disabled={isLoading} 
        style={{ fontSize: '2.5rem', padding: '10px 20px', marginBottom: '15px', lineHeight: 1, cursor: 'pointer', backgroundColor: isRecording ? '#dc3545' : '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {isRecording ? t('buttons.stopRecording', 'Stop') : '🎤'}
      </button>
      
      {transcript && <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', background: '#f9f9f9' }}><strong>{t('labels.yourAnswer', 'Your answer')}:</strong> {transcript}</div>}
      <FeedbackDisplay message={feedback.message} type={feedback.type} />

      <ExerciseControls
        onShowHint={showHint}
        onRandomize={fetchQuestions} // Randomize gets a new set of questions
        onNextExercise={fetchQuestions} // Next Exercise also gets a new set of questions
        // isAnswerCorrect and isRevealed are not typically used in this exercise type for controls
        config={{
          showCheck: false, 
          showReveal: false, 
          showHint: true,
          showRandomize: true, // Allow fetching a new set of questions
          showNext: true, 
        }}
      />
    </div>
  );
};

export default SpeakingQuestionExercise;
