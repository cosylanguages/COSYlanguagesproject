// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
import LanguageHeader from '../../components/Common/LanguageHeader';
// Import the useFreestyle hook to access the freestyle mode context.
import { useFreestyle } from '../../contexts/FreestyleContext';
import { useBoosterPacks } from '../../hooks/useBoosterPacks';
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
  const { boosterPacks } = useBoosterPacks();
  // State for booster packs, selected pack, words for the word cloud, and session summary.
  const [selectedPack, setSelectedPack] = useState(null);
  const [words, setWords] = useState([]);
  const [summary, setSummary] = useState(null);

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
      {selectedLanguage && <LanguageHeader selectedLanguage={selectedLanguage} />}

      {!selectedLanguage ? (
        <div className="welcome-message">
          <h2>Welcome to Freestyle Mode!</h2>
          <p>Please select a language from the header to get started.</p>
        </div>
      ) : (
        <>
          <div className="practice-section">
            <h2>Practice with a Booster Pack</h2>
            <p>Select a booster pack to get a curated set of vocabulary and exercises.</p>
            <BoosterPacks boosterPacks={boosterPacks} onSelect={handlePackSelect} />
            {selectedPack && <WordCloud words={words} />}
            {summary && <SessionSummary summary={summary} />}
          </div>

          <div className="practice-section">
            <h2>Custom Practice</h2>
            <p>Create your own practice session by selecting a day and a category.</p>
            <div className="freestyle-controls-container">
              <DaySelectorFreestyle language={selectedLanguage} />
              {selectedDays.length > 0 && (
                <PracticeCategoryNav language={selectedLanguage} days={selectedDays} />
              )}
            </div>
            {selectedExercise && (
              <ExerciseHost
                language={selectedLanguage}
                days={selectedDays}
                subPracticeType={selectedExercise.exercise}
              />
            )}
          </div>
        </>
      )}

      <FreestyleProgress />
      <HelpPopupIsland />
    </div>
  );
};

export default FreestyleModePage;
