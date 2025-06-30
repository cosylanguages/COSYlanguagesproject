import React, { useState, useEffect } from 'react';
import FreestyleInterfaceView from '../../components/Freestyle/FreestyleInterfaceView';
import './FreestyleModePage.css';

const FreestyleModePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('COSYenglish');
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

  // Ajoute ou met à jour la classe du body selon la langue sélectionnée
  useEffect(() => {
    // Nettoie toutes les classes de fond de langue
    const body = document.body;
    const classesToRemove = Array.from(body.classList).filter(cls => cls.endsWith('-bg') || cls === 'lang-bg');
    classesToRemove.forEach(cls => body.classList.remove(cls));
    if (selectedLanguage) {
      body.classList.add(`${selectedLanguage}-bg`);
      body.classList.add('lang-bg');
    }
    return () => {
      const classesToRemove = Array.from(body.classList).filter(cls => cls.endsWith('-bg') || cls === 'lang-bg');
      classesToRemove.forEach(cls => body.classList.remove(cls));
    };
  }, [selectedLanguage]);

  // Fonction utilitaire pour afficher un toast temporaire
  const showToast = (message, duration = 2500) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCurrentMainCategory(null);
    setCurrentSubPractice(null);
    setExerciseKey(prevKey => prevKey + 1);
    showToast(`Langue changée : ${language}`);
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
        Niveau : {stats.level} | XP : {stats.xp}/100 | 🔥 Série : {stats.streak}
        <button style={{marginLeft:8, fontSize:'1em'}} onClick={() => gainXp(100)} title="Simuler un level up">+XP</button>
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
      <button id="floating-help-btn" onClick={() => setShowHelp(h => !h)} title="Aide">?</button>
      {showHelp && (
        <div className="floating-popup" style={{zIndex: 2000}}>
          <div className="popup-header">Aide rapide</div>
          <div className="popup-content">Sélectionnez une langue, puis un jour et un exercice pour commencer. Utilisez le bouton d'aide pour afficher ou masquer cette fenêtre.</div>
          <div className="popup-actions">
            <button className="btn btn-secondary" onClick={() => setShowHelp(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreestyleModePage;
