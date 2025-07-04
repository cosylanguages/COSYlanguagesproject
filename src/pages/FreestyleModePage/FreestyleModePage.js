import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import FreestyleInterfaceView from '../../components/Freestyle/FreestyleInterfaceView';
import './FreestyleModePage.css';
import { useI18n } from '../../i18n/I18nContext'; // Import useI18n

const FreestyleModePage = () => {
  const { language: selectedLanguage, changeLanguage, t } = useI18n(); // Use I18n context
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentMainCategory, setCurrentMainCategory] = useState(null);
  const [currentSubPractice, setCurrentSubPractice] = useState(null);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [toast, setToast] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isDaySelectionLocked, setIsDaySelectionLocked] = useState(false); // New state for latching
  const lockTimeoutRef = useRef(null); // Ref for timeout

  // The useEffect block for updating body class has been removed from here.
  // LanguageSelector.js is now solely responsible for this.

  // Fonction utilitaire pour afficher un toast temporaire
  const showToast = (message, duration = 2500) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  };

  const handleLanguageChange = (newLanguage) => { // Parameter name changed for clarity
    changeLanguage(newLanguage); // Use changeLanguage from context
    setCurrentMainCategory(null);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
    // Attempt to get the display name of the language for the toast
    const languageName = t(`language.${newLanguage}`, newLanguage.replace('COSY', '')); 
    showToast(t('freestyle.languageChangedToast', `Language changed: ${languageName}`, { languageName }));
  };

  const handleDaysChange = (newDays) => { 
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    if (newDays && newDays.length > 0) {
      // Valid selection
      setSelectedDays(newDays);
      setExerciseKey(prevKey => prevKey + 1);
      setIsDaySelectionLocked(true);
      lockTimeoutRef.current = setTimeout(() => {
        setIsDaySelectionLocked(false);
        lockTimeoutRef.current = null;
      }, 100); // Lock for 100ms
    } else {
      // Attempting to clear selection (newDays is empty or null)
      if (!isDaySelectionLocked) {
        const oldSelectedDays = selectedDays; // Capture state before update for comparison
        setSelectedDays([]); // Allow clear only if not locked
        if (oldSelectedDays.length > 0) { // Only change exerciseKey if selectedDays was not already empty
            setExerciseKey(prevKey => prevKey + 1);
        }
      }
      // If locked, this clear attempt is ignored.
    }
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  const handleCategorySelect = (category) => {
    setCurrentMainCategory(category);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
  };

  const handleSubPracticeSelect = (subPractice) => {
    setCurrentSubPractice(subPractice);
    setExerciseKey(prevKey => prevKey + 1);
    console.log(`Selected SubPractice: ${subPractice} for Category: ${currentMainCategory} with Lang: ${selectedLanguage} Days: ${Array.isArray(selectedDays) ? selectedDays.join(', ') : selectedDays}`);
  };

  return (
    <div className="freestyle-mode-root">
      <FreestyleInterfaceView
        selectedLanguage={selectedLanguage} 
        selectedDays={selectedDays}
        currentMainCategory={currentMainCategory}
        currentSubPractice={currentSubPractice}
        exerciseKey={exerciseKey}
        onLanguageChange={handleLanguageChange}
        onDaysChange={handleDaysChange}
        onCategorySelect={handleCategorySelect}
        onSubPracticeSelect={handleSubPracticeSelect}
      />
      {toast && <div className="cosy-toast">{toast}</div>}
      <button id="floating-help-btn" onClick={() => setShowHelp(h => !h)} title={t('freestyle.helpButtonTitle', 'Help')}>?</button>
      {showHelp && (
        <div className="floating-popup" style={{zIndex: 2000}}>
          <div className="popup-header">{t('freestyle.quickHelpHeader', 'Quick Help')}</div>
          <div className="popup-content">{t('freestyle.quickHelpContent', 'Select a language, then a day and an exercise to begin. Use the help button to show or hide this window.')}</div>
          <div className="popup-actions">
            <button className="btn btn-secondary" onClick={() => setShowHelp(false)}>{t('buttons.close', 'Close')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreestyleModePage;
