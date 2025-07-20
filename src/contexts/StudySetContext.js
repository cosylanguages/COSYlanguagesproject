import React, { createContext, useState, useContext } from 'react';

const StudySetContext = createContext();

export const useStudySet = () => useContext(StudySetContext);

export const StudySetProvider = ({ children }) => {
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [currentView, setCurrentView] = useState('list');

  const value = {
    selectedSetId,
    setSelectedSetId,
    currentView,
    setCurrentView,
  };

  return (
    <StudySetContext.Provider value={value}>
      {children}
    </StudySetContext.Provider>
  );
};
