import React, { useState } from 'react';
import ExerciseControls from '../../ExerciseControls';
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';

const DiaryPracticeExercise = ({ language, days, exerciseKey }) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setFeedback({ message: t('feedback.pleaseWriteMore', 'Please write a bit more for your diary entry.'), type: 'warning' });
    } else {
      setFeedback({ message: t('feedback.diaryEntrySubmitted', 'Diary entry submitted.'), type: 'success' });
      // In a real app, text would be submitted or saved.
    }
  };

  const handleNewExercise = () => {
    setText('');
    setFeedback({ message: '', type: '' });
    // No new data to fetch for this simple placeholder
    console.log("New Diary exercise requested (cleared text).");
  };
  
  const showHint = () => {
      setFeedback({ message: t('feedback.hintDiary', "Hint: Write about your feelings, events of the day, or future plans."), type: 'hint' });
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
      <h3>{t('titles.diaryPractice', "Diary Practice")}</h3>
      <p>{t('exercises.diaryPrompt', 'Write a diary entry about your day, your thoughts, or a specific event.')}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="12"
        placeholder={t('placeholders.typeYourDiaryEntryHere', 'Type your diary entry here...')}
        style={{ width: '95%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
      />
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <ExerciseControls
        onCheckAnswer={handleSubmit}
        checkButtonText={t('buttons.done', 'Done')}
        onShowHint={showHint}
        onNextExercise={handleNewExercise}
        config={{
          showCheck: true,
          showHint: true,
          showReveal: false, 
          showNext: true,
        }}
      />
    </div>
  );
};

export default DiaryPracticeExercise;
