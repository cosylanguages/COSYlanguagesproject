import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {currentUser ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {currentUser.username || 'N/A'}</p>
          <p><strong>Role:</strong> {currentUser.role || 'N/A'}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default ProfilePage;
