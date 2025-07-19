import React from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './FreestyleProgress.css';

const FreestyleProgress = () => {
  const { xp, level } = useUserProfile();

  return (
    <div className="freestyle-progress">
      <div className="progress-item">
        <span className="progress-label">Level</span>
        <span className="progress-value">{level}</span>
      </div>
      <div className="progress-item">
        <span className="progress-label">XP</span>
        <span className="progress-value">{xp}</span>
      </div>
    </div>
  );
};

export default FreestyleProgress;
