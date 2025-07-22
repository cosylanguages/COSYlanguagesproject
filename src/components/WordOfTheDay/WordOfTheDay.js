import React from 'react';
import './WordOfTheDay.css';

function WordOfTheDay({ word, definition, example, image }) {
  return (
    <div className="word-of-the-day-container">
      <h2>Word of the Day</h2>
      <div className="word-of-the-day-content">
        <h3>{word}</h3>
        <p>{definition}</p>
        {image && <img src={image} alt={word} className="word-of-the-day-image" />}
        <p><em>{example}</em></p>
      </div>
    </div>
  );
}

export default WordOfTheDay;
