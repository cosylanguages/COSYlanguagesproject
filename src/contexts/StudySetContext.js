import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchStudySets as apiFetchStudySets,
  fetchStudySetById as apiFetchStudySetById,
  addStudySet as apiAddStudySet,
  updateStudySet as apiUpdateStudySet,
  deleteStudySet as apiDeleteStudySet,
} from '../api/studySets';

const StudySetContext = createContext();

export const useStudySet = () => useContext(StudySetContext);

export const StudySetProvider = ({ children }) => {
  const [studySets, setStudySets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();

  const fetchStudySets = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchStudySets(authToken);
      setStudySets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const fetchStudySetById = useCallback(async (setId) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchStudySetById(authToken, setId);
      setSelectedSet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const addStudySet = useCallback(async (setData) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiAddStudySet(authToken, setData);
      setStudySets((prev) => [...prev, data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const updateStudySet = useCallback(async (setId, setData) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiUpdateStudySet(authToken, setId, setData);
      setStudySets((prev) => prev.map((s) => (s.id === setId ? data : s)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const deleteStudySet = useCallback(async (setId) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      await apiDeleteStudySet(authToken, setId);
      setStudySets((prev) => prev.filter((s) => s.id !== setId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchStudySets();
  }, [fetchStudySets]);

  const value = {
    studySets,
    selectedSet,
    loading,
    error,
    fetchStudySets,
    fetchStudySetById,
    addStudySet,
    updateStudySet,
    deleteStudySet,
  };

  return (
    <StudySetContext.Provider value={value}>
      {children}
    </StudySetContext.Provider>
  );
};
