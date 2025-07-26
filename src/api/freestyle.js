import axios from 'axios';

const API_URL = 'http://localhost:3001';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getFreestyleProgress = async (token, userId) => {
  const response = await axios.get(`${API_URL}/freestyle-progress/${userId}`, getAuthHeaders(token));
  return response.data;
};

export const updateFreestyleProgress = async (token, userId, progress) => {
  const response = await axios.put(`${API_URL}/freestyle-progress/${userId}`, { progress }, getAuthHeaders(token));
  return response.data;
};

export const getBoosterPacks = async (token) => {
  const response = await axios.get(`${API_URL}/booster-packs`, getAuthHeaders(token));
  return response.data;
};

export const createBoosterPack = async (token, packData) => {
  const response = await axios.post(`${API_URL}/booster-packs`, packData, getAuthHeaders(token));
  return response.data;
};

export const deleteBoosterPack = async (token, packId) => {
  const response = await axios.delete(`${API_URL}/booster-packs/${packId}`, getAuthHeaders(token));
  return response.data;
};
