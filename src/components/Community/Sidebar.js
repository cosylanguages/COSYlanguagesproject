// src/components/Community/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ t }) => {
  // TODO: The `t` function should be provided by a proper i18n context/provider.
  const translate = t || ((key) => key.split('.').pop());

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h4>{translate('sidebar.recommendedGroups')}</h4>
        {/* TODO: Fetch and display recommended groups from the API */}
        <p>{translate('sidebar.recommendedGroupsPlaceholder')}</p>
      </div>
      <div className="sidebar-section">
        <h4>{translate('sidebar.recommendedUsers')}</h4>
        {/* TODO: Fetch and display recommended users from the API */}
        <p>{translate('sidebar.recommendedUsersPlaceholder')}</p>
      </div>
    </div>
  );
};

export default Sidebar;
