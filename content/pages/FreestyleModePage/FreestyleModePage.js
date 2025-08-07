// Import necessary libraries and components.
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageHeader from '../../components/Common/LanguageHeader';
// Import the useFreestyle hook to access the freestyle mode context.
import { useFreestyle } from '../../contexts/FreestyleContext';
import { useAuth } from '../../contexts/AuthContext';
// Import the components that make up the freestyle mode page.
import HeroShowcase from '../../components/Freestyle/HeroShowcase';
import TryStudyModeButton from '../../components/Freestyle/TryStudyModeButton';
import ExerciseHost from '../../components/Freestyle/ExerciseHost';
import PracticeSelector from '../../components/Freestyle/PracticeSelector';
import HelpPopupIsland from '../../components/Freestyle/HelpPopupIsland';
import FreestyleProgress from '../../components/Freestyle/FreestyleProgress';
import BoosterPacks from '../../components/Freestyle/BoosterPacks';
import InteractiveDemoWidget from '../../components/Freestyle/InteractiveDemoWidget';
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
  const { t } = useI18n();
  // Get state from the freestyle context.
  const { selectedLanguage, selectedDays, selectedExercise, boosterPacks } = useFreestyle();
  const { currentUser } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

  React.useEffect(() => {
    if (selectedLanguage && selectedDays.length > 0 && selectedExercise) {
      setFeedbackMessage("Great! Now you can start the exercise.");
    } else if (selectedLanguage) {
      setFeedbackMessage("Now, select a day and a practice category to start learning!");
    } else {
      setFeedbackMessage('');
    }
  }, [selectedLanguage, selectedDays, selectedExercise]);

  return (
    <div className="freestyle-mode-container">
      <h1 className="freestyle-mode-header">{t('freestyle.title', 'Freestyle Mode')}</h1>
      <HeroShowcase />
      {selectedLanguage && <LanguageHeader selectedLanguage={selectedLanguage} />}

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

      {!selectedLanguage ? (
        <div className="welcome-message">
          <h2>{t('freestyle.welcome.heading', 'Welcome to Freestyle Mode!')}</h2>
          <p>{t('freestyle.welcome.message', 'Please select a language from the header to get started.')}</p>
          <InteractiveDemoWidget />
        </div>
      ) : (
        <div className="freestyle-content">
          <div className="freestyle-practice-selection">
            <div className={`practice-section ${!selectedLanguage ? 'disabled' : ''}`}>
              <h2>{t('freestyle.customPractice.title', 'Custom Practice')}</h2>
              <p>{t('freestyle.customPractice.description', 'Create your own practice session by selecting a day and a category.')}</p>
              <TryStudyModeButton />
              <div className="freestyle-controls-container">
                <PracticeSelector />
              </div>
            </div>
            <div className={`practice-section ${!selectedLanguage ? 'disabled' : ''}`}>
              <h2>{t('freestyle.boosterPacks.title', 'Practice with a Booster Pack')}</h2>
              <p>{t('freestyle.boosterPacks.description', 'Select a booster pack to get a curated set of vocabulary and exercises.')}</p>
              <BoosterPacks
                boosterPacks={boosterPacks.filter(p => !p.userId)}
                userBoosterPacks={boosterPacks.filter(p => p.userId === currentUser?.id)}
              />
            </div>
          </div>
          {selectedExercise && (
            <ExerciseHost
              language={selectedLanguage}
              days={selectedDays}
              subPracticeType={selectedExercise.exercise}
            />
          )}
        </div>
      )}

      <FreestyleProgress />
      <HelpPopupIsland />
    </div>
  );
};

export default FreestyleModePage;
