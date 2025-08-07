// Import necessary libraries and components.
import React, { useState } from 'react';
import './Leaderboard.css';
import HelpModal from '../Common/HelpModal';
import TransliterableText from '../Common/TransliterableText';

/**
 * A component that displays a leaderboard of users.
 * The users can be sorted by their XP or study score.
 * @param {object} props - The component's props.
 * @param {Array} props.users - An array of user objects.
 * @param {string} props.mode - The mode to sort the users by ('study' or 'freestyle').
 * @returns {JSX.Element} The Leaderboard component.
 */
const Leaderboard = ({ users, sortKey, title, helpTitle, helpContent }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  // Sort the users based on the selected sort key.
  const sortedUsers = users.sort((a, b) => b[sortKey] - a[sortKey]);

  // Render the leaderboard.
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2><TransliterableText text={title} /></h2>
        <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
      </div>
      <ol>
        {sortedUsers.map((user, index) => (
          <li key={user.id}>
            <span className="leaderboard-rank">{index + 1}</span>
            <span className="leaderboard-name">{user.name}</span>
            <span className="leaderboard-xp">
              {user[sortKey]}
            </span>
          </li>
        ))}
      </ol>
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title={helpTitle}
        content={helpContent}
      />
    </div>
  );
};

export default Leaderboard;
