import React from 'react';
import Leaderboard from '../../components/Gamification/Leaderboard';
import Achievements from '../../components/Gamification/Achievements';
import DailyStreak from '../../components/Gamification/DailyStreak';
import ProgressChart from '../../components/Gamification/ProgressChart';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './GamificationPage.css';

const GamificationPage = () => {
  const { xp } = useUserProfile();

  // Mock user data for the leaderboard
  const users = [
    { id: 1, name: 'Alice', xp: 1500 },
    { id: 2, name: 'Bob', xp: 1200 },
    { id: 3, name: 'You', xp: xp },
    { id: 4, name: 'Charlie', xp: 900 },
    { id: 5, name: 'David', xp: 750 },
  ];

  // Mock progress data for the chart
  const progressData = [
    { date: '2023-01-01', xp: 100 },
    { date: '2023-01-02', xp: 150 },
    { date: '2023-01-03', xp: 220 },
    { date: '2023-01-04', xp: 300 },
    { date: '2023-01-05', xp: 450 },
  ];

  return (
    <div className="gamification-page">
      <h1>Your Progress</h1>
      <DailyStreak />
      <ProgressChart data={progressData} />
      <Leaderboard users={users} />
      <Achievements />
    </div>
  );
};

export default GamificationPage;
