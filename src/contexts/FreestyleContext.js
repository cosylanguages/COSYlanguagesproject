import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FreestyleContext = createContext();

export const useFreestyle = () => useContext(FreestyleContext);

export const FreestyleProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

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

  const value = {
    selectedLanguage,
    setSelectedLanguage: setLanguage,
    selectedDays,
    setSelectedDays: setDays,
    selectedExercise,
    setSelectedExercise: setExercise,
  };

  return (
    <FreestyleContext.Provider value={value}>
      {children}
    </FreestyleContext.Provider>
  );
};
