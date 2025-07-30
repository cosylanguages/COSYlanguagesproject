// src/components/Community/Groups.js
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './Groups.css';

const Groups = () => {
  const { t } = useI18n();
  return (
    <div className="groups placeholder-container">
      <h3>{t('community.groups.title', 'Groups')}</h3>
      <p>{t('community.groups.comingSoon', 'The Groups feature is coming soon!')}</p>
    </div>
  );
};

export default Groups;
