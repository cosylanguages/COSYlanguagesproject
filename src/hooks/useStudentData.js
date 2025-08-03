// src/hooks/useStudentData.js
import { useState, useEffect, useCallback } from 'react';
import { getSyllabusIndex } from '../utils/syllabusService';
import { loadVocabularyData } from '../utils/exerciseDataService';

export const useStudentData = (language, selectedDayId, selectedSectionId) => {
  const [days, setDays] = useState([]);
  const [currentSyllabus, setCurrentSyllabus] = useState(null);
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = useState([]);
  const [currentExerciseBlocks, setCurrentExerciseBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const memoizedGetSyllabusIndex = useCallback(() => {
    if (language) {
      setIsLoading(true);
      getSyllabusIndex()
        .then(syllabusIndex => {
          if (syllabusIndex && syllabusIndex[language]) {
            const langSyllabus = syllabusIndex[language];
            const availableDays = langSyllabus.days.map(dayNum => ({
              dayNumber: dayNum,
              lessonName: `Day ${dayNum}`, // Placeholder name
              fileName: langSyllabus.fileName, // We still need this to know which file to fetch from
            }));
            setDays(availableDays);
          } else {
            setDays([]);
          }
        })
        .catch(err => {
          console.error("Error fetching syllabus index:", err);
          setError('Failed to load study plan.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [language]);

  useEffect(() => {
    memoizedGetSyllabusIndex();
  }, [memoizedGetSyllabusIndex]);

  useEffect(() => {
    if (!selectedDayId) {
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setCurrentExerciseBlocks([]);
      return;
    }

    const dayInfo = days.find(d => d.dayNumber === parseInt(selectedDayId));
    if (dayInfo) {
      setIsLoading(true);
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setCurrentExerciseBlocks([]);

      // The "syllabus" for a day is now just its vocabulary list.
      loadVocabularyData(language, selectedDayId)
        .then(vocabulary => {
          if (vocabulary) {
            // Adapt the vocabulary array to the structure the components expect.
            const syllabusData = {
              day: selectedDayId,
              sections: [{
                title: "Vocabulary",
                content_blocks: [{ type: "vocabulary_list", items: vocabulary }]
              }]
            };
            setCurrentSyllabus(syllabusData);
            setLessonSectionsForPanel(syllabusData.sections || []);
            setError(null);
          } else {
            throw new Error(`Vocabulary data for day ${selectedDayId} is null or empty.`);
          }
        })
        .catch(err => {
          console.error(`Error fetching or processing vocabulary for day ${selectedDayId}:`, err);
          setError('Failed to load lesson content for the selected day.');
          setCurrentSyllabus(null);
          setLessonSectionsForPanel([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedDayId, days, language]);

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

  return { days, lessonSectionsForPanel, currentExerciseBlocks, isLoading, error };
};
