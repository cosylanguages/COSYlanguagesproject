import apiClient from './apiClient';

export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
};

export const commentOnPost = async (postId, commentData) => {
  const response = await apiClient.post(`/posts/${postId}/comment`, commentData);
  return response.data;
};

export const getEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await apiClient.post('/events', eventData);
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};
