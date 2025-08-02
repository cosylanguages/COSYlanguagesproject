// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
import './CosyStreaks.css';

/**
 * A component that displays the user's daily streak.
 * @returns {JSX.Element} The CosyStreaks component.
 */
const CosyStreaks = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    let currentStreak = parseInt(localStorage.getItem('streak') || '0', 10);

    if (lastVisit === today) {
      // No change
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    localStorage.setItem('streak', currentStreak);
    localStorage.setItem('lastVisit', today);
    setStreak(currentStreak);
  }, []);

  // Render the cosy streaks component.
  return (
    <div className="cosy-streaks-container">
      <h3>My Cosy Streak</h3>
      <div className="streak">
        <div className="streak-visual">🔥</div>
        <div className="streak-days">{streak} Day{streak !== 1 ? 's' : ''} in a row!</div>
      </div>
    </div>
  );
};

export default CosyStreaks;
