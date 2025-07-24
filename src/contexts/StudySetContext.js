import React, { createContext, useState, useContext } from 'react';

/**
 * The study set context.
 */
const StudySetContext = createContext();

/**
 * A custom hook for accessing the study set context.
 * @returns {object} The study set context.
 */
export const useStudySet = () => useContext(StudySetContext);

/**
 * A provider for the study set context.
 * It manages the state for the study sets, including the selected set and the current view.
 * @param {object} props - The component's props.
 * @param {object} props.children - The child components.
 * @returns {JSX.Element} The StudySetProvider component.
 */
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
