import React from 'react';

const GrammarExercisesHost = ({ language, days }) => {
  return (
    <div>
      <h2>Grammar Exercises</h2>
      <p>Language: {language}</p>
      <p>Days: {days.join(', ')}</p>
      {/* Add your grammar exercises here */}
    </div>
  );
};

export default GrammarExercisesHost;
