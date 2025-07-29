import apiClient from './apiClient';

export const login = async (username, password) => {
  const response = await apiClient.post('/auth/login', { username, password });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const signup = async (username, password) => {
  const response = await apiClient.post('/auth/signup', { username, password });
  return response.data;
};
