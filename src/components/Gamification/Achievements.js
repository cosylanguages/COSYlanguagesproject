import React from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './Achievements.css';

const Achievements = () => {
  const { achievements } = useUserProfile();

  return (
    <div className="achievements-container">
      <h2>Achievements</h2>
      {achievements.length > 0 ? (
        <ul className="achievements-list">
          {achievements.map((ach, index) => (
            <li key={index} className="achievement-item">
              <div className="achievement-name">{ach.name}</div>
              <div className="achievement-description">{ach.description}</div>
              <div className="achievement-date">{new Date(ach.date).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No achievements yet. Keep learning to unlock them!</p>
      )}
    </div>
  );
};

export default Achievements;
