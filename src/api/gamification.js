import apiClient from './apiClient';

export const getLeaderboard = async () => {
    const response = await apiClient.get('/leaderboard');
    return response.data;
};

export const getAchievements = async () => {
    const response = await apiClient.get('/achievements');
    return response.data;
};

export const getDailyStreak = async () => {
    const response = await apiClient.get('/daily-streak');
    return response.data;
};

export const getProgressChart = async () => {
    const response = await apiClient.get('/progress-chart');
    return response.data;
};

export const getCalendarData = async () => {
    const response = await apiClient.get('/calendar-data');
    return response.data;
};

export const getReviewedWords = async () => {
    const response = await apiClient.get('/reviewed-words');
    return response.data;
};
