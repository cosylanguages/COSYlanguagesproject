import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import WordOfTheDay from '../../components/WordOfTheDay/WordOfTheDay';

function LandingPage() {
  const [wordOfTheDay, setWordOfTheDay] = useState(null);

  useEffect(() => {
    fetch('/data/wordOfTheDay.json')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setWordOfTheDay(data[randomIndex]);
      });
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to COSYlanguages</h1>
        <p>Your journey to language mastery starts here.</p>
        {wordOfTheDay && (
          <WordOfTheDay
            word={wordOfTheDay.word}
            definition={wordOfTheDay.definition}
            example={wordOfTheDay.example}
            image={wordOfTheDay.image}
          />
        )}
        <div className="landing-buttons">
          <Link to="/freestyle" className="landing-button">Freestyle Mode</Link>
          <Link to="/study" className="landing-button secondary">Study Mode</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
