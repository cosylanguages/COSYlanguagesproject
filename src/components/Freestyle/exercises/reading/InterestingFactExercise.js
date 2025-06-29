import React, { useState, useEffect, useCallback } from 'react';
import { loadReadingData } from '../../../../utils/exerciseDataService'; // Assuming facts are part of general reading data
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';

const InterestingFactExercise = ({ language, days, exerciseKey }) => {
  const [currentFact, setCurrentFact] = useState(null); // { title: string, text: string } or similar
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLatinized } = useLatinizationContext();
  const getLatinizedText = useLatinization;
  const { t } = useI18n();

  const fetchNewFact = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentFact(null);

    try {
      // Assuming facts are loaded via loadReadingData and are identified by a type or specific structure
      // Or, a new loadFactsData function could be created in exerciseDataService if facts are in separate files.
      // For now, let's assume loadReadingData can fetch an array of objects, some of which are facts.
      // This might require the data JSON to have a 'type: "fact"' field or similar.
      const { data: items, error: fetchError } = await loadReadingData(language, days);
      if (fetchError) {
        throw new Error(fetchError.message || fetchError.error || 'Failed to load reading data for facts.');
      }

      // Filter for items that are facts (example: check for a 'text' field and not 'paragraphs')
      const facts = items.filter(item => item && item.text && !item.paragraphs);

      if (facts && facts.length > 0) {
        const randomIndex = Math.floor(Math.random() * facts.length);
        setCurrentFact(facts[randomIndex]);
      } else {
        setError(t('exercises.noFacts', 'No interesting facts found for the selected criteria. Ensure reading data includes items with a "text" field.'));
      }
    } catch (err) {
      console.error("InterestingFactExercise - Error fetching fact:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, days, t]);

  useEffect(() => {
    if (language && days && days.length > 0) {
      fetchNewFact();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLangDay', "Please select a language and day(s)."));
    }
  }, [fetchNewFact, exerciseKey, language, days, t]);

  if (isLoading) return <p>{t('loading.readingExercise', 'Loading interesting fact...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;
  if (!currentFact && !isLoading) return <FeedbackDisplay message={t('exercises.noFactToDisplay', 'No fact to display. Try different selections.')} type="info" />;
  
  const factTitle = currentFact ? getLatinizedText(currentFact.title || "Interesting Fact", language) : "";
  const factText = currentFact ? getLatinizedText(currentFact.text, language) : "";

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '700px', margin: '0 auto' }}>
      {currentFact && (
        <>
          <h3 style={{ textAlign: 'center', marginBottom: '15px', ...(isLatinized && currentFact.title && currentFact.title !== factTitle && {fontStyle: 'italic'}) }}>
            {factTitle}
          </h3>
          <div style={{ textAlign: 'left', lineHeight: '1.7', fontSize: '1.1rem', padding: '10px', background: '#f9f9f9', borderRadius: '5px', ...(isLatinized && currentFact.text !== factText && {fontStyle: 'italic'}) }}>
            {factText}
          </div>
        </>
      )}
      <ExerciseControls
        onNextExercise={fetchNewFact}
        config={{
          showCheck: false,
          showHint: false, 
          showReveal: false,
          showNext: true,
        }}
      />
    </div>
  );
};

export default InterestingFactExercise;
