import React from 'react';
import Feed from '../../components/Community/Feed';
import './CommunityPage.css';

// This is the main component for the Community page.
// It displays a feed of posts from the community.
function CommunityPage() {
  return (
    <div className="community-container">
      <h1 className="community-header">Community</h1>
      <Feed />
    </div>
  );
}

export default CommunityPage;
