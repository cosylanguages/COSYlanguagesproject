import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './ExerciseControls.css';

const ExerciseControls = ({
  onCheckAnswer,
  onRevealAnswer,
  onShowHint,
  onRandomize,
  onNextExercise,
  config = {},
  isAnswerCorrect = false,
  isRevealed = false,
  customButton = null
}) => {
  const { t, language: i18nLanguage } = useI18n();

  // Use 'buttons.*' key pattern, assuming they exist in translation files.
  // Default English text provided as fallback.
  const {
    showCheck = !!onCheckAnswer,
    checkButtonText = t('buttons.check', '✔️ Check'), // Changed key
    showReveal = !!onRevealAnswer,
    revealButtonText = t('buttons.revealAnswer', '🤫 Reveal Answer'), // Changed key
    showHint = !!onShowHint,
    hintButtonText = t('buttons.help', '💡 Hint'), // Changed key (it.js has 'Aiuto' for help, using this as hint)
    showRandomize = !!onRandomize,
    randomizeButtonText = t('buttons.randomize', '🎲 Randomize'), // Changed key
    showNext = !!onNextExercise,
    nextButtonText = t('buttons.next', '➡️ Next Exercise'), // Changed key
  } = config;

  const canInteract = !isAnswerCorrect && !isRevealed;

  return (
    <div className="exercise-action-buttons">
      {showHint && onShowHint && (
        <button
          className="action-button action-button-hint"
          onClick={onShowHint}
          disabled={!canInteract}
        >
          <TransliterableText text={hintButtonText} langOverride={i18nLanguage} />
        </button>
      )}
      {showRandomize && onRandomize && (
        <button
          className="action-button action-button-randomize"
          onClick={onRandomize}
          disabled={!canInteract && !showNext} 
        >
          <TransliterableText text={randomizeButtonText} langOverride={i18nLanguage} />
        </button>
      )}
      {showCheck && onCheckAnswer && (
        <button
          className="action-button action-button-check"
          onClick={onCheckAnswer}
          disabled={!canInteract}
        >
          <TransliterableText text={checkButtonText} langOverride={i18nLanguage} />
        </button>
      )}
      {showReveal && onRevealAnswer && (
        <button
          className="action-button action-button-reveal"
          onClick={onRevealAnswer}
          disabled={!canInteract}
        >
          <TransliterableText text={revealButtonText} langOverride={i18nLanguage} />
        </button>
      )}
      {customButton} 
      {showNext && onNextExercise && (
        <button
          className="action-button action-button-next"
          onClick={onNextExercise}
        >
          <TransliterableText text={nextButtonText} langOverride={i18nLanguage} />
        </button>
      )}
    </div>
  );
};

export default ExerciseControls;
