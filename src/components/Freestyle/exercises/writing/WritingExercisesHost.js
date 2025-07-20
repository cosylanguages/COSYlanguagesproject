import React from 'react';

const WritingExercisesHost = ({ language, days }) => {
  return (
    <div>
      <h2>Writing Exercises</h2>
      <p>Language: {language}</p>
      <p>Days: {days.join(', ')}</p>
      {/* Add your writing exercises here */}
    </div>
  );
};

export default WritingExercisesHost;
