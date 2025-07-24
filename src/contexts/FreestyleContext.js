import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * The freestyle context.
 */
const FreestyleContext = createContext();

/**
 * A custom hook for accessing the freestyle context.
 * @returns {object} The freestyle context.
 */
export const useFreestyle = () => useContext(FreestyleContext);

/**
 * A provider for the freestyle context.
 * It manages the state for the freestyle mode, including the selected language, days, and exercise.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The FreestyleProvider component.
 */
export const FreestyleProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Effect to synchronize the state with the URL.
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'freestyle' && pathParts.length > 1) {
      const [lang, days, exercise] = pathParts.slice(1);
      if (lang) setSelectedLanguage(lang);
      if (days) setSelectedDays(days.split(','));
      if (exercise) setSelectedExercise({ exercise, key: `${lang}-${days}-${exercise}` });
    }
  }, [location]);

  /**
   * Updates the URL based on the selected language, days, and exercise.
   * @param {string} lang - The selected language.
   * @param {Array} days - The selected days.
   * @param {object} exercise - The selected exercise.
   */
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

  /**
   * Sets the selected language.
   * @param {string} lang - The selected language.
   */
  const setLanguage = (lang) => {
    setSelectedLanguage(lang);
    setSelectedDays([]);
    setSelectedExercise(null);
    updateUrl(lang);
  };

  /**
   * Sets the selected days.
   * @param {Array} days - The selected days.
   */
  const setDays = (days) => {
    setSelectedDays(days);
    setSelectedExercise(null);
    updateUrl(selectedLanguage, days);
  };

  /**
   * Sets the selected exercise.
   * @param {object} exercise - The selected exercise.
   */
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
