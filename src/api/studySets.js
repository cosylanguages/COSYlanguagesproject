import apiClient from './apiClient';

export const fetchStudySets = async (language) => {
  const response = await apiClient.get('/study-sets', {
    params: { lang: language },
  });
  return response.data;
};

export const fetchStudySetById = async (setId, language) => {
  const response = await apiClient.get(`/study-sets/${setId}`, {
    params: { lang: language },
  });
  return response.data;
};

export const addStudySet = async (setData) => {
  const response = await apiClient.post('/study-sets', setData);
  return response.data;
};

export const updateStudySet = async (setId, setData) => {
  const response = await apiClient.put(`/study-sets/${setId}`, setData);
  return response.data;
};

export const deleteStudySet = async (setId) => {
  const response = await apiClient.delete(`/study-sets/${setId}`);
  return response.data;
};

export const addCardToStudySet = async (studySetId, cardData) => {
  const response = await apiClient.post(`/study-sets/${studySetId}/cards`, cardData);
  return response.data;
};
