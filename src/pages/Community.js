import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import CommunityHeader from '../components/Community/CommunityHeader';
import Tabs from '../components/Common/Tabs';
import Feed from '../components/Community/Feed';
import EventCalendar from '../components/EventCalendar';
import Groups from '../components/Community/Groups';
import Users from '../components/Community/Users';
import Sidebar from '../components/Community/Sidebar';
import Modal from '../components/Common/Modal';
import CreatePost from '../components/CreatePost';
import EventForm from '../components/EventForm';

const Community = () => {
  const { t } = useI18n();
  const { currentUser } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const handleSearch = (query) => {
    // TODO: Implement search logic. This should probably filter the content
    // of the currently active tab (Feed, Events, Groups, or Users).
    console.log('Searching for:', query);
  };

  const handleCreatePost = () => {
    setIsCreatePostModalOpen(true);
  };

  const handleCreateEvent = () => {
    setIsCreateEventModalOpen(true);
  };

  return (
    <div className="community-page">
      <CommunityHeader
        onSearch={handleSearch}
        onCreatePost={handleCreatePost}
        onCreateEvent={handleCreateEvent}
      />
      <div className="community-content">
        <div className="community-main">
          <Tabs>
            <div label={t('community.tabs.feed', 'Feed')}>
              <Feed />
            </div>
            <div label={t('community.tabs.events', 'Events')}>
              <EventCalendar />
            </div>
            <div label={t('community.tabs.groups', 'Groups')}>
              <Groups />
            </div>
            <div label={t('community.tabs.users', 'Users')}>
              <Users />
            </div>
          </Tabs>
        </div>
        <div className="community-sidebar">
          <Sidebar />
        </div>
      </div>
      {isCreatePostModalOpen && (
        <Modal isOpen={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)}>
          <CreatePost userId={currentUser?.id} />
        </Modal>
      )}
      {isCreateEventModalOpen && (
        <Modal isOpen={isCreateEventModalOpen} onClose={() => setIsCreateEventModalOpen(false)}>
          <EventForm />
        </Modal>
      )}
    </div>
  );
};

export default Community;
