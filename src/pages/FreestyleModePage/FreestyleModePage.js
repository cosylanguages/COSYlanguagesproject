import React, { useState } from 'react';
import FreestyleInterfaceView from '../../components/Freestyle/FreestyleInterfaceView';
// import './FreestyleModePage.css'; // We'll create this later

const FreestyleModePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]); // Changed selectedDay to selectedDays, initialized to []
  const [currentMainCategory, setCurrentMainCategory] = useState(null);
  const [currentSubPractice, setCurrentSubPractice] = useState(null);
  const [exerciseKey, setExerciseKey] = useState(0);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentMainCategory(null);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
  };

  const handleDaysChange = (days) => { // Renamed handleDayChange to handleDaysChange
    setSelectedDays(days); // Changed setSelectedDay to setSelectedDays
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
    console.log(`Selected SubPractice: ${subPractice} for Category: ${currentMainCategory} with Lang: ${selectedLanguage} Days: ${selectedDays}`); // Updated log
  };

  return (
    <FreestyleInterfaceView
      selectedLanguage={selectedLanguage}
      selectedDays={selectedDays} // Changed selectedDay to selectedDays
      currentMainCategory={currentMainCategory}
      currentSubPractice={currentSubPractice}
      exerciseKey={exerciseKey}
      onLanguageChange={handleLanguageChange}
      onDaysChange={handleDaysChange} // Changed onDayChange to onDaysChange
      onCategorySelect={handleCategorySelect}
      onSubPracticeSelect={handleSubPracticeSelect}
    />
  );
};

export default FreestyleModePage;
