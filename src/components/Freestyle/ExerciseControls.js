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

  const buttonVariantMap = {
    hint: 'warning',
    randomize: 'secondary',
    check: 'success',
    reveal: 'info',
    next: 'primary',
  };

  return (
    <div className="exercise-action-buttons">
      {showHint && onShowHint && (
        <Button
          onClick={onShowHint}
          disabled={!canInteract}
          variant="contained"
          color={buttonVariantMap.hint}
        >
          {hintButtonText}
        </Button>
      )}
      {showRandomize && onRandomize && (
        <Button
          onClick={onRandomize}
          disabled={!canInteract && !showNext}
          variant="contained"
          color={buttonVariantMap.randomize}
        >
          {randomizeButtonText}
        </Button>
      )}
      {showCheck && onCheckAnswer && (
        <Button
          onClick={onCheckAnswer}
          disabled={!canInteract}
          variant="contained"
          color={buttonVariantMap.check}
        >
          {checkButtonText}
        </Button>
      )}
      {showReveal && onRevealAnswer && (
        <Button
          onClick={onRevealAnswer}
          disabled={!canInteract}
          variant="contained"
          color={buttonVariantMap.reveal}
        >
          {revealButtonText}
        </Button>
      )}
      {customButton}
      {showNext && onNextExercise && (
        <Button
          onClick={onNextExercise}
          variant="contained"
          color={buttonVariantMap.next}
        >
          {nextButtonText}
        </Button>
      )}
    </div>
  );
};

export default ExerciseControls;
