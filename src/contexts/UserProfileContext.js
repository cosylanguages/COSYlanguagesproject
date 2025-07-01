import React, { createContext, useContext } from 'react';

const UserProfileContext = createContext();
// const USER_PROFILE_STORAGE_KEY = 'COSY_USER_PROFILE'; // Removed as no profile data is stored

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  // All states related to XP, level, streak, achievements, and lastActiveDate are removed.
  // All useEffect hooks for loading/saving profile and updating level are removed.
  // All Callbacks (addXP, reduceXP, updateStreak, checkAndAwardAchievement) are removed.
  // The ALL_ACHIEVEMENTS constant is removed.

  // The context now provides no specific values related to the removed features.
  // It remains in case other general, non-gamification user profile aspects are needed in the future.
  // If it's confirmed to be entirely unused, the Provider and its usage could be removed from App.js/index.js.
  const value = {
    // No XP, level, streak, or achievement related data is provided.
    // User preferences or other profile information could be added here if needed.
  };

  // Console logs related to profile loading/saving/updates are removed.
  // console.log("[UserProfileContext] features removed."); // Optional: for debugging this change

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
