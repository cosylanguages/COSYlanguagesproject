import React from 'react';
import Forum from '../../components/Community/Forum';
import './CommunityPage.css';

const CommunityPage = () => {
  return (
    <div className="community-page">
      <h1>Community Hub</h1>
      <Forum />
    </div>
  );
};

export default CommunityPage;
