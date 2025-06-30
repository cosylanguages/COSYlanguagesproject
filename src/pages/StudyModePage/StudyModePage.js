import React, { useState, useEffect } from 'react';
import FreestyleInterfaceView from '../../components/Freestyle/FreestyleInterfaceView';
// import './FreestyleModePage.css'; // We'll create this later

const FreestyleModePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]); // State now holds an array
  const [currentMainCategory, setCurrentMainCategory] = useState(null);
  const [currentSubPractice, setCurrentSubPractice] = useState(null);
  const [exerciseKey, setExerciseKey] = useState(0);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentMainCategory(null);
    setCurrentSubPractice(null);
    // setSelectedDays([]); // Also reset days when language changes? Optional.
    setExerciseKey(prevKey => prevKey + 1);
  };

  // Renamed from handleDayChange, now expects an array
  const handleDaysChange = (daysArray) => { 
    setSelectedDays(daysArray);
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
    // console.log(`Selected SubPractice: ${subPractice} for Category: ${currentMainCategory} with Lang: ${selectedLanguage} Days: ${selectedDays.join(', ')}`);
  };

  // Ajoute ou met à jour la classe du body selon la langue sélectionnée
  useEffect(() => {
    if (selectedLanguage) {
      document.body.className = `flag-${selectedLanguage}`;
    } else {
      document.body.className = '';
    }
    // Nettoyage lors du démontage
    return () => { document.body.className = ''; };
  }, [selectedLanguage]);

  return (
    <FreestyleInterfaceView
      selectedLanguage={selectedLanguage}
      selectedDays={selectedDays} // Pass selectedDays array
      currentMainCategory={currentMainCategory}
      currentSubPractice={currentSubPractice}
      exerciseKey={exerciseKey}
      onLanguageChange={handleLanguageChange}
      onDaysChange={handleDaysChange} // Pass handleDaysChange callback
      onCategorySelect={handleCategorySelect}
      onSubPracticeSelect={handleSubPracticeSelect}
    />
  );
};

export default FreestyleModePage;
