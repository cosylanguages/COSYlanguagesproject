import React from 'react';
import Leaderboard from '../../components/Gamification/Leaderboard';
import Achievements from '../../components/Gamification/Achievements';
import DailyStreak from '../../components/Gamification/DailyStreak';
import ProgressChart from '../../components/Gamification/ProgressChart';
import CalendarView from '../../components/Gamification/CalendarView';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import { useLocation } from 'react-router-dom';
import './GamificationPage.css';

const GamificationPage = () => {
  const { xp } = useUserProfile();
  const { t } = useI18n();
  const location = useLocation();
  const mode = location.pathname.includes('/study') ? 'study' : 'freestyle';

  // Mock user data for the leaderboard
  const users = [
    { id: 1, name: 'Alice', xp: 1500, studyScore: 2500 },
    { id: 2, name: 'Bob', xp: 1200, studyScore: 1800 },
    { id: 3, name: 'You', xp: xp, studyScore: 2200 },
    { id: 4, name: 'Charlie', xp: 900, studyScore: 1500 },
    { id: 5, name: 'David', xp: 750, studyScore: 1200 },
  ];

  const [progressData, setProgressData] = React.useState([]);

  React.useEffect(() => {
    fetch('/data/progressData.json')
      .then(response => response.json())
      .then(data => setProgressData(data));
  }, []);

  const [calendarData, setCalendarData] = React.useState({});

  React.useEffect(() => {
    fetch('/data/calendarData.json')
      .then(response => response.json())
      .then(data => setCalendarData(data));
  }, []);

  const [reviewedWordsData, setReviewedWordsData] = React.useState([]);

  React.useEffect(() => {
    fetch('/data/reviewedWordsData.json')
      .then(response => response.json())
      .then(data => setReviewedWordsData(data));
  }, []);

  const reviewedWordsChartData = {
    labels: reviewedWordsData.map(d => d.date),
    datasets: [
      {
        label: 'Reviewed Words Over Time',
        data: reviewedWordsData.map(d => d.words),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <div className="gamification-page">
      <h1><TransliterableText text={t('gamificationPage.title', 'Your Progress')} /></h1>
      <DailyStreak />
      <ProgressChart data={progressData} />
      <ProgressChart data={reviewedWordsChartData} />
      <CalendarView data={calendarData} />
      <Leaderboard users={users} mode={mode} />
      <Achievements mode={mode} />
    </div>
  );
};

export default GamificationPage;
