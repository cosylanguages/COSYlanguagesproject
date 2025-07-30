import apiClient from './apiClient';

export const getStudentProgress = async (courseId, studentId, token) => {
  const response = await apiClient.get(`/progress/${courseId}/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
