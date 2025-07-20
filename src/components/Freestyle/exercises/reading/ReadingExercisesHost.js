import React from 'react';

const ReadingExercisesHost = ({ language, days }) => {
  return (
    <div>
      <h2>Reading Exercises</h2>
      <p>Language: {language}</p>
      <p>Days: {days.join(', ')}</p>
      {/* Add your reading exercises here */}
    </div>
  );
};

export default ReadingExercisesHost;
