// Import necessary libraries and components.
import React from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './DailyStreak.css';

/**
 * A component that displays the user's daily streak.
 * @returns {JSX.Element} The DailyStreak component.
 */
const DailyStreak = () => {
  const { streak } = useUserProfile();

  // Render the daily streak component.
  return (
    <div className="daily-streak">
      <h3>Daily Streak</h3>
      <div className="streak-count">{streak}</div>
      <p>Keep it up to earn rewards!</p>
    </div>
  );
};

export default DailyStreak;
