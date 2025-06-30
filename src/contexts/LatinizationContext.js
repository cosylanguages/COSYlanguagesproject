import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// This list should be the single source of truth for which languages can be latinized.
// It should align with languages having transliteration rules in transliteration.js
// and ideally use keys consistent with translationsData.js for easier management.
export const LATINIZABLE_LANGUAGE_IDS = [
    'ΚΟΖΥελληνικά', // Greek
    'ТАКОЙрусский', // Russian
    'ԾՈՍՅհայկական', // Armenian
    'COSYtatar',    // Tatar (matches key in translationsData.js)
    'COSYbachkir'   // Bashkir (matches key in translationsData.js)
];

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
