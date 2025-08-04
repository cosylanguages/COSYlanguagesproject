import axios from 'axios';

const apiClient = axios.create({
  // Use an environment variable for the API base URL in production,
  // and fall back to the proxy for development.
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
