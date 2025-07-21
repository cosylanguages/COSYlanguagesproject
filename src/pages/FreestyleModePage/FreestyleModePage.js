import React from 'react';
import { useFreestyle } from '../../contexts/FreestyleContext';
import { useI18n } from '../../i18n/I18nContext';
import CosyLanguageSelector from '../../components/LanguageSelector/CosyLanguageSelector';
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
  const { selectedLanguage, selectedDays, selectedExercise, setSelectedLanguage } = useFreestyle();
  const { language, changeLanguage } = useI18n();

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setSelectedLanguage(newLanguage);
  };

  const words = [
    { text: 'un', size: 1.5 },
    { text: 'deux', size: 2 },
    { text: 'trois', size: 1.2 },
    { text: 'quatre', size: 2.5 },
    { text: 'cinq', size: 1.8 },
  ];

  const summary = {
    timeSpent: '20 minutes',
    wordsLearned: 5,
    xpGained: 50,
  };

  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">Freestyle Mode</h1>

      <BoosterPacks />
      <FreestyleProgress />

      <div className="freestyle-controls-container">
        <CosyLanguageSelector
          selectedLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
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
      <SessionSummary summary={summary} />
      <HelpPopupIsland />
    </div>
  );
};

export default FreestyleModePage;
