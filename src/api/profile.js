import apiClient from './apiClient';

export const getUserProfile = async (authToken, userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
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
