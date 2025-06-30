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
  const { t, allTranslations, language: i18nLanguage } = useI18n(); // Destructure allTranslations and i18nLanguage
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
  // const showSubPracticeMenu = currentMainCategory && showPracticeNav; // This line is not directly used in the new layout structure for conditional rendering of SubPracticeMenu

  return (
    <div className="freestyle-mode-container">
      <div className="main-menu-box">
        <h1 className="freestyle-mode-header">{t('mainHeading', 'COSYlanguages')}</h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <button
            onClick={handleStudyModeClick}
            className="study-mode-button"
            style={{
              background: '#007bff', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px #0001', cursor: 'pointer', border: 'none'
            }}
          >
            {t('studyModeButtonLabel', '🚀 Study Mode')}
          </button>
        </div>

        {showPinModal && (
          <PinModal
            onSubmit={handlePinSubmit}
            onClose={handlePinModalClose}
            error={pinError}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <LanguageSelectorFreestyle
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>

        {selectedLanguage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <DaySelectorFreestyle
              currentDays={selectedDays}
              onDaysChange={onDaysChange}
              language={selectedLanguage}
            />
          </div>
        )}

        {selectedLanguage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 20 }}>
            <ToggleLatinizationButton currentDisplayLanguage={selectedLanguage} />
          </div>
        )}

        {showPracticeNav && !currentMainCategory && (
          <PracticeCategoryNav
            activeCategory={null}
            onCategorySelect={onCategorySelect}
          />
        )}

        {showPracticeNav && currentMainCategory && (
          <>
            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => onCategorySelect(currentMainCategory)}
                style={{
                  padding: '10px 15px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: '1px solid #007bff',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                }}
              >
                { (allTranslations[i18nLanguage]?.mainCategory?.[currentMainCategory] || // Use i18nLanguage
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
      </div>

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
             currentMainCategory && !currentSubPractice && showPracticeNav ? t('selectSubPractice', "Please select a specific exercise.") : // Added showPracticeNav condition here
             ""
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FreestyleInterfaceView;
