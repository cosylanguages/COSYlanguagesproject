// src/pages/ProfilePage/Settings.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { updateUserSettings } from '../../api/api';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const { currentUser, authToken, logout } = useAuth();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSettingChange = async (setting, value) => {
    try {
      await updateUserSettings(authToken, currentUser.id, { [setting]: value });
      console.log(`Setting ${setting} updated to ${value}`);
      toast.success(`Setting ${setting} updated successfully!`);
    } catch (error) {
      console.error(`Failed to update setting ${setting}:`, error);
      toast.error(`Failed to update setting ${setting}.`);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await updateUserSettings(authToken, currentUser.id, { deleteAccount: true });
      toast.success('Account deleted successfully.');
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="settings">
        <h3>{t('profile.settings.title', 'Settings')}</h3>
        <div className="setting-row">
          <label htmlFor="notifications">{t('profile.settings.enableNotifications', 'Enable Notifications')}</label>
          <input
            type="checkbox"
            id="notifications"
            onChange={(e) => handleSettingChange('notifications', e.target.checked)}
          />
        </div>
        <div className="setting-row">
          <Button className="button--danger" onClick={() => setIsModalOpen(true)}>
            {t('profile.settings.deleteAccountButton', 'Delete Account')}
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3>{t('profile.settings.deleteModal.title', 'Confirm Account Deletion')}</h3>
          <p>
            {t('profile.settings.deleteModal.message', 'Are you sure you want to delete your account? This action is irreversible.')}
          </p>
          <div className="modal-actions">
            <Button onClick={() => setIsModalOpen(false)} className="button--secondary">
              {t('profile.settings.deleteModal.cancelButton', 'Cancel')}
            </Button>
            <Button onClick={handleConfirmDelete} className="button--danger">
              {t('profile.settings.deleteModal.confirmButton', 'Confirm Delete')}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Settings;
