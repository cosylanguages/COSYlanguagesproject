import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// This list should ideally be kept in sync with any master language list
// or configuration. For now, mirroring what was in latinizer.js
export const LATINIZABLE_LANGUAGE_IDS = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական'];

const LatinizationContext = createContext();

export const useLatinizationContext = () => {
  const context = useContext(LatinizationContext);
  if (!context) {
    throw new Error('useLatinizationContext must be used within a LatinizationProvider');
  }
  return context;
};

export const LatinizationProvider = ({ children }) => {
  const [isLatinized, setIsLatinized] = useState(() => {
    // Initialize state from localStorage if available
    const storedState = localStorage.getItem('latinizeStateReact');
    return storedState ? JSON.parse(storedState) : false;
  });

  useEffect(() => {
    // Persist state to localStorage whenever it changes
    localStorage.setItem('latinizeStateReact', JSON.stringify(isLatinized));
  }, [isLatinized]);

  const toggleLatinization = useCallback(() => {
    setIsLatinized(prev => !prev);
  }, []);

  const value = {
    isLatinized,
    toggleLatinization,
    latinizableLanguageIds: LATINIZABLE_LANGUAGE_IDS, // Provide the list through context
  };

  return (
    <LatinizationContext.Provider value={value}>
      {children}
    </LatinizationContext.Provider>
  );
};
