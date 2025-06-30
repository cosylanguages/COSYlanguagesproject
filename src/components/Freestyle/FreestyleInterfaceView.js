import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelectorFreestyle from './LanguageSelectorFreestyle'; // This is actually LanguageSelector from components/LanguageSelector
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import SubPracticeMenu from './SubPracticeMenu';
import ExerciseHost from './ExerciseHost';
import ToggleLatinizationButton from '../Common/ToggleLatinizationButton';
import PinModal from '../Common/PinModal'; // Import PinModal
import '../../pages/FreestyleModePage/FreestyleModePage.css';

const FreestyleInterfaceView = ({
  selectedLanguage,
  selectedDays,
  currentMainCategory,
  currentSubPractice,
  exerciseKey,
  onLanguageChange,
  onDaysChange,
  onCategorySelect, // This prop will handle setting/unsetting currentMainCategory
  onSubPracticeSelect,
}) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState('');

  const STUDY_MODE_PIN = "1234";

  const handleStudyModeClick = () => {
    setShowPinModal(true);
    setPinError(''); // Clear previous errors
  };

  const handlePinSubmit = (pin) => {
    if (pin === STUDY_MODE_PIN) {
      sessionStorage.setItem('studyModeUnlocked', 'true'); // Persist verified state for AppRoutes
      setShowPinModal(false);
      navigate('/study');
    } else {
      setPinError(t('pinIncorrectMessage', 'Incorrect PIN. Access denied.'));
    }
  };

  const handlePinModalClose = () => {
    setShowPinModal(false);
    setPinError('');
  };

  // Logic for displaying PracticeCategoryNav and SubPracticeMenu
  // If a main category is selected, we show its sub-menu.
  // Clicking the active main category again (handled by onCategorySelect in parent) should set currentMainCategory to null.
  
  const showPracticeNav = selectedLanguage && selectedDays && selectedDays.length > 0;
  const showSubPracticeMenu = currentMainCategory && showPracticeNav;

  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">{t('mainHeading', 'COSYlanguages')}</h1>
      
      {/* Study Mode Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button 
          onClick={handleStudyModeClick}
          className="study-mode-button" // Add a class for styling
          style={{
            background: '#007bff', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px #0001', cursor: 'pointer', border: 'none'
          }}
        >
          {t('studyModeButtonLabel', '🚀 Study Mode')}
        </button>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <PinModal
          onSubmit={handlePinSubmit}
          onClose={handlePinModalClose}
          error={pinError}
        />
      )}

      {/* Language Selector + Day Selector dans la même carte centrale */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ marginBottom: 16 }}>
            {/* Sélecteur de langue centré */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LanguageSelectorFreestyle
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
          </div>
          {/* Sélecteur de jour */}
          {selectedLanguage && (
            <DaySelectorFreestyle
              currentDays={selectedDays}
              onDaysChange={onDaysChange}
              language={selectedLanguage}
            />
          )}
        </div>
        {selectedLanguage && (
          <div style={{ marginTop: 8 }}>
            <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
          </div>
        )}
      </div>

      {/* Practice Navigation & Sub-Practice Menu Logic */}
      {showPracticeNav && !currentMainCategory && (
        // Show all main categories if none is selected yet
        <PracticeCategoryNav
          activeCategory={null} // No category is active here
          onCategorySelect={onCategorySelect} 
        />
      )}

      {showPracticeNav && currentMainCategory && (
        // A main category is selected
        <>
          {/* Display the selected main category as a "back" button / title */}
          <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => onCategorySelect(currentMainCategory)} // Clicking it again triggers "go back" via parent logic
              style={{
                padding: '10px 15px',
                fontSize: '1.1rem', // Make it a bit more prominent
                cursor: 'pointer',
                backgroundColor: '#007bff', // Active color
                color: 'white',
                border: '1px solid #007bff',
                borderRadius: '5px',
                fontWeight: 'bold',
              }}
            >
              {/* Get label from translations.mainCategory */}
              { (allTranslations[language]?.mainCategory?.[currentMainCategory] || 
                 allTranslations.COSYenglish?.mainCategory?.[currentMainCategory] || 
                 currentMainCategory) }
            </button>
          </div>

          <SubPracticeMenu
            mainCategory={currentMainCategory}
            activeSubPractice={currentSubPractice}
            onSubPracticeSelect={onSubPracticeSelect}
          />
        </>
      )}
      
      {/* Exercise Host Area */}
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
            {!selectedLanguage ? t('selectLang', "Please select a language to begin.") :
             !(selectedDays && selectedDays.length > 0) ? t('selectDay', "Please select day(s).") :
             !currentMainCategory && showPracticeNav ? t('selectPractice', "Please select a practice category.") : // Show this only if practice nav was supposed to be shown
             currentMainCategory && !currentSubPractice ? t('selectSubPractice', "Please select a specific exercise.") : // If main category selected, but not sub-practice
             "" // Default empty or a more generic message if needed
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
