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
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    textAlign: 'center',
    minHeight: '24px', // Ensure it doesn't collapse when empty
  };

  let textPrefix = '';

  switch (type) {
    case 'correct':
      style.backgroundColor = '#d4edda';
      style.color = '#155724';
      style.borderColor = '#c3e6cb';
      textPrefix = '✅ ';
      break;
    case 'incorrect':
      style.backgroundColor = '#f8d7da';
      style.color = '#721c24';
      style.borderColor = '#f5c6cb';
      textPrefix = '❌ ';
      break;
    case 'hint':
      style.backgroundColor = '#fff3cd';
      style.color = '#856404';
      style.borderColor = '#ffeeba';
      textPrefix = '💡 ';
      break;
    case 'info':
      style.backgroundColor = '#d1ecf1';
      style.color = '#0c5460';
      style.borderColor = '#bee5eb';
      textPrefix = 'ℹ️ ';
      break;
    case 'error':
      style.backgroundColor = '#f8d7da'; // Same as incorrect
      style.color = '#721c24';
      style.borderColor = '#f5c6cb';
      textPrefix = '⚠️ ';
      break;
    default: // Neutral / no specific type
      style.backgroundColor = '#e9ecef';
      style.color = '#495057';
      style.borderColor = '#ced4da';
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
