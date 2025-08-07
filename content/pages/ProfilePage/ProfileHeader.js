import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../../components/Common/Button';
import './ProfileHeader.css';

const ProfileHeader = ({ onEdit }) => {
  const { currentUser } = useAuth();
  const { t } = useI18n();

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <img src={currentUser?.avatar || 'https://via.placeholder.com/150'} alt={t('profile.avatarAlt', "User's avatar")} />
      </div>
      <div className="profile-user-info">
        <h2>{currentUser?.username || 'N/A'}</h2>
        <p>{currentUser?.role || 'N/A'}</p>
      </div>
      <div className="profile-header-actions">
        <Button onClick={onEdit} variant="contained" color="primary">
          {t('profile.editButton', 'Edit Profile')}
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
