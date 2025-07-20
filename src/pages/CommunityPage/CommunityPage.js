import React from 'react';
import Forum from '../../components/Community/Forum';
import LanguagePartnerFinder from '../../components/Community/LanguagePartnerFinder';
import UserProfile from '../../components/Community/UserProfile';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import './CommunityPage.css';

const CommunityPage = () => {
  const { t } = useI18n();

  const user = {
    name: 'John Doe',
    level: 5,
    xp: 2500,
  };

  return (
    <div className="community-page">
      <h1><TransliterableText text={t('communityPage.title', 'Community Hub')} /></h1>
      <UserProfile user={user} />
      <Forum />
      <LanguagePartnerFinder />
    </div>
  );
};

export default CommunityPage;
