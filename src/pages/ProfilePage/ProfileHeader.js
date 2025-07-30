// src/pages/ProfilePage/ProfileHeader.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Common/Button';
import './ProfileHeader.css';

const ProfileHeader = ({ onEdit }) => {
  const { currentUser } = useAuth();

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        {/* Placeholder for avatar */}
        <img src="https://via.placeholder.com/150" alt="User avatar" />
      </div>
      <div className="profile-user-info">
        <h2>{currentUser?.username || 'N/A'}</h2>
        <p>{currentUser?.role || 'N/A'}</p>
      </div>
      <div className="profile-header-actions">
        <Button onClick={onEdit} variant="contained" color="primary">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
