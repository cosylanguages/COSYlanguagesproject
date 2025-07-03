// src/components/Freestyle/exercises/vocabulary/ShowWordMode.js
import React, { useEffect } from 'react';
import { useLatinizationContext } from '../../../../contexts/LatinizationContext';
import useLatinization from '../../../../hooks/useLatinization';
import { pronounceText, unlockAudioPlayback } from '../../../../utils/speechUtils';
import ExerciseControls from '../../ExerciseControls';
import FeedbackDisplay from '../../FeedbackDisplay'; // Assuming FeedbackDisplay is available and works

const ShowWordMode = ({ wordObject, language, onNext }) => {
  const { isLatinized } = useLatinizationContext();
  const latinizedWordDisplay = useLatinization(wordObject?.word || '', language); // Use wordObject.word

  useEffect(() => {
    unlockAudioPlayback();
  }, []);

  const handlePronounce = async () => {
    if (wordObject?.word && language) {
      try {
        // If wordObject has specific audio URL, prefer that. Otherwise, use TTS.
        if (wordObject.audio && wordObject.audio[language]) {
            const audioUrl = `${process.env.PUBLIC_URL}${wordObject.audio[language]}`;
            const audio = new Audio(audioUrl);
            audio.play().catch(e => console.error("Error playing audio:", e));
        } else {
            await pronounceText(wordObject.word, language);
        }
      } catch (speechError) {
        console.error("Error pronouncing word:", speechError);
        // Consider using FeedbackDisplay for errors if appropriate
        alert("Could not pronounce the word. Ensure audio is enabled.");
      }
    }
  };

  if (!wordObject) {
    return <FeedbackDisplay message="No word data provided to ShowWordMode." type="error" />;
  }

  const displayWord = isLatinized ? latinizedWordDisplay : wordObject.word;
  const wordStyle = (isLatinized && wordObject.word !== latinizedWordDisplay) ? { fontFamily: 'Arial, sans-serif', fontStyle: 'italic' } : {};

  const pronounceButtonStyle = {
    padding: '10px 15px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px',
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3>Word Display</h3>
      <div
        style={{ fontSize: '2.5rem', margin: '20px 0', padding: '10px', ...wordStyle }}
        aria-label={`Word to practice: ${wordObject.word}`}
      >
        {displayWord}
      </div>
      {wordObject.translation && (
        <div style={{ fontSize: '1.5rem', margin: '10px 0', color: '#555' }}>
          <em>({wordObject.translation[language] || wordObject.translation['COSYenglish'] || 'No translation available'})</em>
        </div>
      )}
      {wordObject.sentence && (
         <div style={{ fontSize: '1.2rem', margin: '10px 0', color: '#777' }}>
            Example: <em>{wordObject.sentence[language] || wordObject.sentence['COSYenglish']}</em>
         </div>
      )}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <button onClick={handlePronounce} style={pronounceButtonStyle} disabled={!wordObject.word}>
          🔊 Pronounce
        </button>
        <ExerciseControls
          onNextExercise={onNext} // Hook up to the passed `onNext` prop
          config={{
            showNext: true,
            showCheck: false,
            showHint: false,
            showReveal: false,
            showRandomize: false,
          }}
        />
      </div>
    </div>
  );
};

export default ShowWordMode;
