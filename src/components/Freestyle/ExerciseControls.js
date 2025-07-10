import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
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
  const { t, language: i18nLanguage } = useI18n();

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

  // Mapping exercise actions to button variants
  // These variants (success, info, warning, secondary, primary) should correspond to styles in index.css
  const buttonVariantMap = {
    hint: 'warning',    // Yellowish, like hints often are
    randomize: 'secondary', // Neutral, like randomize often is
    check: 'success',   // Green, for correct/check
    reveal: 'info',     // Blue/teal, for revealing information
    next: 'primary',    // Standard primary action
  };
  // Retaining action-button for base styling not covered by btn/btn-variant if any
  // And action-button-* for specific icons/text colors if variants don't cover them.
  // Ideally, variants should cover most, and Button.css or ExerciseControls.css would handle the rest.

  return (
    <div className="exercise-action-buttons">
      {showHint && onShowHint && (
        <Button
          className="action-button action-button-hint" // Keep for potential specific styles
          onClick={onShowHint}
          disabled={!canInteract}
          variant={buttonVariantMap.hint}
        >
          <TransliterableText text={hintButtonText} langOverride={i18nLanguage} />
        </Button>
      )}
      {showRandomize && onRandomize && (
        <Button
          className="action-button action-button-randomize"
          onClick={onRandomize}
          disabled={!canInteract && !showNext}
          variant={buttonVariantMap.randomize}
        >
          <TransliterableText text={randomizeButtonText} langOverride={i18nLanguage} />
        </Button>
      )}
      {showCheck && onCheckAnswer && (
        <Button
          className="action-button action-button-check"
          onClick={onCheckAnswer}
          disabled={!canInteract}
          variant={buttonVariantMap.check}
        >
          <TransliterableText text={checkButtonText} langOverride={i18nLanguage} />
        </Button>
      )}
      {showReveal && onRevealAnswer && (
        <Button
          className="action-button action-button-reveal"
          onClick={onRevealAnswer}
          disabled={!canInteract}
          variant={buttonVariantMap.reveal}
        >
          <TransliterableText text={revealButtonText} langOverride={i18nLanguage} />
        </Button>
      )}
      {customButton}
      {showNext && onNextExercise && (
        <Button
          className="action-button action-button-next"
          onClick={onNextExercise}
          variant={buttonVariantMap.next}
        >
          <TransliterableText text={nextButtonText} langOverride={i18nLanguage} />
        </Button>
      )}
    </div>
  );
};

export default ExerciseControls;
