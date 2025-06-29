import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserProfileContext = createContext();
const USER_PROFILE_STORAGE_KEY = 'COSY_USER_PROFILE';

// Example: Achievements could be loaded from a JSON or defined here
// For simplicity, defining a basic structure. Real one would be in a separate file.
const ALL_ACHIEVEMENTS = {
  STREAK_3_DAYS: { id: 'STREAK_3_DAYS', name: '3-Day Streak!', description: 'Maintained a 3-day learning streak.', criteria: { type: 'streak', value: 3 }, icon: '🔥' },
  LEVEL_5: { id: 'LEVEL_5', name: 'Level 5 Reached', description: 'Reached learning level 5.', criteria: { type: 'level', value: 5 }, icon: '🌟' },
  // Add more achievements as defined in the old achievements-data.js
};


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
  const [lastActiveDate, setLastActiveDate] = useState(null); // Store as YYYY-MM-DD string
  const [achievements, setAchievements] = useState([]); // Array of achievement IDs awarded

  // Load profile from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setXp(profile.xp || 0);
        setLevel(profile.level || 1);
        setStreak(profile.streak || 0);
        setLastActiveDate(profile.lastActiveDate || null);
        setAchievements(profile.achievements || []);
      }
      console.log("[UserProfileContext] Profile loaded:", savedProfile ? JSON.parse(savedProfile) : {});
    } catch (error) {
      console.error("[UserProfileContext] Error loading user profile:", error);
    }
  }, []);

  // Save profile to localStorage
  useEffect(() => {
    try {
      const profileData = { xp, level, streak, lastActiveDate, achievements };
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      console.log("[UserProfileContext] Profile saved:", profileData);
    } catch (error) {
      console.error("[UserProfileContext] Error saving user profile:", error);
    }
  }, [xp, level, streak, lastActiveDate, achievements]);

  // Update level whenever XP changes
  useEffect(() => {
    const newLevel = Math.floor(xp / 50) + 1; // As per old GameState logic
    if (newLevel !== level) {
      setLevel(newLevel);
      // Potentially trigger level up notification or check for level-based achievements
      console.log(`[UserProfileContext] Level up! New level: ${newLevel}`);
      // checkAndAwardAchievement('LEVEL_UP', newLevel); // Example call
    }
  }, [xp, level]);


  const addXP = useCallback((amount) => {
    setXp(prevXp => prevXp + amount);
  }, []);

  const reduceXP = useCallback((amount) => {
    setXp(prevXp => Math.max(0, prevXp - amount));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    if (lastActiveDate === todayStr) {
      console.log("[UserProfileContext] Already active today, streak maintained.");
      return; // Already active today
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setLastActiveDate(todayStr);

    if (lastActiveDate === yesterdayStr) {
      setStreak(prevStreak => {
        const newStreak = prevStreak + 1;
        // checkAndAwardAchievement('STREAK', newStreak); // Example
        console.log(`[UserProfileContext] Streak extended to ${newStreak} days.`);
        return newStreak;
      });
    } else {
      console.log("[UserProfileContext] Streak reset to 1 day.");
      setStreak(1); // Reset streak to 1 if not consecutive
      // checkAndAwardAchievement('STREAK', 1); // Example
    }
  }, [lastActiveDate]);
  
  const checkAndAwardAchievement = useCallback((achievementId) => {
    const achievement = ALL_ACHIEVEMENTS[achievementId];
    if (!achievement || achievements.includes(achievementId)) {
      return; // Achievement doesn't exist or already awarded
    }

    let criteriaMet = false;
    if (achievement.criteria.type === 'level' && level >= achievement.criteria.value) {
      criteriaMet = true;
    } else if (achievement.criteria.type === 'streak' && streak >= achievement.criteria.value) {
      criteriaMet = true;
    }
    // Add other criteria types: lessons completed, items mastered (from SRS context) etc.

    if (criteriaMet) {
      setAchievements(prevAchievements => {
        if (!prevAchievements.includes(achievementId)) {
          console.log(`[UserProfileContext] Achievement Unlocked: ${achievement.name}`);
          // TODO: Trigger a notification to the user
          return [...prevAchievements, achievementId];
        }
        return prevAchievements;
      });
    }
  }, [achievements, level, streak]);

  // Periodically check for achievements that might be met by current state
  useEffect(() => {
    Object.keys(ALL_ACHIEVEMENTS).forEach(achId => {
        checkAndAwardAchievement(achId);
    });
  }, [level, streak, checkAndAwardAchievement]);


  const value = {
    xp,
    level,
    streak,
    lastActiveDate,
    achievements, // Awarded achievement IDs
    allAchievementDefinitions: ALL_ACHIEVEMENTS, // All possible achievements
    addXP,
    reduceXP,
    updateStreak, // Call this when the app becomes active or a key daily action is performed
    checkAndAwardAchievement, // Can be called explicitly too
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
