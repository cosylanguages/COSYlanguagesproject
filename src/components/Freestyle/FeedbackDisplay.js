import React from 'react';
import { useLatinizationContext } from '../../contexts/LatinizationContext';
import useLatinization from '../../hooks/useLatinization';

/**
 * Displays feedback messages for exercises.
 * Props:
 * - message: string or React node - The feedback message.
 * - type: string (e.g., 'correct', 'incorrect', 'hint', 'info', 'error') - Determines styling.
 * - language: string (optional) - The language of the feedback message, for latinization.
 */
const FeedbackDisplay = ({ message, type, language }) => {
  // Call the useLatinization hook unconditionally at the top level.
  // Pass an empty string if message is not a string to prevent errors in the hook.
  // The hook itself is expected to use LatinizationContext to determine if latinization is active.
  const latinizedVersion = useLatinization(typeof message === 'string' ? message : '', language);

  // Determine the actual message to display.
  // If the original message was not a string, or no language was provided, use the original message.
  // Otherwise, use the output from useLatinization (which respects the isLatinized context).
  const processedMessage = (typeof message === 'string' && language)
    ? latinizedVersion
    : message;

  // Get isLatinized from context, primarily for UI adjustments like font style,
  // not for deciding whether to call useLatinization.
  const { isLatinized } = useLatinizationContext();

  if (!message) {
    return <div style={{ minHeight: '24px', margin: '10px 0' }} aria-live="polite"></div>; // Reserve space
  }

  let style = {
    padding: '15px',
    margin: '10px 0',
    borderRadius: '8px',
    textAlign: 'center',
    minHeight: '24px', // Ensure it doesn't collapse when empty
    fontWeight: 'bold',
    animation: 'fadeIn 0.5s ease-in-out'
  };

  if (type === 'correct') {
    style.animation = 'correct-answer-animation 0.5s ease-in-out';
  }

  let textPrefix = '';

  switch (type) {
    case 'correct':
      style.backgroundColor = 'var(--color-success-bg)';
      style.color = 'var(--color-success-text)';
      style.borderColor = 'var(--color-success-border)';
      textPrefix = '🎉 ';
      break;
    case 'incorrect':
      style.backgroundColor = 'var(--color-danger-bg)';
      style.color = 'var(--color-danger-text)';
      style.borderColor = 'var(--color-danger-border)';
      textPrefix = '🤔 ';
      break;
    case 'hint':
      style.backgroundColor = 'var(--color-warning-bg)';
      style.color = 'var(--color-warning-text)';
      style.borderColor = 'var(--color-warning-border)';
      textPrefix = '💡 ';
      break;
    case 'info':
      style.backgroundColor = 'var(--color-info-bg)';
      style.color = 'var(--color-info-text)';
      style.borderColor = 'var(--color-info-border)';
      textPrefix = 'ℹ️ ';
      break;
    case 'error':
      style.backgroundColor = 'var(--color-danger-bg)'; // Same as incorrect
      style.color = 'var(--color-danger-text)';
      style.borderColor = 'var(--color-danger-border)';
      textPrefix = '⚠️ ';
      break;
    default: // Neutral / no specific type
      style.backgroundColor = 'var(--color-surface-medium)';
      style.color = 'var(--color-text-primary)';
      style.borderColor = 'var(--color-border)';
  }
  
  // Apply visual indication for latinized text if necessary
  if (isLatinized && typeof processedMessage === 'string' && typeof message === 'string' && processedMessage !== message) {
    style.fontStyle = 'italic'; 
    // style.fontFamily = 'Arial, sans-serif'; // Example alternative font
  }

  return (
    <div style={style} role="alert" aria-live="assertive">
      {textPrefix}{processedMessage}
    </div>
  );
};

export default FeedbackDisplay;
