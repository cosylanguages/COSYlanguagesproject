import React, { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard';
import Achievements from './Achievements';
import DailyStreak from './DailyStreak';
import ProgressChart from './ProgressChart';
import CalendarView from './CalendarView';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useI18n } from '../../i18n/I18nContext';
import { useLocation } from 'react-router-dom';
import {
    getLeaderboard,
    getAchievements,
    getDailyStreak,
    getProgressChart,
    getCalendarData,
    getReviewedWords,
} from '../../api/gamification';

const ProgressDashboard = () => {
    const { xp } = useUserProfile();
    const { t } = useI18n();
    const location = useLocation();
    const mode = location.pathname.includes('/study') ? 'study' : 'freestyle';

    const [leaderboard, setLeaderboard] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [dailyStreak, setDailyStreak] = useState({});
    const [progressChart, setProgressChart] = useState({});
    const [calendarData, setCalendarData] = useState({});
    const [reviewedWords, setReviewedWords] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const leaderboardData = await getLeaderboard();
            setLeaderboard(leaderboardData);

            const achievementsData = await getAchievements();
            setAchievements(achievementsData);

            const dailyStreakData = await getDailyStreak();
            setDailyStreak(dailyStreakData);

            const progressChartData = await getProgressChart();
            setProgressChart(progressChartData);

            const calendarData = await getCalendarData();
            setCalendarData(calendarData);

            const reviewedWordsData = await getReviewedWords();
            setReviewedWords(reviewedWordsData);
        };

        fetchData();
    }, []);

    return (
        <div className="progress-dashboard">
            <DailyStreak data={dailyStreak} />
            <ProgressChart data={progressChart} />
            <ProgressChart data={reviewedWords} />
            <CalendarView data={calendarData} />
            <Leaderboard
                users={leaderboard}
                sortKey={mode === 'study' ? 'studyScore' : 'xp'}
                title="Leaderboard"
                helpTitle="leaderboard.help.title"
                helpContent="leaderboard.help.content"
            />
            <Achievements achievements={achievements} mode={mode} />
        </div>
    );
};

export default ProgressDashboard;
