// src/pages/DashboardPage/DashboardPage.js
import React from 'react';
import TodaysFocus from '../../components/Dashboard/TodaysFocus';
import MyLearningGarden from '../../components/Dashboard/MyLearningGarden';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <TodaysFocus />
      <MyLearningGarden />
    </div>
  );
};

export default DashboardPage;
