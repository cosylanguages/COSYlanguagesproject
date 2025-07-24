// Import necessary libraries and components.
import React from 'react';
import './CosyStreaks.css';

/**
 * A component that displays the user's daily streak.
 * @returns {JSX.Element} The CosyStreaks component.
 */
const CosyStreaks = () => {
  // TODO: Update the streak visuals based on the user's daily progress.
  const streak = {
    days: 5,
    visual: '🧣', // Placeholder for a growing scarf
  };

  // Render the cosy streaks component.
  return (
    <div className="cosy-streaks-container">
      <h3>My Cosy Streak</h3>
      <div className="streak">
        <div className="streak-visual">{streak.visual}</div>
        <div className="streak-days">{streak.days} days</div>
      </div>
    </div>
  );
};

export default CosyStreaks;
