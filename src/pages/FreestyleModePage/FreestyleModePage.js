import React, { useState, useEffect, useRef, useCallback } from 'react';
import FreestyleInterfaceView from '../../components/Freestyle/FreestyleInterfaceView';
import './FreestyleModePage.css';
import { useI18n } from '../../i18n/I18nContext';
import { 
    getInitialMenuState, 
    handleMenuSelection, 
    isMenuItemVisible, 
    allMenuItemsConfig 
} from '../../utils/menuNavigationLogic';

const FreestyleModePage = () => {
  const { language: i18nLanguage, changeLanguage, t } = useI18n(); 
  
  const [selectedLanguage, setSelectedLanguage] = useState(i18nLanguage); 
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentMainCategoryKey, setCurrentMainCategoryKey] = useState(null); 
  const [currentSubPracticeKey, setCurrentSubPracticeKey] = useState(null);   
  
  const [exerciseKey, setExerciseKey] = useState(0); 
  const [toast, setToast] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const [activePath, setActivePath] = useState(getInitialMenuState().activePath);

  useEffect(() => {
    // Sync local selectedLanguage with i18n language context if it changes externally
    if (i18nLanguage !== selectedLanguage) {
        setSelectedLanguage(i18nLanguage);
        // Reset menu path if language changes from global context
        setActivePath([]); 
        setSelectedDays([]);
        setCurrentMainCategoryKey(null);
        setCurrentSubPracticeKey(null);
        setExerciseKey(prev => prev + 1);
    }
  }, [i18nLanguage, selectedLanguage]);

  const showToast = (message, duration = 2500) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  };

  const onMenuSelect = useCallback((clickedItemKey, payload) => {
    console.log("[FreestyleModePage] onMenuSelect:", clickedItemKey, "current activePath:", activePath, "payload:", payload);

    setActivePath(prevActivePath => {
        const newMenuState = handleMenuSelection(prevActivePath, clickedItemKey, allMenuItemsConfig);
        const newPath = newMenuState.activePath;

        let newSelectedDays = selectedDays;
        // If confirming days, update selectedDays from payload
        if (clickedItemKey === 'day_confirm_action' && payload && Array.isArray(payload.days)) {
            newSelectedDays = payload.days;
            setSelectedDays(newSelectedDays); // Persist the confirmed days
        } else if (clickedItemKey !== 'day_single_input' && clickedItemKey !== 'day_range_input' && !newPath.includes('day_selection_stage')) {
            // If we navigate away from day selection stage without confirming, or reset, clear days
            // This condition might need refinement based on exact flow.
            // For now, day selection is primarily confirmed via 'day_confirm_action'.
        }


        let newMainCatKey = null;
        let newSubPracticeKey = null;

        const mainCatStageIndex = newPath.indexOf('main_practice_categories_stage');
        if (mainCatStageIndex !== -1 && newPath.length > mainCatStageIndex + 1) {
            const catKey = newPath[mainCatStageIndex + 1];
            if (allMenuItemsConfig[catKey]?.parent === 'main_practice_categories_stage') {
                newMainCatKey = catKey;
            }
        }
        
        if (newMainCatKey && newPath.length > mainCatStageIndex + 2) {
            const subKeyCandidate = newPath[mainCatStageIndex + 2];
            if (allMenuItemsConfig[subKeyCandidate]?.parent === newMainCatKey) {
                if (allMenuItemsConfig[subKeyCandidate]?.children && newPath.length > mainCatStageIndex + 3) {
                    const exerciseTriggerKey = newPath[mainCatStageIndex + 3];
                    if(allMenuItemsConfig[exerciseTriggerKey]?.parent === subKeyCandidate) {
                        newSubPracticeKey = exerciseTriggerKey;
                    }
                } else if (!allMenuItemsConfig[subKeyCandidate]?.children) {
                    newSubPracticeKey = subKeyCandidate;
                }
            }
        }
        
        // Update states if they have changed
        if (newMainCatKey !== currentMainCategoryKey) setCurrentMainCategoryKey(newMainCatKey);
        if (newSubPracticeKey !== currentSubPracticeKey) setCurrentSubPracticeKey(newSubPracticeKey);

        // Clear downstream selections if navigating up
        if (!newPath.includes('main_practice_categories_stage')) {
            setCurrentMainCategoryKey(null);
            setCurrentSubPracticeKey(null);
        } else if (newMainCatKey && !newPath.includes(newMainCatKey)) {
            setCurrentSubPracticeKey(null); 
        } else if (newMainCatKey && newSubPracticeKey && !newPath.includes(newSubPracticeKey)) {
            // This case might be tricky if subPracticeKey is an exercise leaf.
            // Generally, if the path shortens such that subPracticeKey's parent is no longer the leaf, it should clear.
        }
        
        if (prevActivePath.join('/') !== newPath.join('/')) {
             setExerciseKey(prev => prev + 1);
        }
        
        console.log("[FreestyleModePage] New State After Select:", {days: newSelectedDays, mainCat: newMainCatKey, subPractice: newSubPracticeKey, newPath});
        return newPath;
    });

  }, [activePath, selectedDays, currentMainCategoryKey, currentSubPracticeKey, allMenuItemsConfig]);


  const handleLanguageChangeWrapper = (newLanguage) => {
    if (selectedLanguage === newLanguage) return; // Avoid re-processing if language hasn't changed

    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage); 
    
    setSelectedDays([]);
    setCurrentMainCategoryKey(null);
    setCurrentSubPracticeKey(null);
    setExerciseKey(prevKey => prevKey + 1);

    // After language states are updated, set the menu path to day selection stage
    setActivePath(handleMenuSelection([], 'day_selection_stage', allMenuItemsConfig).activePath);
    
    const languageName = t(`language.${newLanguage}`, newLanguage.replace('COSY', '')); 
    showToast(t('freestyle.languageChangedToast', `Language changed: ${languageName}`, { languageName }));
  };

  const handleDaysChangeWrapper = (newDays) => {
    // This is called by DaySelectorFreestyle on every change to its internal day state.
    // It's for FreestyleModePage to be aware of the temporary selection.
    // The actual menu advancement happens when onMenuSelect is called with 'day_confirm_action'.
    setSelectedDays(newDays); 
    // No path change here directly. DaySelectorFreestyle will call onMenuSelect('day_confirm_action', {days: newDays}).
  };
  
  return (
    <div className="freestyle-mode-root">
      <FreestyleInterfaceView
        selectedLanguage={selectedLanguage} 
        selectedDays={selectedDays}
        currentMainCategoryKey={currentMainCategoryKey} 
        currentSubPracticeKey={currentSubPracticeKey}  
        exerciseKey={exerciseKey}
        
        activePath={activePath}
        onMenuSelect={onMenuSelect} 
        isMenuItemVisible={isMenuItemVisible} 
        allMenuItemsConfig={allMenuItemsConfig}

        onLanguageChange={handleLanguageChangeWrapper} 
        onDaysChange={handleDaysChangeWrapper} 
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
