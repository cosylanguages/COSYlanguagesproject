import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ users, mode }) => {
  const sortedUsers = users.sort((a, b) => {
    if (mode === 'study') {
      return b.studyScore - a.studyScore;
    }
    return b.xp - a.xp;
  });

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
