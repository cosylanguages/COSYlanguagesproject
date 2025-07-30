// src/pages/ProfilePage/Settings.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserSettings } from '../../api/api';
import './Settings.css';

const Settings = () => {
  const { currentUser, authToken } = useAuth();

  const handleSettingChange = async (setting, value) => {
    try {
      await updateUserSettings(authToken, currentUser.id, { [setting]: value });
      console.log(`Setting ${setting} updated to ${value}`);
    } catch (error) {
      console.error(`Failed to update setting ${setting}:`, error);
    }
  };

  return (
    <div className="settings">
      <h3>Settings</h3>
      <div className="setting-row">
        <label htmlFor="notifications">Enable Notifications</label>
        <input
          type="checkbox"
          id="notifications"
          onChange={(e) => handleSettingChange('notifications', e.target.checked)}
        />
      </div>
      <div className="setting-row">
        <label htmlFor="theme">Theme</label>
        <select id="theme" onChange={(e) => handleSettingChange('theme', e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="setting-row">
        <button className="btn btn-danger" onClick={() => handleSettingChange('deleteAccount', true)}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
