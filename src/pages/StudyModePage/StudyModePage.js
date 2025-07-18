import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import { fetchDays as fetchTeacherDays } from '../../api/days'; // Renamed for clarity
import { fetchLessonSections as fetchTeacherLessonSections, getLessonSectionDetails as getTeacherLessonSectionDetails } from '../../api/lessonSections'; // For Teacher
import { getAvailableSyllabusDays, fetchSyllabusByFileName } from '../../utils/syllabusService'; // For Student
import RoleSelector from './RoleSelector';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';
import TransliterableText from '../../components/Common/TransliterableText';
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';
import Button from '../../components/Common/Button';

import './StudyModePage.css';

// Helper function (can be moved to a utility file if used elsewhere)
// Added index as a fallback for block IDs if not present in syllabus JSON
export const getBlockElementId = (blockId, index) => `lesson-block-content-${blockId || `gen-${index}`}`;

const StudyModePage = () => {
  const { t, language, currentLangKey } = useI18n();
  const { authToken } = useAuth();

  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('selectedRole') || null);

  // Data State
  // For students: days = { dayNumber, lessonName, fileName }[]
  // For teachers: days = API days results { id, title }[]
  const [days, setDays] = useState([]);
  // For students: selectedDayId = dayNumber (string from select value)
  // For teachers: selectedDayId = API day ID (string)
  const [selectedDayId, setSelectedDayId] = useState(null);

  const [currentSyllabus, setCurrentSyllabus] = useState(null); // For students: loaded syllabus JSON

  // For students: lessonSectionsForPanel = syllabusData.sections
  // For teachers: lessonSectionsForPanel = API lesson sections results
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = useState([]);

  // For students: selectedSectionId = section.title from syllabus (string)
  // For teachers: selectedSectionId = API section ID (string)
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const [currentExerciseBlocks, setCurrentExerciseBlocks] = useState([]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Effects for Data Fetching ---

  // Effect to fetch days list based on role and current language
  const memoizedGetAvailableSyllabusDays = useCallback(() => {
    if (selectedRole === 'student' && language) {
      setIsLoading(true);
      getAvailableSyllabusDays(language)
        .then(syllabusDays => {
          setDays(syllabusDays || []);
        })
        .catch(err => {
          console.error("Error fetching syllabus days:", err);
          setError(t('studyModePage.errorFetchingDays', 'Failed to load study days.'));
        })
        .finally(() => setIsLoading(false));
    }
  }, [language, selectedRole, t]);

  useEffect(() => {
    // Reset states when role or language changes significantly
    setDays([]);
    setSelectedDayId(null);
    setCurrentSyllabus(null);
    setLessonSectionsForPanel([]);
    setSelectedSectionId(null);
    setCurrentExerciseBlocks([]);
    setError(null);

    memoizedGetAvailableSyllabusDays();

    if (selectedRole === 'teacher' && authToken) {
      setIsLoading(true);
      fetchTeacherDays(authToken) // Use renamed import
        .then(data => {
          setDays(data || []);
        })
        .catch(err => {
          console.error("Error fetching teacher days:", err);
          setError(t('studyModePage.errorFetchingDays', 'Failed to load study days.'));
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedRole, authToken, t]);


  // Effect to load lesson sections / full syllabus content when a day is selected
  useEffect(() => {
    // Clear previous day's data if selectedDayId is cleared or role changes to one not needing this.
    if (!selectedDayId) {
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setSelectedSectionId(null); // Also clear selected section
      setCurrentExerciseBlocks([]); // And blocks
      return;
    }

    if (selectedRole === 'student') {
      // Ensure selectedDayId (string from select) is compared as number to day.dayNumber
      const dayInfo = days.find(d => d.dayNumber === parseInt(selectedDayId));
      if (dayInfo && dayInfo.fileName) {
        setIsLoading(true);
        // Clear previous day's specific data before fetching new
        setCurrentSyllabus(null);
        setLessonSectionsForPanel([]);
        setSelectedSectionId(null);
        setCurrentExerciseBlocks([]);

        fetchSyllabusByFileName(dayInfo.fileName)
          .then(syllabusData => {
            if (syllabusData) {
              setCurrentSyllabus(syllabusData);
              setLessonSectionsForPanel(syllabusData.sections || []);
              setError(null); // Clear previous errors
            } else {
              // This case might indicate the file was empty or not valid JSON after all
              throw new Error(`Syllabus data for ${dayInfo.fileName} is null or not structured as expected.`);
            }
          })
          .catch(err => {
            console.error(`Error fetching or processing syllabus file ${dayInfo.fileName}:`, err);
            setError(t('studyModePage.errorFetchingSections', 'Failed to load lesson content for the selected day.'));
            // Ensure states are reset on error
            setCurrentSyllabus(null);
            setLessonSectionsForPanel([]);
          })
          .finally(() => setIsLoading(false));
      }
    } else if (selectedRole === 'teacher' && authToken && selectedDayId) {
      setIsLoading(true);
      // Clear previous day's specific data before fetching new
      setLessonSectionsForPanel([]);
      setSelectedSectionId(null);
      setCurrentExerciseBlocks([]);

      fetchTeacherLessonSections(authToken, selectedDayId) // Use renamed import for teacher data
        .then(data => {
          setLessonSectionsForPanel(data || []);
          setError(null); // Clear previous errors
        })
        .catch(err => {
          console.error(`Error fetching teacher sections for day ${selectedDayId}:`, err);
          setError(t('studyModePage.errorFetchingSections', 'Failed to load lesson sections for the selected day.'));
          setLessonSectionsForPanel([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedRole, selectedDayId, days, authToken, t]); // `days` is needed to find fileName for student

  // Effect to set exercise blocks when a section is selected
  useEffect(() => {
    // Clear blocks if no section is selected or if relevant data is missing
    if (!selectedSectionId) {
        setCurrentExerciseBlocks([]);
        return;
    }

    if (selectedRole === 'student' && currentSyllabus && currentSyllabus.sections) {
      // For students, selectedSectionId is the title of the section
      const section = currentSyllabus.sections.find(s => s.title === selectedSectionId);
      setCurrentExerciseBlocks(section?.content_blocks || []);
    } else if (selectedRole === 'teacher' && authToken && selectedSectionId) {
      // For teachers, selectedSectionId is the API ID of the section
      setIsLoading(true);
      getTeacherLessonSectionDetails(authToken, selectedSectionId) // Use renamed import for teacher data
        .then(data => {
          setCurrentExerciseBlocks(data.exerciseBlocks || []);
          setError(null); // Clear previous errors
        })
        .catch(err => {
          console.error(`Error fetching teacher section details for section ${selectedSectionId}:`, err);
          setError(t('studyModePage.errorFetchingSectionContent', 'Failed to load section content.'));
          setCurrentExerciseBlocks([]);
        })
        .finally(() => setIsLoading(false));
    } else if (selectedRole === 'student') {
        // This case handles if currentSyllabus is temporarily null or sections are missing
        setCurrentExerciseBlocks([]);
    }
  }, [selectedRole, currentSyllabus, selectedSectionId, authToken, t]);


  // --- UI Handlers and Local Storage ---
  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    } else {
      localStorage.removeItem('selectedRole');
    }
  }, [selectedRole]);

  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(prevRole => {
      const newRole = prevRole === role ? null : role;
      if (prevRole !== newRole) { // Reset dependent states only if role actually changes
        setDays([]); // Will be refetched by main data fetching useEffect
        setSelectedDayId(null);
        setCurrentSyllabus(null);
        setLessonSectionsForPanel([]);
        setSelectedSectionId(null);
        setCurrentExerciseBlocks([]);
        setError(null);
      }
      return newRole;
    });
  }, []);

  const handleDaySelectSmP = (dayIdValue) => { // dayIdValue is dayNumber (string) for students, API ID for teachers
    setSelectedDayId(dayIdValue);
    // Reset downstream states as new day selection invalidates current section/blocks
    setSelectedSectionId(null);
    setCurrentExerciseBlocks([]);
    if (selectedRole === 'student') {
        // currentSyllabus and lessonSectionsForPanel will be reset and refetched by the useEffect dependent on selectedDayId
        setCurrentSyllabus(null);
        setLessonSectionsForPanel([]);
    } else {
        // For teacher, lessonSectionsForPanel also reset and refetched by its useEffect
        setLessonSectionsForPanel([]);
    }
    window.dispatchEvent(new CustomEvent('dayChange', { detail: { selectedDayId: dayIdValue } }));
  };

  const handleSectionSelectSmP = (sectionIdentifier) => { // sectionIdentifier is title for student, ID for teacher
    setSelectedSectionId(sectionIdentifier);
    const mainContentPanel = document.getElementById('main-content-panel');
    if (mainContentPanel) {
      mainContentPanel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStudentDaySelector = () => {
    // Common label for day selection
    const daySelectLabel = <TransliterableText text={t('studyModePage.selectDayLabel', 'Select Day:')} />;

    if (selectedRole === 'student') {
      // `days` for students is { dayNumber, lessonName, fileName }[]
      if (days.length > 0) {
        return (
          <div className="study-menu-section">
            <label htmlFor="smp-student-day-select">{daySelectLabel}</label>
            <select
              id="smp-student-day-select"
              value={selectedDayId || ""} // selectedDayId is dayNumber (string)
              onChange={(e) => handleDaySelectSmP(e.target.value)}
              disabled={isLoading}
            >
              <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
              {days.map(day => (
                <option key={day.dayNumber} value={String(day.dayNumber)}>
                  {`Day ${day.dayNumber}: ${day.lessonName}`}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (!isLoading && !error) { // Show message if no days and not loading/error
          return <div className="study-menu-section"><p>{t('studyModePage.noSyllabusDays', 'No syllabus days found for this language.')}</p></div>;
      }
    } else if (selectedRole === 'teacher') {
      // `days` for teachers is API day objects {id, title}
      if (days.length > 0) {
        return (
           <div className="study-menu-section">
            <label htmlFor="smp-teacher-day-select">{daySelectLabel}</label>
            <select
              id="smp-teacher-day-select"
              value={selectedDayId || ""} // selectedDayId is API day ID
              onChange={(e) => handleDaySelectSmP(e.target.value)}
              disabled={isLoading}
            >
              <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
              {days.map(day => (
                <option key={day.id} value={day.id}>
                  {day.title?.[currentLangKey] || day.title?.COSYenglish || `Day ID: ${day.id}`}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (!isLoading && !error) { // Show message if no days and not loading/error
          return <div className="study-menu-section"><p>{t('studyModePage.noTeacherDays', 'No days configured by teacher yet.')}</p></div>;
      }
    }
    // If still loading initially, or error state, the main loading/error message will cover it.
    // Or, if selectedRole is null, nothing is rendered here.
    return null;
  };

  return (
    <div className="study-mode-page-container">
      <h1>
        <TransliterableText text={t('studyMode.mainHeading', 'COSYlanguages - Study Mode 🎓')} />
      </h1>

      <div className="study-menu-section">
        <label htmlFor="language-select" id="study-choose-language-label">
          <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
        </label>
        <LanguageSelector />
        <ToggleLatinizationButton
          currentDisplayLanguage={currentLangKey || language}
        />
        <Button onClick={() => window.location.href = '/freestyle'}>
          Freestyle 🚀
        </Button>
      </div>

      <div className="study-menu-section">
        <label htmlFor="role-selector-buttons" id="study-choose-role-label">
            <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
        </label>
        <RoleSelector onSelectRole={handleRoleSelect} currentRole={selectedRole} />
      </div>

      {renderStudentDaySelector()}

      {error && <p className="error-message" role="alert">{error}</p>}
      {/* More specific loading message handling: show only if role is selected & no days yet & not an error state */}
      {isLoading && selectedRole && (!days || days.length === 0) && !error && (
          <p role="status"><TransliterableText text={t('loading', 'Loading...')} /></p>
      )}

      <div className="study-content-area">
        {!selectedRole ? (
          <p id="study-welcome-message">
            <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
          </p>
        ) : (
          <div className="dashboard-layout">
            <div className="layout-left-panel">
              {selectedDayId && lessonSectionsForPanel.length > 0 ? (
                <LessonSectionsPanel
                  sectionsFromSyllabus={selectedRole === 'student' ? lessonSectionsForPanel : null}
                  apiLessonSections={selectedRole === 'teacher' ? lessonSectionsForPanel : null}
                  onSectionSelect={handleSectionSelectSmP}
                  currentLangKey={currentLangKey}
                  selectedSectionId={selectedSectionId}
                  isStudentMode={selectedRole === 'student'}
                />
              ) : selectedDayId && !isLoading && !error ? ( // Day selected, but no sections (or still loading them if isLoading was true)
                <p>
                  {selectedRole === 'student'
                    ? t('studyModePage.noSectionsInSyllabus', 'No sections found in the syllabus for this day.')
                    : t('studyModePage.noSectionsForTeacherDay', 'No sections configured for this day yet.')
                  }
                </p>
              ) : ( // No day selected, but role is active and days are loaded (or were attempted to load)
                selectedRole && !isLoading && days && days.length > 0 && !error && (
                  <p>
                    {selectedRole === 'student'
                      ? t('studyModePage.pleaseSelectDay', 'Please select a day to see lesson sections.')
                      : t('studyModePage.teacherPleaseSelectDay', 'Please select a day to manage its sections.')
                    }
                  </p>
                )
              )}
              {/* This covers the case where days list itself is empty after attempting to load and no day is selected */}
              {!isLoading && (!days || days.length === 0) && selectedRole && !error && !selectedDayId && (
                 <p>
                  {/* Message handled by renderStudentDaySelector or a general "no data" message if needed here */}
                 </p>
              )}
            </div>
            <div className="layout-center-panel" id="main-content-panel">
              {selectedRole === 'student' &&
                <StudentDashboard
                  lessonBlocks={currentExerciseBlocks}
                />}
              {selectedRole === 'teacher' &&
                <TeacherDashboard
                  selectedDayId={selectedDayId}
                  key={selectedDayId}
                />
              }
            </div>
            <div className="layout-right-panel">
              <ToolsPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModePage;
