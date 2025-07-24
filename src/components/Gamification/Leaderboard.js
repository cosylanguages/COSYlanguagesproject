// Import necessary libraries and components.
import React from 'react';
import './Leaderboard.css';

/**
 * A component that displays a leaderboard of users.
 * The users can be sorted by their XP or study score.
 * @param {object} props - The component's props.
 * @param {Array} props.users - An array of user objects.
 * @param {string} props.mode - The mode to sort the users by ('study' or 'freestyle').
 * @returns {JSX.Element} The Leaderboard component.
 */
const Leaderboard = ({ users, mode }) => {
  // Sort the users based on the selected mode.
  const sortedUsers = users.sort((a, b) => {
    if (mode === 'study') {
      return b.studyScore - a.studyScore;
    }
    return b.xp - a.xp;
  });

  // Render the leaderboard.
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ol>
        {sortedUsers.map((user, index) => (
          <li key={user.id}>
            <span className="leaderboard-rank">{index + 1}</span>
            <span className="leaderboard-name">{user.name}</span>
            <span className="leaderboard-xp">
              {mode === 'study' ? `${user.studyScore} Study Score` : `${user.xp} XP`}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
