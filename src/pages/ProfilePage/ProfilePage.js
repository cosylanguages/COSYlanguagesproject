import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import UserInformation from './UserInformation';
import Settings from './Settings';
import Social from './Social';
import GamificationDashboard from '../../components/Gamification/GamificationDashboard';
import './ProfilePage.css';

function ProfilePage() {
  useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = (newUserInfo) => {
    // Here you would typically call an API to save the new user info.
    console.log('Saving user info:', newUserInfo);
    setIsEditMode(false);
  };

  return (
    <div className="profile-page">
      <ProfileHeader onEdit={handleEdit} />
      <div className="profile-content">
        <div className="profile-main">
          <UserInformation isEditMode={isEditMode} onSave={handleSave} />
          <Settings />
          <Social />
        </div>
        <div className="profile-sidebar">
          <GamificationDashboard />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
