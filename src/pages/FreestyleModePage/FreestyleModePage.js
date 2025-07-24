// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
// Import the useFreestyle hook to access the freestyle mode context.
import { useFreestyle } from '../../contexts/FreestyleContext';
// Import the components that make up the freestyle mode page.
import LanguageSelectorFreestyle from '../../components/Freestyle/LanguageSelectorFreestyle';
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

  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">Freestyle Mode</h1>

      {/* Display the booster packs and the user's progress. */}
      <BoosterPacks boosterPacks={boosterPacks} onSelect={handlePackSelect} />
      <FreestyleProgress />

      {/* Container for the main freestyle mode controls. */}
      <div className="freestyle-controls-container">
        <LanguageSelectorFreestyle />
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
