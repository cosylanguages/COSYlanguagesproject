import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');

  const handleSave = () => {
    // In a real app, this would save the bio to a backend
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <h3>{user.name}</h3>
      <p>Level: {user.level}</p>
      <p>XP: {user.xp}</p>
      {isEditing ? (
        <div>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <p>Bio: {bio}</p>
      )}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit Bio'}
      </button>
      <button>Add Friend</button>
    </div>
  );
};

export default UserProfile;
