// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
// Import the useFreestyle hook to access the freestyle mode context.
import { useFreestyle } from '../../contexts/FreestyleContext';
// Import the components that make up the freestyle mode page.
import DaySelectorFreestyle from '../../components/Freestyle/DaySelectorFreestyle';
import PracticeCategoryNav from '../../components/Freestyle/PracticeCategoryNav';
import ExerciseHost from '../../components/Freestyle/ExerciseHost';
import HelpPopupIsland from '../../components/Freestyle/HelpPopupIsland';
import FreestyleProgress from '../../components/Freestyle/FreestyleProgress';
import BoosterPacks from '../../components/Freestyle/BoosterPacks';
import WordCloud from '../../components/Freestyle/WordCloud';
import SessionSummary from '../../components/Freestyle/SessionSummary';
// Import shared and page-specific CSS.
import '../../freestyle-shared.css';
import './FreestyleModePage.css';

/**
 * The main page for the "Freestyle" learning mode.
 * This page allows users to select a language, days of study, and practice categories.
 * It also displays booster packs, progress, and hosts the selected exercises.
 * @returns {JSX.Element} The FreestyleModePage component.
 */
const FreestyleModePage = () => {
  // Get state from the freestyle context.
  const { selectedLanguage, selectedDays, selectedExercise } = useFreestyle();
  // State for booster packs, selected pack, words for the word cloud, and session summary.
  const [boosterPacks, setBoosterPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [words, setWords] = useState([]);
  const [summary, setSummary] = useState(null);

  // Fetch the booster packs data when the component mounts.
  useEffect(() => {
    fetch('/data/booster_packs.json')
      .then(response => response.json())
      .then(data => {
        setBoosterPacks(data);
      });
  }, []);

  // When a booster pack is selected, extract the words for the word cloud and set the summary.
  useEffect(() => {
    if (selectedPack) {
      const allWords = selectedPack.content.vocabulary.map(v => v.term);
      setWords(allWords);
      // For now, we'll just use the pack description as the summary.
      setSummary({ description: selectedPack.description });
    }
  }, [selectedPack]);

  // Handle the selection of a booster pack.
  const handlePackSelect = (pack) => {
    setSelectedPack(pack);
  };

  // Logos et drapeaux comme dans CosyLanguageSelector
  const logos = {
    COSYarmenian: '/assets/icons/cosylanguages_logos/cosyarmenian.png',
    COSYbashkir: '/assets/icons/cosylanguages_logos/cosybachkir.png',
    COSYbreton: '/assets/icons/cosylanguages_logos/cosybreton.png',
    COSYenglish: '/assets/icons/cosylanguages_logos/cosyenglish.png',
    COSYfrench: '/assets/icons/cosylanguages_logos/cosyfrench.png',
    COSYgeorgian: '/assets/icons/cosylanguages_logos/cosygeorgian.png',
    COSYgerman: '/assets/icons/cosylanguages_logos/cosygerman.png',
    COSYgreek: '/assets/icons/cosylanguages_logos/cosygreek.png',
    COSYitalian: '/assets/icons/cosylanguages_logos/cosyitalian.png',
    COSYportuguese: '/assets/icons/cosylanguages_logos/cosyportuguese.png',
    COSYrussian: '/assets/icons/cosylanguages_logos/cosyrussian.png',
    COSYspanish: '/assets/icons/cosylanguages_logos/cosyspanish.png',
    COSYtatar: '/assets/icons/cosylanguages_logos/cosytatar.png',
  };
  const flags = {
    COSYbashkir: '/assets/flags/Flag_of_Bashkortostan.png',
    COSYbreton: '/assets/flags/Flag_of_Brittany.png',
    COSYtatar: '/assets/flags/Flag_of_Tatarstan.png',
  };
  // Pour le nom natif, on peut utiliser une traduction ou une constante si disponible
  const languageNames = {
    COSYarmenian: 'Հայերեն',
    COSYbashkir: 'Башҡорт',
    COSYbreton: 'Brezhoneg',
    COSYenglish: 'English',
    COSYfrench: 'Français',
    COSYgeorgian: 'ქართული',
    COSYgerman: 'Deutsch',
    COSYgreek: 'Ελληνικά',
    COSYitalian: 'Italiano',
    COSYportuguese: 'Português',
    COSYrussian: 'Русский',
    COSYspanish: 'Español',
    COSYtatar: 'Татар',
  };
  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">Freestyle Mode</h1>
      {/* Affichage du logo et du drapeau de la langue sélectionnée */}
      {selectedLanguage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
          {logos[selectedLanguage] && (
            <img src={logos[selectedLanguage]} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          {flags[selectedLanguage] && (
            <img src={flags[selectedLanguage]} alt="Drapeau" style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            {languageNames[selectedLanguage] || selectedLanguage}
          </span>
        </div>
      )}
      {/* Display the booster packs and the user's progress. */}
      <BoosterPacks boosterPacks={boosterPacks} onSelect={handlePackSelect} />
      <FreestyleProgress />
      {/* Container for the main freestyle mode controls. */}
      <div className="freestyle-controls-container">
        {/* Only show the day selector if a language is selected. */}
        {selectedLanguage && <DaySelectorFreestyle language={selectedLanguage} />}
        {/* Only show the practice category navigation if a language and days are selected. */}
        {selectedLanguage && selectedDays.length > 0 && (
          <PracticeCategoryNav language={selectedLanguage} days={selectedDays} />
        )}
      </div>
      {/* If an exercise is selected, render the exercise host. */}
      {selectedExercise && (
        <ExerciseHost
          language={selectedLanguage}
          days={selectedDays}
          subPracticeType={selectedExercise.exercise}
        />
      )}
      {/* If a pack is selected, show the word cloud. */}
      {selectedPack && <WordCloud words={words} />}
      {/* If there is a summary, show the session summary. */}
      {summary && <SessionSummary summary={summary} />}
      {/* The help popup island component. */}
      <HelpPopupIsland />
    </div>
  );
};

export default FreestyleModePage;
