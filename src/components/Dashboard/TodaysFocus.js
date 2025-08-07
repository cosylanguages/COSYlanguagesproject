// src/components/Dashboard/TodaysFocus.js
import React, { useState, useEffect } from 'react';
import './TodaysFocus.css';

const suggestions = [
  "Let's learn 10 new vocabulary words!",
  "How about a quick grammar review?",
  "Practice your listening skills with a song.",
  "Try a writing exercise.",
  "Review your flashcards.",
];

const TodaysFocus = () => {
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    setSuggestion(suggestions[randomIndex]);
  }, []);

  return (
    <div className="todays-focus">
      <h2>Today's Focus</h2>
      <p>{suggestion}</p>
    </div>
  );
};

export default TodaysFocus;
