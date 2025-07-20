import React, { createContext, useState, useContext } from 'react';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const value = {
    selectedRole,
    setSelectedRole,
    selectedDayId,
    setSelectedDayId,
    selectedSectionId,
    setSelectedSectionId,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};
