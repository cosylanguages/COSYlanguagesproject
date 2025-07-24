import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

/**
 * An array of language IDs that can be latinized.
 */
export const LATINIZABLE_LANGUAGE_IDS = [
    'COSYgreek',
    'COSYrussian',
    'COSYarmenian',
    'COSYtatar',
    'COSYbachkir'
];

/**
 * The latinization context.
 */
const LatinizationContext = createContext();

/**
 * A custom hook for accessing the latinization context.
 * @returns {object} The latinization context.
 */
export const useLatinizationContext = () => {
  const context = useContext(LatinizationContext);
  if (!context) {
    throw new Error('useLatinizationContext must be used within a LatinizationProvider');
  }
  return context;
};

/**
 * A provider for the latinization context.
 * It manages the latinization state and provides a function for toggling it.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The LatinizationProvider component.
 */
export const LatinizationProvider = ({ children }) => {
  const [isLatinized, setIsLatinized] = useState(() => {
    const storedState = localStorage.getItem('latinizeStateReact');
    return storedState ? JSON.parse(storedState) : false;
  });

  // Effect to persist the latinization state to local storage.
  useEffect(() => {
    localStorage.setItem('latinizeStateReact', JSON.stringify(isLatinized));
  }, [isLatinized]);

  /**
   * Toggles the latinization state.
   */
  const toggleLatinization = useCallback(() => {
    setIsLatinized(prev => !prev);
  }, []);

  const value = {
    isLatinized,
    toggleLatinization,
    latinizableLanguageIds: LATINIZABLE_LANGUAGE_IDS,
  };

  return (
    <LatinizationContext.Provider value={value}>
      {children}
    </LatinizationContext.Provider>
  );
};
