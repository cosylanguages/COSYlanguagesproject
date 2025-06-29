import React, { useState } from 'react';
import ExerciseControls from '../../ExerciseControls';
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';

const OriginalStorytellingExercise = ({ onNext }) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setFeedback({ message: t('feedback.pleaseWriteMore', 'Please write a bit more for your story.'), type: 'warning' });
    } else {
      setFeedback({ message: t('feedback.storySubmitted', 'Great! Story submitted.'), type: 'success' });
      // In a real app, text would be submitted or saved.
    }
  };
  
  const handleNextRequest = () => {
      setText('');
      setFeedback({ message: '', type: '' });
      if(onNext) onNext(); // This will be called by the parent StorytellingExercise router
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
      <h4>{t('titles.originalStorytelling', "Original Storytelling")}</h4>
      <p>{t('exercises.originalStoryPrompt', 'Write any story you like. Be creative!')}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="12"
        placeholder={t('placeholders.typeYourStoryHere', 'Type your story here...')}
        style={{ width: '95%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
      />
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <ExerciseControls
        onCheckAnswer={handleSubmit}
        checkButtonText={t('buttons.done', 'Done')}
        onNextExercise={handleNextRequest} // Propagates to parent for changing story type
        config={{
          showCheck: true,
          showHint: false, // No specific hint for freeform story
          showReveal: false,
          showNext: true,
        }}
      />
    </div>
  );
};

export default OriginalStorytellingExercise;
