import React, { useState, useEffect, useCallback } from 'react';
import { loadReadingData } from '../../../../utils/exerciseDataService';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';
import DictionaryTool from '../../../StudyMode/StudentTools/DictionaryTool';

const StoryReadingExercise = ({ language, days, exerciseKey }) => {
  const [currentStory, setCurrentStory] = useState(null); // { title: string, paragraphs: string[] }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setIsDictionaryOpen(true);
  };

  const fetchNewStory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentStory(null);

    try {
      const { data: stories, error: fetchError } = await loadReadingData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load reading data.');
      }

      if (stories && stories.length > 0) {
        const randomIndex = Math.floor(Math.random() * stories.length);
        setCurrentStory(stories[randomIndex]);
      } else {
        setError(t('exercises.noStories', 'No stories found for the selected criteria.'));
      }
    } catch (err) {
      console.error("StoryReadingExercise - Error fetching story:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchNewStory();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchNewStory, exerciseKey, language, days, t]);

  if (isLoading) return <p>{t('loading.readingExercise', 'Loading story...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!currentStory && !isLoading) return <FeedbackDisplay message={t('exercises.noStoryToDisplay', 'No story to display. Try different selections.')} type="info" />;

  const storyTitle = currentStory ? getLatinizedText(currentStory.title, language) : "";

  const renderParagraph = (paragraph) => {
    const latinizedParagraph = getLatinizedText(paragraph, language);
    return latinizedParagraph.split(' ').map((word, i) => (
      <span key={i} onClick={() => handleWordClick(word)} style={{cursor: 'pointer'}}>
        {word}{' '}
      </span>
    ));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
      {isDictionaryOpen && (
        <DictionaryTool
          isOpen={isDictionaryOpen}
          onClose={() => setIsDictionaryOpen(false)}
          initialSearchTerm={selectedWord}
        />
      )}
      {currentStory && (
        <>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', ...(isLatinized && currentStory.title !== storyTitle && {fontStyle: 'italic'}) }}>
            {storyTitle}
          </h3>
          <div style={{ textAlign: 'left', lineHeight: '1.8', fontSize: '1.1rem' }}>
            {currentStory.paragraphs.map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '1rem', ...(isLatinized && paragraph !== getLatinizedText(paragraph, language) && {fontStyle: 'italic'}) }}>
                {renderParagraph(paragraph)}
              </p>
            ))}
          </div>
        </>
      )}
      <ExerciseControls
        onRandomize={fetchNewStory} // "Randomize" fetches a new story
        onNextExercise={fetchNewStory} // "Next Exercise" also fetches a new story
        // isAnswerCorrect and isRevealed are not relevant here, defaults to false in ExerciseControls
        config={{
          showCheck: false,
          showHint: false,
          showReveal: false,
          showRandomize: true, // Enable Randomize button
          showNext: true,
        }}
      />
    </div>
  );
};

export default StoryReadingExercise;
