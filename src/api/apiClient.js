import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // This will be proxied to the backend server in development
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
