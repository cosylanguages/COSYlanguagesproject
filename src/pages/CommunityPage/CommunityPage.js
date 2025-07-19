import React from 'react';
import Forum from '../../components/Community/Forum';
import LanguagePartnerFinder from '../../components/Community/LanguagePartnerFinder';
import './CommunityPage.css';

const CommunityPage = () => {
  return (
    <div className="community-page">
      <h1>Community Hub</h1>
      <Forum />
      <LanguagePartnerFinder />
    </div>
  );
};

export default CommunityPage;
