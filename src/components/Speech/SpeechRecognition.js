// Import necessary libraries and components.
import React, { useState, useEffect, useCallback } from 'react';
import annyang from 'annyang';

/**
 * A component that provides a simple interface for speech recognition.
 * It uses the annyang library to handle the speech recognition.
 * @param {object} props - The component's props.
 * @param {function} props.onSpeech - A callback function to handle recognized speech.
 * @param {object} props.commands - An object of commands to be recognized by annyang.
 * @returns {JSX.Element} The SpeechRecognition component.
 */
const SpeechRecognition = ({ onSpeech, commands }) => {
  const [isListening, setIsListening] = useState(false);

  /**
   * Handles the recognition of speech.
   * @param {Array<string>} phrases - An array of recognized phrases.
   */
  const handleSpeech = useCallback((phrases) => {
    onSpeech(phrases[0]);
  }, [onSpeech]);

  // Effect to add and remove commands and callbacks from annyang.
  useEffect(() => {
    if (commands) {
      annyang.addCommands(commands);
    }
    annyang.addCallback('result', handleSpeech);

    return () => {
      annyang.removeCallback('result', handleSpeech);
      if (commands) {
        annyang.removeCommands(Object.keys(commands));
      }
    };
  }, [commands, handleSpeech]);

  /**
   * Toggles the listening state of the speech recognition.
   */
  const toggleListen = () => {
    if (isListening) {
      annyang.abort();
    } else {
      annyang.start();
    }
    setIsListening(!isListening);
  };

  // Render the speech recognition button.
  return (
    <button onClick={toggleListen}>
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
};

export default SpeechRecognition;
