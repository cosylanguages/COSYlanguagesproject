// src/api/profile.js
export const getUserProfile = async (authToken, userId) => {
  // TODO: Implement this function to fetch the user's profile from the API.
  // This is a placeholder. In a real application, you would make an API call.
  console.log('Fetching user profile for userId:', userId);
  return Promise.resolve({
    id: userId,
    username: 'testuser',
    email: 'testuser@example.com',
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50', // a generic gravatar
    role: 'student',
    friends: ['Friend 1', 'Friend 2', 'Friend 3'],
    recentActivity: ['Posted in the community forum', 'Completed a lesson', 'Made a new friend'],
  });
};

export const updateUserProfile = async (authToken, userId, profileData) => {
  // This is a placeholder. In a real application, you would make an API call.
  console.log('Updating user profile for userId:', userId, 'with data:', profileData);
  return Promise.resolve({ id: userId, ...profileData });
};

export const updateUserSettings = async (authToken, userId, settingsData) => {
  // This is a placeholder. In a real application, you would make an API call.
  console.log('Updating user settings for userId:', userId, 'with data:', settingsData);
  return Promise.resolve({ id: userId, ...settingsData });
};
