import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button'; // Import Button
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
  const { t } = useI18n();

  const {
    showCheck = !!onCheckAnswer,
    checkButtonText = t('buttons.check', '✔️ Check'),
    showReveal = !!onRevealAnswer,
    revealButtonText = t('buttons.revealAnswer', '🤫 Reveal Answer'),
    showHint = !!onShowHint,
    hintButtonText = t('buttons.help', '💡 Hint'),
    showRandomize = !!onRandomize,
    randomizeButtonText = t('buttons.randomize', '🎲 Randomize'),
    showNext = !!onNextExercise,
    nextButtonText = t('buttons.next', '➡️ Next Exercise'),
  } = config;

  const canInteract = !isAnswerCorrect && !isRevealed;

  return (
    <div className="exercise-action-buttons">
      {showHint && onShowHint && (
        <Button
          onClick={onShowHint}
          disabled={!canInteract}
          className="btn-warning"
        >
          {hintButtonText}
        </Button>
      )}
      {showRandomize && onRandomize && (
        <Button
          onClick={onRandomize}
          disabled={!canInteract && !showNext}
          className="btn-secondary"
        >
          {randomizeButtonText}
        </Button>
      )}
      {showCheck && onCheckAnswer && (
        <Button
          onClick={onCheckAnswer}
          disabled={!canInteract}
          className="btn-success"
        >
          {checkButtonText}
        </Button>
      )}
      {showReveal && onRevealAnswer && (
        <Button
          onClick={onRevealAnswer}
          disabled={!canInteract}
          className="btn-info"
        >
          {revealButtonText}
        </Button>
      )}
      {customButton}
      {showNext && onNextExercise && (
        <Button
          onClick={onNextExercise}
          className="btn-primary"
        >
          {nextButtonText}
        </Button>
      )}
    </div>
  );
};

export default ExerciseControls;
