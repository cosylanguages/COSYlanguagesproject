// src/hooks/useTeacherData.js
import { useState, useEffect } from 'react';
import { fetchDays, fetchLessonSections, getLessonSectionDetails } from '../api/api';

export const useTeacherData = (authToken, selectedDayId, selectedSectionId) => {
  const [days, setDays] = useState([]);
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = useState([]);
  const [currentExerciseBlocks, setCurrentExerciseBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authToken) {
      setIsLoading(true);
      fetchDays(authToken)
        .then(data => {
          setDays(data || []);
        })
        .catch(err => {
          console.error("Error fetching teacher days:", err);
          setError('Failed to load study days.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [authToken]);

  useEffect(() => {
    if (!selectedDayId) {
      setLessonSectionsForPanel([]);
      setCurrentExerciseBlocks([]);
      return;
    }

    if (authToken && selectedDayId) {
      setIsLoading(true);
      setLessonSectionsForPanel([]);
      setCurrentExerciseBlocks([]);

      fetchLessonSections(authToken, selectedDayId)
        .then(data => {
          setLessonSectionsForPanel(data || []);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching teacher sections for day ${selectedDayId}:`, err);
          setError('Failed to load lesson sections for the selected day.');
          setLessonSectionsForPanel([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [authToken, selectedDayId]);

  useEffect(() => {
    if (!selectedSectionId) {
      setCurrentExerciseBlocks([]);
      return;
    }

    if (authToken && selectedSectionId) {
      setIsLoading(true);
      getLessonSectionDetails(authToken, selectedSectionId)
        .then(data => {
          setCurrentExerciseBlocks(data.exerciseBlocks || []);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching teacher section details for section ${selectedSectionId}:`, err);
          setError('Failed to load section content.');
          setCurrentExerciseBlocks([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [authToken, selectedSectionId]);

  return { days, lessonSectionsForPanel, currentExerciseBlocks, isLoading, error };
};
