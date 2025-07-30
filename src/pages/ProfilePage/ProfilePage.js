import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import UserInformation from './UserInformation';
import Settings from './Settings';
import Social from './Social';
import GamificationDashboard from '../../components/Gamification/GamificationDashboard';
import { updateUserProfile } from '../../api/api';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser, authToken } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async (newUserInfo) => {
    if (!currentUser) return;
    try {
      await updateUserProfile(authToken, currentUser.id, newUserInfo);
      alert('Profile updated successfully!');
      // Optionally, you might need to refresh the currentUser in the context
      // after a successful update, but for now, we'll just show a message.
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsEditMode(false);
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader onEdit={handleEdit} />
      <div className="profile-content">
        <div className="profile-main">
          <UserInformation user={currentUser} isEditMode={isEditMode} onSave={handleSave} />
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
