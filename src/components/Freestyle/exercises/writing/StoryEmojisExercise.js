import React, { useState, useEffect, useCallback } from 'react';
import ExerciseControls from '../../ExerciseControls';
import FeedbackDisplay from '../../FeedbackDisplay';
import { useI18n } from '../../../../i18n/I18nContext';
import { shuffleArray } from '../../../../utils/arrayUtils';

const storyEmojiPool = [
    '😀', '😂', '😊', '😍', '🤔', '😲', '😱', '🔥', '🎉', '🎈', 
    '⭐', '❤️', '💔', '👍', '👎', '🙌', '🙏', '💀', '👻', '👽', 
    '🤖', '👑', '💎', '💰', '📚', '✏️', '🌍', '🌙', '☀️', '🌳', 
    '🍎', '🍌', '🍕', '🚗', '✈️', '🏠', '⏰', '🔑', '🎁', '✉️'
];

const StoryEmojisExercise = ({ onNext }) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [currentEmojis, setCurrentEmojis] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const selectNewEmojis = useCallback(() => {
    setCurrentEmojis(shuffleArray(storyEmojiPool).slice(0, 5));
    setText('');
    setFeedback({ message: '', type: ''});
  }, []);

  useEffect(() => {
    selectNewEmojis();
  }, [selectNewEmojis]);

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setFeedback({ message: t('feedback.pleaseWriteMore', 'Please write a bit more for your story.'), type: 'warning' });
    } else {
      setFeedback({ message: t('feedback.storySubmitted', 'Great! Story submitted.'), type: 'success' });
    }
  };
  
  const handleNextRequest = () => {
      selectNewEmojis(); // Get new emojis for this specific exercise type
      if(onNext) onNext(); // Also inform parent if it wants to switch story type
  }
  
  const showHint = () => {
      setFeedback({ message: t('feedback.hintEmojiStory', "Hint: Try to incorporate all emojis into your narrative in a creative way!"), type: 'hint' });
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
      <h4>{t('titles.emojiStory', "Emoji Story")}</h4>
      <p>{t('exercises.emojiStoryPrompt', "Write a short story based on these emojis:")}</p>
      <div style={{ fontSize: '2.5em', margin: '20px 0', textAlign: 'center' }}>
        {currentEmojis.join(' ')}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        placeholder={t('placeholders.typeYourStoryHere', 'Type your story here...')}
        style={{ width: '95%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
      />
      <FeedbackDisplay message={feedback.message} type={feedback.type} />
      <ExerciseControls
        onCheckAnswer={handleSubmit}
        checkButtonText={t('buttons.done', 'Done')}
        onShowHint={showHint}
        onNextExercise={handleNextRequest}
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

export default StoryEmojisExercise;
