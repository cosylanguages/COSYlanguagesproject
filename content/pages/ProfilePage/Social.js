import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import './Social.css';

const Social = () => {
  const { currentUser } = useAuth();
  const { t } = useI18n();

  return (
    <div className="social">
      <h3>{t('profile.social.title', 'Social')}</h3>
      <div className="social-row">
        <h4>{t('profile.social.friends', 'Friends')}</h4>
        <ul>
          {currentUser?.friends?.map((friend, index) => (
            <li key={index}>{friend}</li>
          ))}
        </ul>
      </div>
      <div className="social-row">
        <h4>{t('profile.social.recentActivity', 'Recent Activity')}</h4>
        <ul>
          {currentUser?.recentActivity?.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Social;
