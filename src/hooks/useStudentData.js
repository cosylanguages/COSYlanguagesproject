// src/hooks/useStudentData.js
import { useState, useEffect, useCallback } from 'react';
import { getAvailableSyllabusDays, fetchSyllabusByFileName } from '../utils/syllabusService';

export const useStudentData = (language, selectedDayId, selectedSectionId) => {
  const [days, setDays] = useState([]);
  const [currentSyllabus, setCurrentSyllabus] = useState(null);
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = useState([]);
  const [currentExerciseBlocks, setCurrentExerciseBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const memoizedGetAvailableSyllabusDays = useCallback(() => {
    if (language) {
      setIsLoading(true);
      getAvailableSyllabusDays(language)
        .then(syllabusDays => {
          setDays(syllabusDays || []);
        })
        .catch(err => {
          console.error("Error fetching syllabus days:", err);
          setError('Failed to load study days.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [language]);

  useEffect(() => {
    memoizedGetAvailableSyllabusDays();
  }, [memoizedGetAvailableSyllabusDays]);

  useEffect(() => {
    if (!selectedDayId) {
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setCurrentExerciseBlocks([]);
      return;
    }

    const dayInfo = days.find(d => d.dayNumber === parseInt(selectedDayId));
    if (dayInfo && dayInfo.fileName) {
      setIsLoading(true);
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setCurrentExerciseBlocks([]);

      fetchSyllabusByFileName(dayInfo.fileName)
        .then(syllabusData => {
          if (syllabusData) {
            setCurrentSyllabus(syllabusData);
            setLessonSectionsForPanel(syllabusData.sections || []);
            setError(null);
          } else {
            throw new Error(`Syllabus data for ${dayInfo.fileName} is null or not structured as expected.`);
          }
        })
        .catch(err => {
          console.error(`Error fetching or processing syllabus file ${dayInfo.fileName}:`, err);
          setError('Failed to load lesson content for the selected day.');
          setCurrentSyllabus(null);
          setLessonSectionsForPanel([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedDayId, days]);

  useEffect(() => {
    if (!selectedSectionId) {
      setCurrentExerciseBlocks([]);
      return;
    }

    if (currentSyllabus && currentSyllabus.sections) {
      const section = currentSyllabus.sections.find(s => s.title === selectedSectionId);
      setCurrentExerciseBlocks(section?.content_blocks || []);
    } else {
      setCurrentExerciseBlocks([]);
    }
  }, [currentSyllabus, selectedSectionId]);

  return { days, lessonSectionsForPanel, currentExerciseBlocks, isLoading, error, currentSyllabus };
};
