// src/components/Community/CommunityHeader.js
import React from 'react';
import Button from '../Common/Button';
import './CommunityHeader.css';

const CommunityHeader = ({ onSearch, onCreatePost, onCreateEvent }) => {
  return (
    <div className="community-header">
      <div className="search-bar">
        <input type="text" placeholder="Search..." onChange={onSearch} />
      </div>
      <div className="community-header-actions">
        <Button onClick={onCreatePost} variant="contained" color="primary">
          Create Post
        </Button>
        <Button onClick={onCreateEvent} variant="contained" color="secondary">
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default CommunityHeader;
