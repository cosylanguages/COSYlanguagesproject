// src/components/Community/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h4>Recommended Groups</h4>
        <ul>
          <li>Group A</li>
          <li>Group B</li>
          <li>Group C</li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h4>Recommended Users</h4>
        <ul>
          <li>User A</li>
          <li>User B</li>
          <li>User C</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
