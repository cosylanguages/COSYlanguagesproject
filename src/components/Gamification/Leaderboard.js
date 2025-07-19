import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ users }) => {
  const sortedUsers = users.sort((a, b) => b.xp - a.xp);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ol>
        {sortedUsers.map((user, index) => (
          <li key={user.id}>
            <span className="leaderboard-rank">{index + 1}</span>
            <span className="leaderboard-name">{user.name}</span>
            <span className="leaderboard-xp">{user.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
