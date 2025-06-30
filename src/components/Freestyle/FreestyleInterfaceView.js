import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelectorFreestyle from './LanguageSelectorFreestyle';
import DaySelectorFreestyle from './DaySelectorFreestyle';
import PracticeCategoryNav from './PracticeCategoryNav';
import SubPracticeMenu from './SubPracticeMenu';
import ExerciseHost from './ExerciseHost';
import ToggleLatinizationButton from '../Common/ToggleLatinizationButton';
import PinModal from '../Common/PinModal';
import '../../pages/FreestyleModePage/FreestyleModePage.css';

const FreestyleInterfaceView = ({
  selectedLanguage,
  selectedDays,
  currentMainCategory,
  currentSubPractice,
  exerciseKey,
  onLanguageChange,
  onDaysChange,
  onCategorySelect,
  onSubPracticeSelect,
}) => {
  const { t, allTranslations, language: i18nLanguage } = useI18n();
  const navigate = useNavigate();

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState('');

  const STUDY_MODE_PIN = "1234";

  const handleStudyModeClick = () => {
    setShowPinModal(true);
    setPinError('');
  };

  const handlePinSubmit = (pin) => {
    if (pin === STUDY_MODE_PIN) {
      sessionStorage.setItem('studyModeUnlocked', 'true');
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

  const showPracticeNav = selectedLanguage && selectedDays && selectedDays.length > 0;

  return (
    <div className="freestyle-mode-container">
      <div className="main-menu-box">
        {/* Site Name/Heading is already a direct child and will be centered by main-menu-box styles */}
        <h1 className="freestyle-mode-header">{t('mainHeading', 'COSYlanguages')}</h1>

        {/* Study Mode Button - will be centered by main-menu-box styles */}
        <button
          onClick={handleStudyModeClick}
          className="study-mode-button" // Style from CSS
        >
          {t('studyModeButtonLabel', '🚀 Study Mode')}
        </button>

        {/* PIN Modal (conditionally rendered, does not affect layout flow significantly) */}
        {showPinModal && (
          <PinModal
            onSubmit={handlePinSubmit}
            onClose={handlePinModalClose}
            error={pinError}
          />
        )}

        {/* Language Selector */}
        <div className="selector-container">
          <LanguageSelectorFreestyle
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>

        {/* Day Selector (includes "From" and "To") */}
        {selectedLanguage && (
          <div className="selector-container">
            <DaySelectorFreestyle
              currentDays={selectedDays}
              onDaysChange={onDaysChange}
              language={selectedLanguage}
            />
          </div>
        )}
        
        {/* Toggle Latinization Button - Placed after Day Selector for logical flow */}
        {selectedLanguage && (
            <div className="selector-container">
                 <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
            </div>
        )}

        {/* Practice Category Navigation OR Selected Category + SubPracticeMenu */}
        {showPracticeNav && (
          currentMainCategory ? (
            <>
              {/* Display selected main category (centered by main-menu-box) */}
              <div className="selector-container" style={{ marginBottom: '10px' }}> {/* Added margin for spacing */}
                <button
                  onClick={() => onCategorySelect(currentMainCategory)} // Allows re-clicking to possibly reset or just show it's active
                  style={{ // Inline styles kept for unique active category display, can be moved to CSS
                    padding: '10px 15px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    backgroundColor: '#007bff', 
                    color: 'white',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    width: '100%', // Ensure it takes width from selector-container
                    maxWidth: '380px' // Consistent with other selectors
                  }}
                >
                  {(allTranslations[i18nLanguage]?.mainCategory?.[currentMainCategory] ||
                    allTranslations.COSYenglish?.mainCategory?.[currentMainCategory] ||
                    currentMainCategory)}
                </button>
              </div>
              {/* SubPracticeMenu */}
              <div className="selector-container">
                <SubPracticeMenu
                  mainCategory={currentMainCategory}
                  activeSubPractice={currentSubPractice}
                  onSubPracticeSelect={onSubPracticeSelect}
                />
              </div>
            </>
          ) : (
            // PracticeCategoryNav
            <div className="selector-container">
              <PracticeCategoryNav
                activeCategory={null}
                onCategorySelect={onCategorySelect}
              />
            </div>
          )
        )}
      </div>

      {/* Exercise Host remains outside the main-menu-box for layout purposes */}
      <div className="freestyle-mode-exercise-host">
        {selectedLanguage && selectedDays && selectedDays.length > 0 && currentMainCategory && currentSubPractice ? (
          <ExerciseHost
            subPracticeType={currentSubPractice}
            language={selectedLanguage}
            days={selectedDays.map(String)}
            exerciseKey={exerciseKey}
          />
        ) : (
          <p className="freestyle-mode-message">
            {!selectedLanguage ? t('selectLang', "Please select a language to begin.") :
             !(selectedDays && selectedDays.length > 0) ? t('selectDay', "Please select day(s).") :
             !currentMainCategory && showPracticeNav ? t('selectPractice', "Please select a practice category.") :
             currentMainCategory && !currentSubPractice && showPracticeNav ? t('selectSubPractice', "Please select a specific exercise.") :
             ""
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
