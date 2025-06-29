import React, { useState, useEffect, useCallback } from 'react';
import OriginalStorytellingExercise from './OriginalStorytellingExercise';
import StoryEmojisExercise from './StoryEmojisExercise';
import WhatHappensNextExercise from './WhatHappensNextExercise';
import WhatHappenedBeforeExercise from './WhatHappenedBeforeExercise';
import { useI18n } from '../../../../i18n/I18nContext';

const storytellingComponents = [
  OriginalStorytellingExercise,
  StoryEmojisExercise,
  WhatHappensNextExercise,
  WhatHappenedBeforeExercise,
];

const StorytellingExercise = ({ language, days, exerciseKey }) => {
  const [CurrentStoryType, setCurrentStoryType] = useState(null);
  const { t } = useI18n();

  const selectRandomStoryType = useCallback(() => {
    const RandomComponent = storytellingComponents[Math.floor(Math.random() * storytellingComponents.length)];
    setCurrentStoryType(() => RandomComponent); // Ensure it's a functional update for reliability
  }, []);

  // Select a random story type when the component mounts or exerciseKey changes
  useEffect(() => {
    selectRandomStoryType();
  }, [selectRandomStoryType, exerciseKey]);

  // Handler to be passed to sub-components, allowing them to trigger a change in the parent
  const handleNextStoryType = () => {
    selectRandomStoryType();
  };

  if (!CurrentStoryType) {
    return <p>{t('loading.storytelling', 'Loading storytelling exercise...')}</p>; 
  }

  // Pass necessary props, including the onNext handler
  return <CurrentStoryType language={language} days={days} onNext={handleNextStoryType} />;
};

export default StorytellingExercise;
