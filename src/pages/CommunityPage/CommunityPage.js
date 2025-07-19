import React from 'react';
import Forum from '../../components/Community/Forum';
import LanguagePartnerFinder from '../../components/Community/LanguagePartnerFinder';
import UserProfile from '../../components/Community/UserProfile';
import './CommunityPage.css';

const CommunityPage = () => {
  const user = {
    name: 'John Doe',
    level: 5,
    xp: 2500,
  };

  return (
    <div className="community-page">
      <h1>Community Hub</h1>
      <UserProfile user={user} />
      <Forum />
      <LanguagePartnerFinder />
    </div>
  );
};

export default CommunityPage;
