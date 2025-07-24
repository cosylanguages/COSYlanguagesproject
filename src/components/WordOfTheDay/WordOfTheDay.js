// Import necessary libraries and components.
import React from 'react';
import './WordOfTheDay.css';

/**
 * A component that displays the word of the day.
 * @param {object} props - The component's props.
 * @param {string} props.word - The word of the day.
 * @param {string} props.definition - The definition of the word.
 * @param {string} props.example - An example sentence using the word.
 * @param {string} props.image - The URL of an image related to the word.
 * @returns {JSX.Element} The WordOfTheDay component.
 */
function WordOfTheDay({ word, definition, example, image }) {
  // Render the word of the day component.
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
