// src/hooks/useStudyMode.js
import { useStudy } from '../contexts/StudyContext';

export const useStudyMode = () => {
  const {
    selectedRole,
    setSelectedRole,
    selectedDayId,
    setSelectedDayId,
    selectedSectionId,
    setSelectedSectionId,
  } = useStudy();

  const handleDaySelect = (dayIdValue) => {
    setSelectedDayId(dayIdValue);
    setSelectedSectionId(null);
  };

  const handleSectionSelect = (sectionIdentifier) => {
    setSelectedSectionId(sectionIdentifier);
  };

  return {
    selectedRole,
    setSelectedRole,
    selectedDayId,
    handleDaySelect,
    selectedSectionId,
    handleSectionSelect,
  };
};
