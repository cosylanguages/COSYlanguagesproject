// src/components/Community/CommunityHeader.js
import React from 'react';
import Button from '../Common/Button';
import './CommunityHeader.css';

const CommunityHeader = ({ onSearch, onCreatePost, onCreateEvent, t }) => {
  // TODO: The `t` function should be provided by a proper i18n context/provider.
  const translate = t || ((key) => key.split('.').pop());

  return (
    <div className="community-header">
      <div className="search-bar">
        <input type="text" placeholder={translate('community.search')} onChange={onSearch} />
      </div>
      <div className="community-header-actions">
        <Button onClick={onCreatePost} variant="contained" color="primary">
          {translate('community.createPost')}
        </Button>
        <Button onClick={onCreateEvent} variant="contained" color="secondary">
          {translate('community.createEvent')}
        </Button>
      </div>
    </div>
  );
};

export default CommunityHeader;
