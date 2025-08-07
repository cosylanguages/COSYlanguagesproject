import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import Feed from '../components/Community/Feed';
import CreatePost from '../components/CreatePost';
import StudyLayout from '../components/Layout/StudyLayout';
import './Community.css';

const Community = () => {
  const { t } = useI18n();

  return (
    <StudyLayout>
      <div className="community-page">
        <div className="community-header">
          <h1>{t('community.title', 'Community')}</h1>
        </div>
        <div className="community-main">
          <CreatePost />
          <Feed />
        </div>
      </div>
    </StudyLayout>
  );
};

export default Community;
