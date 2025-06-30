import React, { useState, useEffect } from 'react';
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
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    streak: 0
  });
  const [levelUp, setLevelUp] = useState(false);

  // Réinitialise la sélection des jours à chaque chargement de la page
  useEffect(() => {
    setSelectedDays([]);
  }, []);

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

  const handleDaysChange = (days) => { 
    setSelectedDays(days); 
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
    console.log(`Selected SubPractice: ${subPractice} for Category: ${currentMainCategory} with Lang: ${selectedLanguage} Days: ${Array.isArray(selectedDays) ? selectedDays.join(', ') : selectedDays}`);
  };

  // Exemple : simuler un gain d'XP et un level up
  const gainXp = (amount = 10) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      if (newXp >= 100) {
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 1200);
        return { ...prev, level: prev.level + 1, xp: newXp - 100, streak: prev.streak + 1 };
      }
      return { ...prev, xp: newXp };
    });
  };

  // Déclenche un gain d'XP à chaque changement de sous-exercice (pour la démo)
  useEffect(() => {
    if (currentSubPractice) gainXp(25);
    // eslint-disable-next-line
  }, [currentSubPractice]);

  return (
    <div className="freestyle-mode-root">
      <div id="cosy-gamestats" className={levelUp ? 'levelup' : ''}>
        {t('freestyle.level', 'Level')}: {stats.level} | XP: {stats.xp}/100 | 🔥 {t('freestyle.streak', 'Streak')}: {stats.streak}
        <button style={{marginLeft:8, fontSize:'1em'}} onClick={() => gainXp(100)} title={t('freestyle.simulateLevelUpTooltip', "Simulate level up")}>+XP</button>
      </div>
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
