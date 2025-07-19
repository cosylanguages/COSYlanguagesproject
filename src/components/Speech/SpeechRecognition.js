import React, { useState, useEffect, useCallback } from 'react';
import annyang from 'annyang';

const SpeechRecognition = ({ onSpeech, commands }) => {
  const [isListening, setIsListening] = useState(false);

  const handleSpeech = useCallback((phrases) => {
    onSpeech(phrases[0]);
  }, [onSpeech]);

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

  const toggleListen = () => {
    if (isListening) {
      annyang.abort();
    } else {
      annyang.start();
    }
    setIsListening(!isListening);
  };

  return (
    <button onClick={toggleListen}>
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
};

export default SpeechRecognition;
