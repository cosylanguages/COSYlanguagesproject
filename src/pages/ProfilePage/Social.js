// src/pages/ProfilePage/Social.js
import React from 'react';
import './Social.css';

const Social = () => {
  return (
    <div className="social">
      <h3>Social</h3>
      <div className="social-row">
        <h4>Friends</h4>
        <ul>
          <li>Friend 1</li>
          <li>Friend 2</li>
          <li>Friend 3</li>
        </ul>
      </div>
      <div className="social-row">
        <h4>Recent Activity</h4>
        <ul>
          <li>Posted in the community forum</li>
          <li>Completed a lesson</li>
          <li>Made a new friend</li>
        </ul>
      </div>
    </div>
  );
};

export default Social;
