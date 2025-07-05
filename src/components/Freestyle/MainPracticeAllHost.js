// @ts-check
import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import ExerciseControls from './ExerciseControls';

// Import the sub-host components this MainPracticeAllHost will manage
import RandomWordPracticeHost from './exercises/vocabulary/RandomWordPracticeHost';
import RandomImagePracticeHost from './exercises/vocabulary/RandomImagePracticeHost';
import ListeningPracticeHost from './exercises/vocabulary/ListeningPracticeHost';
import PracticeAllVocabHost from './exercises/vocabulary/PracticeAllVocabHost'; 
// Future: Import GrammarPracticeHost, ReadingPracticeHost etc.

const managedSubHosts = [
  { 
    key: 'random_word_session', 
    Component: RandomWordPracticeHost, 
    nameKey: 'practiceHosts.randomWordSession', 
    defaultName: 'Random Word Session' 
  },
  { 
    key: 'random_image_session', 
    Component: RandomImagePracticeHost, 
    nameKey: 'practiceHosts.randomImageSession', 
    defaultName: 'Random Image Session' 
  },
  { 
    key: 'listening_session', 
    Component: ListeningPracticeHost, 
    nameKey: 'practiceHosts.listeningSession', 
    defaultName: 'Listening Session' 
  },
  { 
    key: 'mixed_vocab_session', // PracticeAllVocabHost focuses on all individual vocab exercises
    Component: PracticeAllVocabHost, 
    nameKey: 'practiceHosts.mixedVocabSession', 
    defaultName: 'Mixed Vocabulary Session' 
  },
  // Add other hosts like GrammarPracticeHost here when available
];

const MainPracticeAllHost = ({ language, days, exerciseKey: hostKey }) => {
  const { t, language: i18nLanguage } = useI18n();
  
  const [CurrentSubHost, setCurrentSubHost] = useState(null);
  const [currentSubHostInfo, setCurrentSubHostInfo] = useState(null);
  const [subHostKey, setSubHostKey] = useState(0); // Key for re-rendering the chosen sub-host
  const [isLoading, setIsLoading] = useState(true);

  const selectAndLoadRandomSubHost = useCallback(() => {
    setIsLoading(true);
    if (managedSubHosts.length === 0) {
      setCurrentSubHostInfo({ nameKey: 'practiceHosts.noHostsConfigured', defaultName: "No Practice Categories Available" });
      setCurrentSubHost(() => () => <p>{t('practiceHosts.noHostsConfigured', "No practice categories are currently configured for 'Practice All'.")}</p>);
      setIsLoading(false);
      return;
    }
    const randomIndex = Math.floor(Math.random() * managedSubHosts.length);
    const selectedHost = managedSubHosts[randomIndex];
    
    console.log(`MainPracticeAllHost: Selecting sub-host: ${selectedHost.defaultName}`);
    setCurrentSubHostInfo(selectedHost);
    setCurrentSubHost(() => selectedHost.Component);
    setSubHostKey(prev => prev + 1); // Ensure the selected sub-host re-initializes
    setIsLoading(false);
  }, [t]); // t is a dependency for the error message

  useEffect(() => {
    // This effect runs when the main hostKey (passed from ExerciseHost for MainPracticeAllHost itself) changes,
    // or on initial mount. It signifies a new "Practice All" session.
    console.log(`MainPracticeAllHost: hostKey changed to ${hostKey}, selecting new initial sub-host.`);
    selectAndLoadRandomSubHost();
  }, [hostKey, selectAndLoadRandomSubHost]);

  // This handler is for the "Next Category" button specific to MainPracticeAllHost
  const handleNextSubHostRequest = () => {
    console.log(`MainPracticeAllHost: User requested next sub-host category.`);
    selectAndLoadRandomSubHost();
  };

  if (isLoading || !CurrentSubHost) {
    return <p><TransliterableText text={t('loading.practiceAllSession', 'Loading Practice All Session...')} langOverride={i18nLanguage} /></p>;
  }

  const subHostDisplayName = currentSubHostInfo ? t(currentSubHostInfo.nameKey, currentSubHostInfo.defaultName) : "";

  return (
    <div className="main-practice-all-host-container" style={{padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0'}}>
      <h2 style={{ textAlign: 'center', marginTop: '0', marginBottom: '5px' }}>
        <TransliterableText text={t('titles.practiceAllMain', 'Practice All Categories')} langOverride={i18nLanguage} />
      </h2>
      {subHostDisplayName && (
        <p style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '1em', color: '#333', marginTop: '0', marginBottom: '15px' }}>
          <TransliterableText text={t('practiceHosts.currentCategory', `Current Focus: ${subHostDisplayName}`, { categoryName: subHostDisplayName })} langOverride={i18nLanguage} />
        </p>
      )}
      
      <CurrentSubHost
        language={language}
        days={days}
        exerciseKey={subHostKey} // This key ensures the sub-host re-initializes
        // Note: MainPracticeAllHost does not use onComplete from sub-hosts for auto-cycling in this iteration.
        // Sub-hosts will manage their own internal exercise cycling.
      />

      <div style={{marginTop: '20px', textAlign:'center'}}>
        <ExerciseControls
            onNextExercise={handleNextSubHostRequest}
            onRandomize={handleNextSubHostRequest} // Randomize also means pick a new sub-host type
            config={{
                showNext: true,
                nextButtonTextKey: 'buttons.nextCategory', // Suggest new translation key
                defaultNextButtonText: 'Next Category Focus',
                showRandomize: false, // Using 'Next' as the primary way to switch category focus
                showCheck: false,
                showHint: false,
                showReveal: false,
            }}
        />
      </div>
    </div>
  );
};

export default MainPracticeAllHost;
