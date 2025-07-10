import React, { useState, useEffect, useCallback } from 'react';
import { loadConjugationData, loadEnglishIrregularVerbsData } from '../../../../utils/conjugationDataService';
import { processConjugationData } from '../../../../utils/conjugationProcessor';
import FeedbackDisplay from '../../FeedbackDisplay';
import ExerciseControls from '../../ExerciseControls';
import { useI18n } from '../../../../i18n/I18nContext';
// import useLatinization from '../../../../hooks/useLatinization'; // Might need later

const ConjugationPracticeExercise = ({ language, exerciseKey }) => {
  const [processedVerbs, setProcessedVerbs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useI18n();
  // const getLatinizedText = useLatinization(); // Might need later for displaying verb infinitives etc.

  const [currentExerciseMode, setCurrentExerciseMode] = useState(null); // 'fillTable', 'translateForm'
  const [currentVerb, setCurrentVerb] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // States for FillConjugationTable
  const [isTableRevealed, setIsTableRevealed] = useState(false);
  const [isTableAllCorrect, setIsTableAllCorrect] = useState(false);

  // States for VerbFormTranslation
  const [translationTask, setTranslationTask] = useState(null); // { tenseName, pronoun, conjugatedForm, direction }
  const [isTranslationRevealed, setIsTranslationRevealed] = useState(false);
  const [isTranslationCorrect, setIsTranslationCorrect] = useState(false);

  // States for IrregularVerbQuiz
  const [irregularVerbItem, setIrregularVerbItem] = useState(null); // { base, pastSimple, pastParticiple, ... }
  const [isIrregularQuizRevealed, setIsIrregularQuizRevealed] = useState(false);
  const [isIrregularQuizCorrect, setIsIrregularQuizCorrect] = useState(false);

  const checkAnswersRef = React.useRef(null); // For child components to expose their check function

  const tensesForTable = ['présent', 'futur simple', 'passé composé', 'imparfait'];

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const setupExercise = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProcessedVerbs([]);
    setCurrentExerciseMode(null);
    setCurrentVerb(null);
    setFeedback({ message: '', type: '' });

    setIsTableRevealed(false);
    setIsTableAllCorrect(false);

    setTranslationTask(null);
    setIsTranslationRevealed(false);
    setIsTranslationCorrect(false);

    setIrregularVerbItem(null);
    setIsIrregularQuizRevealed(false);
    setIsIrregularQuizCorrect(false);

    if (checkAnswersRef.current) checkAnswersRef.current = null;

    // Decide exercise type first
    const exerciseTypes = ['fillTable', 'translateForm'];
    if (language === 'COSYenglish') {
      exerciseTypes.push('irregularEnglishVerbQuiz');
    }
    const chosenMode = getRandomElement(exerciseTypes);
    // const chosenMode = language === 'COSYenglish' ? 'irregularEnglishVerbQuiz' : 'translateForm'; // TODO: Randomize later

    setCurrentExerciseMode(chosenMode); // Set mode early

    try {
      if (chosenMode === 'irregularEnglishVerbQuiz' && language === 'COSYenglish') {
        const { data: irregularVerbs, error: irregularError } = await loadEnglishIrregularVerbsData();
        if (irregularError) throw new Error(irregularError.message || irregularError.error || t('errors.loadIrregularVerbsError', 'Failed to load irregular verbs.'));
        if (!irregularVerbs || irregularVerbs.length === 0) {
          setError(t('exercises.noIrregularVerbs', 'No irregular verbs found for English.'));
          setIsLoading(false);
          return;
        }
        setIrregularVerbItem(getRandomElement(irregularVerbs));
        // No need to set processedVerbs or currentVerb for this specific mode if it doesn't use them.
      } else { // For 'fillTable' or 'translateForm', load general conjugation data
        const { data: rawData, error: fetchError } = await loadConjugationData(language);
        if (fetchError) {
          throw new Error(fetchError.message || fetchError.error || t('errors.loadConjugationDataError', 'Failed to load conjugation data.'));
        }

        if (!rawData || !rawData.verbs || rawData.verbs.length === 0) {
          setError(t('exercises.noConjugationData', 'No conjugation data found for this language.'));
          setIsLoading(false);
          return;
        }

        const verbs = processConjugationData(rawData, language);
        if (verbs.length === 0) {
          setError(t('exercises.noProcessableConjugationData', 'No processable conjugation entries found.'));
          setIsLoading(false);
          return;
        }
        setProcessedVerbs(verbs); // Set for table or translation modes

        // currentExerciseMode is already set, now populate data for that mode
        if (currentExerciseMode === 'fillTable') {
          const suitableVerbForTable = verbs.find(v =>
            v.tenses && tensesForTable.some(tKey => v.tenses[tKey.toLowerCase()])
          );
          if (suitableVerbForTable) {
            setCurrentVerb(suitableVerbForTable);
          } else {
            console.warn(`No verb found with any of the specified tenses for table: ${tensesForTable.join(', ')}.`);
            setError(t('exercises.noSuitableVerbForTable', 'Could not find a suitable verb for the table exercise.'));
          }
        } else if (currentExerciseMode === 'translateForm') {
          const verbWithTenses = verbs.filter(v => v.tenses && Object.keys(v.tenses).length > 0);
          if (verbWithTenses.length > 0) {
            const randomVerb = getRandomElement(verbWithTenses);
            const availableTenses = Object.keys(randomVerb.tenses);
            const randomTenseName = getRandomElement(availableTenses);
            const tenseForms = randomVerb.tenses[randomTenseName]?.forms;

            if (tenseForms && Object.keys(tenseForms).length > 0) {
              const randomPronoun = getRandomElement(Object.keys(tenseForms));
              const conjugatedForm = tenseForms[randomPronoun];
              const direction = Math.random() < 0.5 ? 'toEnglish' : 'fromEnglish';

              setCurrentVerb(randomVerb);
              setTranslationTask({
                tenseName: randomTenseName,
                pronoun: randomPronoun,
                conjugatedForm: conjugatedForm,
                direction: direction,
              });
              setCurrentExerciseMode('translateForm');
            } else {
              console.warn(`Verb ${randomVerb.infinitive} has no forms for tense ${randomTenseName}.`);
              setError(t('exercises.errorGeneratingTranslationTask', 'Error generating translation task.'));
            }
          } else {
            setError(t('exercises.noVerbsForTranslation', 'No verbs suitable for translation exercise found.'));
          }
        }
      }
    } catch (err) {
      console.error("ConjugationPracticeExercise - Error setting up:", err);
      setError(err.message || t('errors.unexpectedError', 'An unexpected error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    if (language) {
      setupExercise();
    } else {
      setIsLoading(false);
      setError(t('errors.selectLang',"Please select a language."));
    }
  }, [language, exerciseKey, setupExercise]); // exerciseKey to re-trigger when user wants a new "session"

  const handleNextExercise = () => {
    setupExercise();
  };

  // Generic check answer handler
  const handleCheckAnswer = () => {
    if (checkAnswersRef.current) {
      checkAnswersRef.current();
    }
  };

  // Generic reveal answer handler
  const handleRevealAnswer = () => {
    if (currentExerciseMode === 'fillTable') {
      setIsTableRevealed(true);
      setIsTableAllCorrect(true);
    } else if (currentExerciseMode === 'translateForm') {
      setIsTranslationRevealed(true);
      setIsTranslationCorrect(true);
    }
    setFeedback({ message: t('feedback.answersRevealed', 'Answers have been revealed.'), type: 'info' });
  };

  // Dynamic imports for sub-components
  const [FillConjugationTable, setFillConjugationTable] = useState(null);
  const [VerbFormTranslation, setVerbFormTranslation] = useState(null);
  const [IrregularVerbQuiz, setIrregularVerbQuiz] = useState(null);


  useEffect(() => {
    import('./FillConjugationTable').then(module => setFillConjugationTable(() => module.default));
    import('./VerbFormTranslation').then(module => setVerbFormTranslation(() => module.default));
    import('./IrregularVerbQuiz').then(module => setIrregularVerbQuiz(() => module.default));
  }, []);


  if (isLoading) return <p>{t('loading.conjugationExercise', 'Loading conjugation exercise...')}</p>;
  if (error) return <FeedbackDisplay message={error} type="error" />;

  // Ensure sub-components are loaded before trying to render them
  if (currentExerciseMode === 'fillTable' && !FillConjugationTable) return <p>{t('loading.exerciseComponent', 'Loading exercise component...')}</p>;
  if (currentExerciseMode === 'translateForm' && !VerbFormTranslation) return <p>{t('loading.exerciseComponent', 'Loading exercise component...')}</p>;
  if (currentExerciseMode === 'irregularEnglishVerbQuiz' && !IrregularVerbQuiz) return <p>{t('loading.exerciseComponent', 'Loading exercise component...')}</p>;


  // Data availability checks
  if (currentExerciseMode !== 'irregularEnglishVerbQuiz' && processedVerbs.length === 0 && !isLoading) {
    return <FeedbackDisplay message={t('exercises.noConjugationDataAvailable', "No conjugation data available for practice with the current selections.")} type="info" />;
  }
  if (currentExerciseMode === 'irregularEnglishVerbQuiz' && !irregularVerbItem && !isLoading) {
     return <FeedbackDisplay message={t('exercises.noIrregularVerbs', 'No irregular verbs found for English.')} type="info" />;
  }

  // Specific checks for data suitability for current mode
  if (currentExerciseMode === 'fillTable' && !currentVerb) {
    return <FeedbackDisplay message={t('exercises.noSuitableVerbForTable', 'Could not find a suitable verb for the table exercise with the configured tenses.')} type="info" />;
  }
  if (currentExerciseMode === 'translateForm' && (!currentVerb || !translationTask)) {
     return <FeedbackDisplay message={t('exercises.errorGeneratingTranslationTask', 'Error generating translation task.')} type="info" />;
  }


  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>{t('titles.conjugationPractice', 'Conjugation Practice')}</h3>

      <FeedbackDisplay message={feedback.message} type={feedback.type} language={language} />

      {currentExerciseMode === 'fillTable' && currentVerb && FillConjugationTable && (
        <FillConjugationTable
          verb={currentVerb}
          language={language}
          tensesToShow={tensesForTable}
          onCheckAnswers={checkAnswersRef}
          onSetFeedback={setFeedback}
          isRevealedExternally={isTableRevealed}
          onSetAllCorrect={setIsTableAllCorrect}
        />
      )}

      {currentExerciseMode === 'translateForm' && currentVerb && translationTask && VerbFormTranslation && (
        <VerbFormTranslation
          verb={currentVerb}
          tenseName={translationTask.tenseName}
          pronoun={translationTask.pronoun}
          conjugatedForm={translationTask.conjugatedForm}
          translationDirection={translationTask.direction}
          language={language}
          onCheckAnswer={checkAnswersRef}
          onSetFeedback={setFeedback}
          isRevealedExternally={isTranslationRevealed}
          onSetCorrect={setIsTranslationCorrect}
        />
      )}

      {currentExerciseMode === 'irregularEnglishVerbQuiz' && irregularVerbItem && IrregularVerbQuiz && (
        <IrregularVerbQuiz
          verb={irregularVerbItem}
          language={language} // Should be COSYenglish
          onCheckAnswer={checkAnswersRef}
          onSetFeedback={setFeedback}
          isRevealedExternally={isIrregularQuizRevealed}
          onSetCorrect={setIsIrregularQuizCorrect}
        />
      )}

      {!currentExerciseMode && ( // Fallback if no mode is active yet or component is loading
        <div>
          <p>{t('labels.verbsLoaded', `Successfully loaded {count} verbs for practice.`, { count: processedVerbs.length })}</p>
          <p style={{marginTop: '20px', fontStyle: 'italic'}}>
            {t('messages.morePracticeModesComing', 'More practice modes will be added here!')}
          </p>
        </div>
      )}

      <ExerciseControls
        onCheckAnswer={!isTableAllCorrect && !isTranslationCorrect && !isIrregularQuizCorrect && !isTableRevealed && !isTranslationRevealed && !isIrregularQuizRevealed ? handleCheckAnswer : undefined}
        onRevealAnswer={!isTableAllCorrect && !isTranslationCorrect && !isIrregularQuizCorrect && !isTableRevealed && !isTranslationRevealed && !isIrregularQuizRevealed ? handleRevealAnswer : undefined}
        onNextExercise={handleNextExercise}
        config={{
          showCheck:
            (currentExerciseMode === 'fillTable' && !isTableRevealed && !isTableAllCorrect) ||
            (currentExerciseMode === 'translateForm' && !isTranslationRevealed && !isTranslationCorrect) ||
            (currentExerciseMode === 'irregularEnglishVerbQuiz' && !isIrregularQuizRevealed && !isIrregularQuizCorrect),
          showHint: false,
          showReveal:
            (currentExerciseMode === 'fillTable' && !isTableRevealed && !isTableAllCorrect) ||
            (currentExerciseMode === 'translateForm' && !isTranslationRevealed && !isTranslationCorrect) ||
            (currentExerciseMode === 'irregularEnglishVerbQuiz' && !isIrregularQuizRevealed && !isIrregularQuizCorrect),
          showRandomize: false,
          showNext: true,
        }}
        isAnswerCorrect={isTableAllCorrect || isTranslationCorrect || isIrregularQuizCorrect}
        isRevealed={isTableRevealed || isTranslationRevealed || isIrregularQuizRevealed}
      />
    </div>
  );
};

export default ConjugationPracticeExercise;
