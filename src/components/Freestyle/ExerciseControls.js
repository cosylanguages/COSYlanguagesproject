import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './ExerciseControls.css'; // To be created

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
  const { t } = useI18n();

  const {
    showCheck = !!onCheckAnswer,
    checkButtonText = t('freestyle.controls.check', '✔️ Check'),
    showReveal = !!onRevealAnswer,
    revealButtonText = t('freestyle.controls.reveal', '🤫 Reveal Answer'),
    showHint = !!onShowHint,
    hintButtonText = t('freestyle.controls.hint', '💡 Hint'),
    showRandomize = !!onRandomize,
    randomizeButtonText = t('freestyle.controls.randomize', '🎲 Randomize'),
    showNext = !!onNextExercise,
    nextButtonText = t('freestyle.controls.next', '➡️ Next Exercise'),
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
          {hintButtonText}
        </button>
      )}
      {showRandomize && onRandomize && (
        <button
          className="action-button action-button-randomize"
          onClick={onRandomize}
          disabled={!canInteract && !showNext} // Randomize might still be active if it means "new item"
        >
          {randomizeButtonText}
        </button>
      )}
      {showCheck && onCheckAnswer && (
        <button
          className="action-button action-button-check"
          onClick={onCheckAnswer}
          disabled={!canInteract}
        >
          {checkButtonText}
        </button>
      )}
      {showReveal && onRevealAnswer && (
        <button
          className="action-button action-button-reveal"
          onClick={onRevealAnswer}
          disabled={!canInteract}
        >
          {revealButtonText}
        </button>
      )}
      {customButton} 
      {showNext && onNextExercise && (
        <button
          className="action-button action-button-next"
          onClick={onNextExercise}
        >
          {nextButtonText}
        </button>
      )}
    </div>
  );
};

export default ExerciseControls;
