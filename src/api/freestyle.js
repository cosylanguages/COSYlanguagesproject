import apiClient from './apiClient';

export const getFreestyleProgress = async (userId) => {
  const response = await apiClient.get(`/freestyle-progress/${userId}`);
  return response.data;
};

export const updateFreestyleProgress = async (userId, progress) => {
  const response = await apiClient.put(`/freestyle-progress/${userId}`, { progress });
  return response.data;
};

export const getBoosterPacks = async () => {
  const response = await apiClient.get('/booster-packs');
  return response.data;
};

export const createBoosterPack = async (packData) => {
  const response = await apiClient.post('/booster-packs', packData);
  return response.data;
};

export const deleteBoosterPack = async (packId) => {
  const response = await apiClient.delete(`/booster-packs/${packId}`);
  return response.data;
};
