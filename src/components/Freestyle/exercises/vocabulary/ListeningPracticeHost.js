// src/components/Freestyle/exercises/vocabulary/ListeningPracticeHost.js
import React, { useState, useEffect } from 'react';
import { loadVocabularyData } from '../../../../utils/exerciseDataService'; // Assuming listening uses word data with audio
// Import specific listening exercise mode components here later

const ListeningPracticeHost = ({ language, days, exerciseKey }) => {
  const [listeningData, setListeningData] = useState(null);
  const [currentExerciseMode, setCurrentExerciseMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListeningItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Using loadVocabularyData, will need to filter for items with audio
        const { data, error: fetchError } = await loadVocabularyData(language, days);
        if (fetchError) {
          throw new Error(fetchError);
        }
        
        const itemsWithAudio = data ? data.filter(item => item.audio && item.audio[language]) : [];

        if (itemsWithAudio.length > 0) {
          setListeningData(itemsWithAudio);
          // TODO: Select a random item and a random exercise mode
          console.log("ListeningPracticeHost: Data loaded", itemsWithAudio[0]);
          // setCurrentExerciseMode('transcribe'); // Example
        } else {
          setListeningData([]);
          setError('No listening exercises found (words with audio) for the selected criteria.');
        }
      } catch (err) {
        console.error("Error loading listening data:", err);
        setError(err.message || 'Failed to load listening exercises.');
      }
      setLoading(false);
    };

    if (language && days && days.length > 0) {
      fetchListeningItems();
    }
  }, [language, days, exerciseKey]);

  if (loading) {
    return <p>Loading listening exercise...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!listeningData || listeningData.length === 0) {
    return <p>No listening exercises available for this selection.</p>;
  }

  // TODO: Render the selected currentExerciseMode component
  return (
    <div>
      <h4>Listening Practice Host</h4>
      <p>Current Mode: {currentExerciseMode || 'None selected'}</p>
      {/* Placeholder for actual exercise mode rendering */}
      <pre>{JSON.stringify(listeningData[0], null, 2)}</pre>
      {listeningData[0] && listeningData[0].audio && listeningData[0].audio[language] && (
        <audio controls src={`${process.env.PUBLIC_URL}${listeningData[0].audio[language]}`}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default ListeningPracticeHost;
