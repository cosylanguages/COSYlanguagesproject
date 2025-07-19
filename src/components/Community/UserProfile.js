import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
      <h3>{user.name}</h3>
      <p>Level: {user.level}</p>
      <p>XP: {user.xp}</p>
      <button>Add Friend</button>
    </div>
  );
};

export default UserProfile;
