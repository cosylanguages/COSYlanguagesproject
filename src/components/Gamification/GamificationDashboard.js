// src/components/Gamification/GamificationDashboard.js
import React from 'react';
import TodaysFocus from '../../pages/StudyMode/PersonalizationPage/components/TodaysFocus';
import MyLearningGarden from './MyLearningGarden';
// import CosyCorner from '../Community/CosyCorner';
import LanguagePet from './LanguagePet';
import SouvenirCollection from './SouvenirCollection';
import CosyStreaks from './CosyStreaks';

const GamificationDashboard = () => {
  return (
    <div className="cosy-dashboard">
      <TodaysFocus />
      <MyLearningGarden />
      {/* <CosyCorner /> */}
      <LanguagePet />
      <SouvenirCollection />
      <CosyStreaks />
    </div>
  );
};

export default GamificationDashboard;
