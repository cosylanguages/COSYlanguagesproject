// src/components/Community/CommunityHeader.js
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Button from '../Common/Button';
import './CommunityHeader.css';

const CommunityHeader = ({ onSearch, onCreatePost, onCreateEvent }) => {
  const { t } = useI18n();

  return (
    <div className="community-header">
      <div className="search-bar">
        <input type="text" placeholder={t('community.search', 'Search...')} onChange={onSearch} />
      </div>
      <div className="community-header-actions">
        <Button onClick={onCreatePost} variant="contained" color="primary">
          {t('community.createPost', 'Create Post')}
        </Button>
        <Button onClick={onCreateEvent} variant="contained" color="secondary">
          {t('community.createEvent', 'Create Event')}
        </Button>
      </div>
    </div>
  );
};

export default CommunityHeader;
