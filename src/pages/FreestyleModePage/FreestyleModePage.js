import React, { useState } from 'react';
import FreestyleInterfaceView from '../../components/Freestyle/FreestyleInterfaceView';
// import './FreestyleModePage.css'; // We'll create this later

const FreestyleModePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMainCategory, setCurrentMainCategory] = useState(null);
  const [currentSubPractice, setCurrentSubPractice] = useState(null);
  const [exerciseKey, setExerciseKey] = useState(0);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentMainCategory(null);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
    setCurrentMainCategory(null);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
  };

  const handleCategorySelect = (category) => {
    setCurrentMainCategory(category);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
  };

  const handleSubPracticeSelect = (subPractice) => {
    setCurrentSubPractice(subPractice);
    setExerciseKey(prevKey => prevKey + 1);
    console.log(`Selected SubPractice: ${subPractice} for Category: ${currentMainCategory} with Lang: ${selectedLanguage} Day: ${selectedDay}`);
  };

  return (
    <FreestyleInterfaceView
      selectedLanguage={selectedLanguage}
      selectedDay={selectedDay}
      currentMainCategory={currentMainCategory}
      currentSubPractice={currentSubPractice}
      exerciseKey={exerciseKey}
      onLanguageChange={handleLanguageChange}
      onDayChange={handleDayChange}
      onCategorySelect={handleCategorySelect}
      onSubPracticeSelect={handleSubPracticeSelect}
    />
  );
};

export default FreestyleModePage;
