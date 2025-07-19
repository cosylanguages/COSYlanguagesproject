import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

const UserProfileContext = createContext();
const USER_PROFILE_STORAGE_KEY = 'COSY_USER_PROFILE';

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [lastActiveDate, setLastActiveDate] = useState(null);

  const ALL_ACHIEVEMENTS = {
    firstLogin: { name: "Welcome!", description: "You logged in for the first time." },
    firstStreak: { name: "On Fire!", description: "You started your first daily streak." },
  };

  useEffect(() => {
    const loadedProfile = JSON.parse(localStorage.getItem(USER_PROFILE_STORAGE_KEY));
    if (loadedProfile) {
      setXp(loadedProfile.xp);
      setLevel(loadedProfile.level);
      setStreak(loadedProfile.streak);
      setAchievements(loadedProfile.achievements);
      setLastActiveDate(loadedProfile.lastActiveDate);
    }
  }, []);

  useEffect(() => {
    const profileData = JSON.stringify({ xp, level, streak, achievements, lastActiveDate });
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, profileData);
  }, [xp, level, streak, achievements, lastActiveDate]);

  const addXP = useCallback((amount) => {
    setXp(prevXp => prevXp + amount);
  }, []);

  const reduceXP = useCallback((amount) => {
    setXp(prevXp => Math.max(0, prevXp - amount));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActiveDate === yesterday.toDateString()) {
        setStreak(prevStreak => prevStreak + 1);
      } else {
        setStreak(1);
      }
      setLastActiveDate(today);
      checkAndAwardAchievement('firstStreak');
    }
  }, [lastActiveDate]);

  const checkAndAwardAchievement = useCallback((achievementKey) => {
    if (!achievements.find(a => a.key === achievementKey)) {
      const achievement = ALL_ACHIEVEMENTS[achievementKey];
      if (achievement) {
        setAchievements(prev => [...prev, { key: achievementKey, ...achievement, date: new Date() }]);
      }
    }
  }, [achievements, ALL_ACHIEVEMENTS]);

  const value = {
    xp,
    level,
    streak,
    achievements,
    addXP,
    reduceXP,
    updateStreak,
    checkAndAwardAchievement,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
