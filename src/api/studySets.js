import axios from 'axios';

const API_URL = 'http://localhost:3001/study-sets';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchStudySets = async (token) => {
  const response = await axios.get(API_URL, getAuthHeaders(token));
  return response.data;
};

export const fetchStudySetById = async (token, setId) => {
  const response = await axios.get(`${API_URL}/${setId}`, getAuthHeaders(token));
  return response.data;
};

export const addStudySet = async (token, setData) => {
  const response = await axios.post(API_URL, setData, getAuthHeaders(token));
  return response.data;
};

export const updateStudySet = async (token, setId, setData) => {
  const response = await axios.put(`${API_URL}/${setId}`, setData, getAuthHeaders(token));
  return response.data;
};

export const deleteStudySet = async (token, setId) => {
  const response = await axios.delete(`${API_URL}/${setId}`, getAuthHeaders(token));
  return response.data;
};
