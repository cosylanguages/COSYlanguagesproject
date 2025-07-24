import React, { createContext, useState, useContext } from 'react';

/**
 * The study context.
 */
const StudyContext = createContext();

/**
 * A custom hook for accessing the study context.
 * @returns {object} The study context.
 */
export const useStudy = () => useContext(StudyContext);

/**
 * A provider for the study context.
 * It manages the state for the study mode, including the selected role, day, and section.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The StudyProvider component.
 */
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
