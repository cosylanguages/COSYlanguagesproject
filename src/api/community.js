import axios from 'axios';

const API_URL = 'http://localhost:3001';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getPosts = async (token) => {
  const response = await axios.get(`${API_URL}/posts`, getAuthHeaders(token));
  return response.data;
};

export const createPost = async (token, postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData, getAuthHeaders(token));
  return response.data;
};

export const likePost = async (token, postId) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`, null, getAuthHeaders(token));
  return response.data;
};

export const commentOnPost = async (token, postId, commentData) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/comment`, commentData, getAuthHeaders(token));
  return response.data;
};
