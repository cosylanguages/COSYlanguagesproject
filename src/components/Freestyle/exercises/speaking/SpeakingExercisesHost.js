import React from 'react';

const SpeakingExercisesHost = ({ language, days }) => {
  return (
    <div>
      <h2>Speaking Exercises</h2>
      <p>Language: {language}</p>
      <p>Days: {days.join(', ')}</p>
      {/* Add your speaking exercises here */}
    </div>
  );
};

export default SpeakingExercisesHost;
