import React from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './DailyStreak.css';

const DailyStreak = () => {
  const { streak } = useUserProfile();

  return (
    <div className="daily-streak">
      <h3>Daily Streak</h3>
      <div className="streak-count">{streak}</div>
      <p>Keep it up to earn rewards!</p>
    </div>
  );
};

export default DailyStreak;
