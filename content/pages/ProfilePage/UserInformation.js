import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../../components/Common/Button';
import './UserInformation.css';

const UserInformation = ({ user, isEditMode, onSave }) => {
  const { t } = useI18n();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSaveClick = () => {
    onSave({ username, email });
  };

  return (
    <div className="user-information">
      <h3>{t('profile.userInfo.title', 'User Information')}</h3>
      <div className="user-info-row">
        <span className="user-info-label">{t('profile.userInfo.usernameLabel', 'Username:')}</span>
        {isEditMode ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <span className="user-info-value">{user?.username}</span>
        )}
      </div>
      <div className="user-info-row">
        <span className="user-info-label">{t('profile.userInfo.emailLabel', 'Email:')}</span>
        {isEditMode ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <span className="user-info-value">{user?.email}</span>
        )}
      </div>
      {isEditMode && (
        <div className="user-info-actions">
          <Button onClick={handleSaveClick} variant="contained" color="primary">
            {t('profile.userInfo.saveButton', 'Save Changes')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserInformation;
