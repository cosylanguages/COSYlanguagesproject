import React from 'react';
import LanguageSelectorFreestyle from './LanguageSelectorFreestyle';
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import SubPracticeMenu from './SubPracticeMenu';
import ExerciseHost from './ExerciseHost';
import ToggleLatinizationButton from '../Common/ToggleLatinizationButton';
import '../../pages/FreestyleModePage/FreestyleModePage.css'; // Import the CSS file

const FreestyleInterfaceView = ({
  selectedLanguage,
  selectedDays, // Changed from selectedDay to selectedDays (array)
  currentMainCategory,
  currentSubPractice,
  exerciseKey,
  onLanguageChange,
  onDaysChange, // Changed from onDayChange
  onCategorySelect,
  onSubPracticeSelect,
}) => {
  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">COSYlanguages</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <a href="/study" style={{
          background: '#007bff', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px #0001', marginRight: 10
        }}>Study Mode</a>
      </div>

      <div className="freestyle-mode-selectors">
        <LanguageSelectorFreestyle
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
        {selectedLanguage && (
          <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
        )}
      </div>

      {selectedLanguage && (
        <DaySelectorFreestyle
          currentDays={selectedDays} // Pass selectedDays as currentDays
          onDaysChange={onDaysChange} // Pass onDaysChange callback
          language={selectedLanguage} // Pass selectedLanguage
        />
      )}

      {selectedLanguage && selectedDays && selectedDays.length > 0 && ( // Check if selectedDays has items
        <PracticeCategoryNav
          activeCategory={currentMainCategory}
          onCategorySelect={onCategorySelect}
        />
      )}

      {currentMainCategory && (
        <SubPracticeMenu
          mainCategory={currentMainCategory}
          activeSubPractice={currentSubPractice}
          onSubPracticeSelect={onSubPracticeSelect}
        />
      )}

      <div className="freestyle-mode-exercise-host">
        {selectedLanguage && selectedDays && selectedDays.length > 0 && currentMainCategory && currentSubPractice ? (
          <ExerciseHost
            subPracticeType={currentSubPractice}
            language={selectedLanguage}
            days={selectedDays.map(String)} // Ensure days are passed as array of strings
            exerciseKey={exerciseKey}
          />
        ) : (
          <p className="freestyle-mode-message">
            {!selectedLanguage ? "Please select a language to begin." :
             !(selectedDays && selectedDays.length > 0) ? "Please select day(s)." : // Updated condition
             !currentMainCategory ? "Please select a practice category." :
             "Please select a specific exercise."}
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
