import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  getFreestyleProgress as apiGetFreestyleProgress,
  updateFreestyleProgress as apiUpdateFreestyleProgress,
  getBoosterPacks as apiGetBoosterPacks,
  createBoosterPack as apiCreateBoosterPack,
  deleteBoosterPack as apiDeleteBoosterPack,
} from '../api/freestyle';

const FreestyleContext = createContext();

export const useFreestyle = () => useContext(FreestyleContext);

export const FreestyleProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authToken, currentUser } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progress, setProgress] = useState({});
  const [boosterPacks, setBoosterPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'freestyle' && pathParts.length > 1) {
      const [lang, days, exercise] = pathParts.slice(1);
      if (lang) setSelectedLanguage(lang);
      if (days) setSelectedDays(days.split(','));
      if (exercise) setSelectedExercise({ exercise, key: `${lang}-${days}-${exercise}` });
    }
  }, [location]);

  const updateUrl = (lang, days, exercise) => {
    let path = '/freestyle';
    if (lang) {
      path += `/${lang}`;
      if (days && days.length > 0) {
        path += `/${days.join(',')}`;
        if (exercise) {
          path += `/${exercise.exercise}`;
        }
      }
    }
    navigate(path);
  };

  const setLanguage = (lang) => {
    setSelectedLanguage(lang);
    setSelectedDays([]);
    setSelectedExercise(null);
    updateUrl(lang);
  };

  const setDays = (days) => {
    setSelectedDays(days);
    setSelectedExercise(null);
    updateUrl(selectedLanguage, days);
  };

  const setExercise = (exercise) => {
    setSelectedExercise(exercise);
    updateUrl(selectedLanguage, selectedDays, exercise);
  };

  const getFreestyleProgress = useCallback(async () => {
    if (!authToken || !currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetFreestyleProgress(authToken, currentUser.id);
      setProgress(data.progress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken, currentUser]);

  const updateFreestyleProgress = useCallback(async (newProgress) => {
    if (!authToken || !currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiUpdateFreestyleProgress(authToken, currentUser.id, newProgress);
      setProgress(data.progress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken, currentUser]);

  const getBoosterPacks = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetBoosterPacks(authToken);
      setBoosterPacks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const createBoosterPack = useCallback(async (packData) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiCreateBoosterPack(authToken, packData);
      setBoosterPacks((prev) => [...prev, data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const deleteBoosterPack = useCallback(async (packId) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      await apiDeleteBoosterPack(authToken, packId);
      setBoosterPacks((prev) => prev.filter((p) => p.id !== packId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    getFreestyleProgress();
    getBoosterPacks();
  }, [getFreestyleProgress, getBoosterPacks]);

  const value = {
    selectedLanguage,
    setSelectedLanguage: setLanguage,
    selectedDays,
    setSelectedDays: setDays,
    selectedExercise,
    setSelectedExercise: setExercise,
    progress,
    updateFreestyleProgress,
    boosterPacks,
    createBoosterPack,
    deleteBoosterPack,
    loading,
    error,
  };

  return (
    <FreestyleContext.Provider value={value}>
      {children}
    </FreestyleContext.Provider>
  );
};
