// src/pages/ProfilePage/UserInformation.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../api/api';
import Button from '../../components/Common/Button';
import './UserInformation.css';

const UserInformation = ({ isEditMode, onSave }) => {
  const { currentUser, authToken } = useAuth();
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  const handleSave = async () => {
    try {
      await updateUserProfile(authToken, currentUser.id, { username, email });
      onSave({ username, email });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="user-information">
      <h3>User Information</h3>
      <div className="user-info-row">
        <span className="user-info-label">Username:</span>
        {isEditMode ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <span className="user-info-value">{username}</span>
        )}
      </div>
      <div className="user-info-row">
        <span className="user-info-label">Email:</span>
        {isEditMode ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <span className="user-info-value">{email}</span>
        )}
      </div>
      {isEditMode && (
        <div className="user-info-actions">
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserInformation;
