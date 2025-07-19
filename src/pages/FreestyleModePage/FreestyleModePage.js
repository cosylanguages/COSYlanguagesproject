import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../../i18n/I18nContext';
import { LatinizationProvider } from '../../contexts/LatinizationContext';
import { LanguageIslandWrapper, DaySelectorIslandWrapper, PracticeNavIslandWrapper, ExerciseHostIslandWrapper, HelpPopupIslandWrapper } from '../../islands/freestyleIslandsEntry';
import FreestyleProgress from '../../components/Freestyle/FreestyleProgress';
import BoosterPackOfTheWeek from '../../components/Freestyle/BoosterPackOfTheWeek';
import ThemedBoosterPacks from '../../components/Freestyle/ThemedBoosterPacks';
import WordCloud from '../../components/Freestyle/WordCloud';
import SessionSummary from '../../components/Freestyle/SessionSummary';
import '../../freestyle-shared.css';
import './FreestyleModePage.css';

const FreestyleModePage = () => {
    /**
     * This effect mounts the freestyle islands when the component mounts.
     * The islands are mounted in different containers on the page.
     */
    useEffect(() => {
        const mountFreestyleIslands = () => {
            if (typeof window !== 'undefined' && typeof document !== 'undefined' && (typeof process === 'undefined' || process.env.NODE_ENV !== 'test')) {
                const languageContainer = document.getElementById('language-selector-island-container');
                const daySelectorContainer = document.getElementById('day-selector-island-container');
                const practiceNavContainer = document.getElementById('practice-nav-island-container');
                const exerciseHostContainer = document.getElementById('exercise-host-container');
                const helpPopupContainer = document.getElementById('help-popup-island-container');

                if (!languageContainer || !daySelectorContainer || !practiceNavContainer || !exerciseHostContainer || !helpPopupContainer) {
                    return;
                }

                if (languageContainer) {
                    ReactDOM.createRoot(languageContainer).render(
                        <React.StrictMode>
                            <BrowserRouter>
                                <I18nProvider>
                                    <LatinizationProvider>
                                        <LanguageIslandWrapper />
                                    </LatinizationProvider>
                                </I18nProvider>
                            </BrowserRouter>
                        </React.StrictMode>
                    );
                }

                if (helpPopupContainer) {
                    ReactDOM.createRoot(helpPopupContainer).render(
                        <React.StrictMode>
                            <BrowserRouter>
                                <I18nProvider>
                                    <LatinizationProvider>
                                        <HelpPopupIslandWrapper />
                                    </LatinizationProvider>
                                </I18nProvider>
                            </BrowserRouter>
                        </React.StrictMode>
                    );
                }

                const handleDayConfirm = (confirmedDays, selectedLanguage) => {
                    const practiceNavContainer = document.getElementById('practice-nav-island-container');
                    const daySelectorContainer = document.getElementById('day-selector-island-container');
                    const exerciseHostContainer = document.getElementById('exercise-host-container');

                    if (practiceNavContainer && selectedLanguage && confirmedDays.length > 0) {
                        if (daySelectorContainer) daySelectorContainer.style.border = '2px solid green';
                        practiceNavContainer.style.display = 'block';
                        if (!practiceNavContainer._reactRoot) practiceNavContainer._reactRoot = ReactDOM.createRoot(practiceNavContainer);
                        practiceNavContainer._reactRoot.render(
                            <React.StrictMode>
                                <BrowserRouter>
                                    <I18nProvider>
                                        <LatinizationProvider>
                                            <PracticeNavIslandWrapper language={selectedLanguage} days={confirmedDays} />
                                        </LatinizationProvider>
                                    </I18nProvider>
                                </BrowserRouter>
                            </React.StrictMode>
                        );
                    } else {
                        if (practiceNavContainer) { practiceNavContainer.style.display = 'none'; if (practiceNavContainer._reactRoot) { practiceNavContainer._reactRoot.unmount(); practiceNavContainer._reactRoot = null; } }
                    }
                    if (exerciseHostContainer && exerciseHostContainer._reactRoot) { exerciseHostContainer._reactRoot.unmount(); exerciseHostContainer._reactRoot = null; exerciseHostContainer.innerHTML = '<p>Exercise Area</p>'; }
                };

                window.addEventListener('languageIslandChange', (event) => {
                    const { selectedLanguage } = event.detail;
                    const daySelectorContainer = document.getElementById('day-selector-island-container');
                    const practiceNavContainer = document.getElementById('practice-nav-island-container');
                    const exerciseHostContainer = document.getElementById('exercise-host-container');

                    if (daySelectorContainer && selectedLanguage) {
                        daySelectorContainer.style.display = 'block';
                        if (!daySelectorContainer._reactRoot) daySelectorContainer._reactRoot = ReactDOM.createRoot(daySelectorContainer);
                        daySelectorContainer._reactRoot.render(
                            <React.StrictMode>
                                <BrowserRouter>
                                    <I18nProvider>
                                        <LatinizationProvider>
                                            <DaySelectorIslandWrapper language={selectedLanguage} onConfirm={(confirmedDays) => handleDayConfirm(confirmedDays, selectedLanguage)} />
                                        </LatinizationProvider>
                                    </I18nProvider>
                                </BrowserRouter>
                            </React.StrictMode>
                        );
                    } else {
                        if (daySelectorContainer) { daySelectorContainer.style.display = 'none'; if (daySelectorContainer._reactRoot) { daySelectorContainer._reactRoot.unmount(); daySelectorContainer._reactRoot = null; } }
                        if (practiceNavContainer) { practiceNavContainer.style.display = 'none'; if (practiceNavContainer._reactRoot) { practiceNavContainer._reactRoot.unmount(); practiceNavContainer._reactRoot = null; } }
                        if (exerciseHostContainer && exerciseHostContainer._reactRoot) { exerciseHostContainer._reactRoot.unmount(); exerciseHostContainer._reactRoot = null; exerciseHostContainer.innerHTML = '<p>Exercise Area</p>'; }
                    }
                });

                window.addEventListener('exerciseSelected', (event) => {
                    const { language, days, exercise, key: exerciseKeyFromEvent } = event.detail;
                    const exerciseHostContainer = document.getElementById('exercise-host-container');
                    if (exerciseHostContainer) {
                        const placeholder = exerciseHostContainer.querySelector('p');
                        if (placeholder) placeholder.remove();

                        if (!exerciseHostContainer._reactRoot) exerciseHostContainer._reactRoot = ReactDOM.createRoot(exerciseHostContainer);
                        exerciseHostContainer._reactRoot.render(
                            <React.StrictMode>
                                <BrowserRouter>
                                    <I18nProvider>
                                        <LatinizationProvider>
                                            <ExerciseHostIslandWrapper
                                                language={language}
                                                days={days}
                                                subPracticeType={exercise}
                                                exerciseKey={exerciseKeyFromEvent}
                                            />
                                        </LatinizationProvider>
                                    </I18nProvider>
                                </BrowserRouter>
                            </React.StrictMode>
                        );
                    }
                });
            }
        };

        mountFreestyleIslands();
    }, []);

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

            <BoosterPackOfTheWeek />
            <ThemedBoosterPacks />

            <FreestyleProgress />

            <div id="language-selector-island-container" className="island-placeholder">
                {/* React Language Selector Island will be mounted here */}
            </div>

            <div id="freestyle-controls-container" className="island-placeholder">
                {/* Mount point for Day Selector Island */}
                <div id="day-selector-island-container" className="island-placeholder" style={{ display: 'none' }}>
                    {/* Day Selector Island will be mounted here */}
                </div>
                {/* Mount point for Practice Navigation Island */}
                <div id="practice-nav-island-container" className="island-placeholder" style={{ display: 'none' }}>
                    {/* Practice Navigation Island will be mounted here */}
                </div>
            </div>

            <div id="exercise-host-container" className="island-placeholder">
                {/* React Exercise Host Island will be mounted here */}
            </div>
            <WordCloud words={words} />
            <SessionSummary summary={summary} />
            <div id="help-popup-island-container"></div> {/* Placeholder for Help Popup Island */}
        </div>
    );
};

export default FreestyleModePage;
