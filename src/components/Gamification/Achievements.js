// Import necessary libraries and components.
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './Achievements.css';

/**
 * A component that displays the user's achievements.
 * @param {object} props - The component's props.
 * @param {string} props.mode - The mode to filter achievements by (e.g., 'freestyle' or 'study').
 * @returns {JSX.Element} The Achievements component.
 */
const Achievements = ({ mode }) => {
  const { achievements } = useUserProfile();
  const [allAchievements, setAllAchievements] = useState([]);

  // Fetch all possible achievements from the JSON files when the component mounts.
  useEffect(() => {
    const fetchAchievements = async () => {
        try {
            const freestyleResponse = await fetch('/data/achievements.json');
            const freestyleAchievements = await freestyleResponse.json();

            const studyResponse = await fetch('/data/study_mode_achievements.json');
            const studyAchievements = await studyResponse.json();

            setAllAchievements([...freestyleAchievements, ...studyAchievements]);
        } catch (error) {
            console.error("Failed to load achievements:", error);
        }
    };

    fetchAchievements();
  }, []);

  // Filter the achievements to show only the ones the user has unlocked.
  const unlockedAchievements = allAchievements.filter(ach => achievements.includes(ach.id));

  // Further filter the achievements by the selected mode, if any.
  const filteredAchievements = mode ? unlockedAchievements.filter(ach => ach.mode === mode) : unlockedAchievements;

  // Render the achievements component.
  return (
    <div className="achievements-container">
      <h2>Achievements</h2>
      {filteredAchievements.length > 0 ? (
        <ul className="achievements-list">
          {filteredAchievements.map((ach, index) => (
            <li key={index} className={`achievement-item ${ach.mode === 'study' ? 'study-achievement' : ''}`}>
              <div className="achievement-name">{ach.name}</div>
              <div className="achievement-description">{ach.description}</div>
              {ach.mode === 'study' && <div className="achievement-mode">Study Mode</div>}
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
