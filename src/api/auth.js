import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

export const signup = async (username, password) => {
  const response = await axios.post(`${API_URL}/signup`, { username, password });
  return response.data;
};
