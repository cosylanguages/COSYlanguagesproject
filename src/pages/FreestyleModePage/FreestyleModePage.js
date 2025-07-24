import React, { useState, useEffect } from 'react';
import { useFreestyle } from '../../contexts/FreestyleContext';
import LanguageSelectorFreestyle from '../../components/Freestyle/LanguageSelectorFreestyle';
import DaySelectorFreestyle from '../../components/Freestyle/DaySelectorFreestyle';
import PracticeCategoryNav from '../../components/Freestyle/PracticeCategoryNav';
import ExerciseHost from '../../components/Freestyle/ExerciseHost';
import HelpPopupIsland from '../../components/Freestyle/HelpPopupIsland';
import FreestyleProgress from '../../components/Freestyle/FreestyleProgress';
import BoosterPacks from '../../components/Freestyle/BoosterPacks';
import WordCloud from '../../components/Freestyle/WordCloud';
import SessionSummary from '../../components/Freestyle/SessionSummary';
import '../../freestyle-shared.css';
import './FreestyleModePage.css';

const FreestyleModePage = () => {
  const { selectedLanguage, selectedDays, selectedExercise } = useFreestyle();
  const [words, setWords] = useState([]);

  useEffect(() => {
    if (selectedLanguage) {
      fetch(`/api/words?language=${selectedLanguage}`)
        .then(response => response.json())
        .then(data => setWords(data));
    }
  }, [selectedLanguage]);

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('/api/summary')
      .then(response => response.json())
      .then(data => setSummary(data));
  }, []);

  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">Freestyle Mode</h1>

      <BoosterPacks />
      <FreestyleProgress />

      <div className="freestyle-controls-container">
        <LanguageSelectorFreestyle />
        {selectedLanguage && <DaySelectorFreestyle language={selectedLanguage} />}
        {selectedLanguage && selectedDays.length > 0 && (
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

      <WordCloud words={words} />
      {summary && <SessionSummary summary={summary} />}
      <HelpPopupIsland />
    </div>
  );
};

export default FreestyleModePage;
