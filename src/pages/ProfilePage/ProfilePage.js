import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import UserInformation from './UserInformation';
import Settings from './Settings';
import Social from './Social';
import GamificationDashboard from '../../components/Gamification/GamificationDashboard';
import { updateUserProfile } from '../../api/api';
import Tabs from '../../components/Common/Tabs';
import { useI18n } from '../../i18n/I18nContext';
import toast from 'react-hot-toast';
import MyStudySetsPage from '../MyStudySetsPage/MyStudySetsPage';
import LanguageDashboard from './LanguageDashboard';
import UserFeed from '../../components/Community/UserFeed';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser, authToken, refreshCurrentUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const { t } = useI18n();

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async (newUserInfo) => {
    if (!currentUser) return;
    try {
      await updateUserProfile(authToken, currentUser.id, newUserInfo);
      refreshCurrentUser(newUserInfo);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsEditMode(false);
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader onEdit={handleEdit} />
      <div className="profile-content">
        <div className="profile-main">
          <Tabs>
            <div label={t('profile.tabs.userInformation', 'User Information')}>
              <UserInformation user={currentUser} isEditMode={isEditMode} onSave={handleSave} />
            </div>
            <div label={t('profile.tabs.myStudySets', 'My Study Sets')}>
              <MyStudySetsPage />
            </div>
            <div label={t('profile.tabs.settings', 'Settings')}>
              <Settings />
            </div>
            <div label={t('profile.tabs.social', 'Social')}>
              <Social />
            </div>
            <div label={t('profile.tabs.languages', 'Languages')}>
              <LanguageDashboard />
            </div>
            <div label={t('profile.tabs.myPosts', 'My Posts')}>
              <UserFeed userId={currentUser?.id} />
            </div>
          </Tabs>
        </div>
        <div className="profile-sidebar">
          <GamificationDashboard />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
