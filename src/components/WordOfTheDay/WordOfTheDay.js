import React, a from 'react';
import './WordOfTheDay.css';

function WordOfTheDay({ word, translation, example }) {
  return (
    <div className="word-of-the-day-container">
      <h2>Word of the Day</h2>
      <div className="word-of-the-day-content">
        <h3>{word}</h3>
        <p>{translation}</p>
        <p><em>{example}</em></p>
      </div>
    </div>
  );
}

export default WordOfTheDay;
