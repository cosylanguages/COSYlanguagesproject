// Import necessary libraries, hooks, and components.
import React, { useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStudy } from '../../contexts/StudyContext';
import { fetchDays as fetchTeacherDays } from '../../api/api';
import { fetchLessonSections as fetchTeacherLessonSections, getLessonSectionDetails as getTeacherLessonSectionDetails } from '../../api/api';
import { getAvailableSyllabusDays, fetchSyllabusByFileName } from '../../utils/syllabusService';
import RoleSelector from './RoleSelector';
import StudentPage from './StudentPage';
import TeacherPage from './TeacherPage';
import TransliterableText from '../../components/Common/TransliterableText';
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';
import Button from '../../components/Common/Button';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import LanguageHeader from '../../components/Common/LanguageHeader';

// Import the CSS for this page.
import './StudyModePage.css';

/**
 * The main page for the "Study Mode".
 * This component handles the logic for both students and teachers, allowing them to select roles,
 * languages, days, and lesson sections. It fetches and displays the relevant data based on
 * the user's selections.
 * @returns {JSX.Element} The StudyModePage component.
 */
const StudyModePage = () => {
  // Hooks for internationalization, authentication, and study context.
  const { t, language, currentLangKey } = useI18n();
  const { authToken } = useAuth();
  const {
    selectedRole,
    selectedDayId,
    setSelectedDayId,
    selectedSectionId,
    setSelectedSectionId,
  } = useStudy();

  // State for days, syllabus, lesson sections, exercise blocks, loading status, and errors.
  const [days, setDays] = React.useState([]);
  const [currentSyllabus, setCurrentSyllabus] = React.useState(null);
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = React.useState([]);
  const [currentExerciseBlocks, setCurrentExerciseBlocks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Memoized callback to fetch available syllabus days for students.
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

  // Effect to fetch days when the role or language changes.
  useEffect(() => {
    // Reset state when the role or language changes.
    setDays([]);
    setSelectedDayId(null);
    setCurrentSyllabus(null);
    setLessonSectionsForPanel([]);
    setSelectedSectionId(null);
    setCurrentExerciseBlocks([]);
    setError(null);

    // Fetch student or teacher days based on the selected role.
    memoizedGetAvailableSyllabusDays();

    if (selectedRole === 'teacher' && authToken) {
      setIsLoading(true);
      fetchTeacherDays(authToken)
        .then(data => {
          setDays(data || []);
        })
        .catch(err => {
          console.error("Error fetching teacher days:", err);
          setError(t('studyModePage.errorFetchingDays', 'Failed to load study days.'));
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedRole, authToken, t, memoizedGetAvailableSyllabusDays, setSelectedDayId, setSelectedSectionId]);

  // Effect to fetch lesson sections when the selected day changes.
  useEffect(() => {
    if (!selectedDayId) {
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setSelectedSectionId(null);
      setCurrentExerciseBlocks([]);
      return;
    }

    // Fetch student or teacher lesson sections based on the selected role and day.
    if (selectedRole === 'student') {
      const dayInfo = days.find(d => d.dayNumber === parseInt(selectedDayId));
      if (dayInfo && dayInfo.fileName) {
        setIsLoading(true);
        setCurrentSyllabus(null);
        setLessonSectionsForPanel([]);
        setSelectedSectionId(null);
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
            setError(t('studyModePage.errorFetchingSections', 'Failed to load lesson content for the selected day.'));
            setCurrentSyllabus(null);
            setLessonSectionsForPanel([]);
          })
          .finally(() => setIsLoading(false));
      }
    } else if (selectedRole === 'teacher' && authToken && selectedDayId) {
      setIsLoading(true);
      setLessonSectionsForPanel([]);
      setSelectedSectionId(null);
      setCurrentExerciseBlocks([]);

      fetchTeacherLessonSections(authToken, selectedDayId)
        .then(data => {
          setLessonSectionsForPanel(data || []);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching teacher sections for day ${selectedDayId}:`, err);
          setError(t('studyModePage.errorFetchingSections', 'Failed to load lesson sections for the selected day.'));
          setLessonSectionsForPanel([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedRole, selectedDayId, days, authToken, t, setSelectedSectionId]);

  // Effect to fetch exercise blocks when the selected section changes.
  useEffect(() => {
    if (!selectedSectionId) {
      setCurrentExerciseBlocks([]);
      return;
    }

    // Fetch student or teacher exercise blocks based on the selected role and section.
    if (selectedRole === 'student' && currentSyllabus && currentSyllabus.sections) {
      const section = currentSyllabus.sections.find(s => s.title === selectedSectionId);
      setCurrentExerciseBlocks(section?.content_blocks || []);
    } else if (selectedRole === 'teacher' && authToken && selectedSectionId) {
      setIsLoading(true);
      getTeacherLessonSectionDetails(authToken, selectedSectionId)
        .then(data => {
          setCurrentExerciseBlocks(data.exerciseBlocks || []);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching teacher section details for section ${selectedSectionId}:`, err);
          setError(t('studyModePage.errorFetchingSectionContent', 'Failed to load section content.'));
          setCurrentExerciseBlocks([]);
        })
        .finally(() => setIsLoading(false));
    } else if (selectedRole === 'student') {
      setCurrentExerciseBlocks([]);
    }
  }, [selectedRole, currentSyllabus, selectedSectionId, authToken, t]);


  // Callback to handle day selection.
  const handleDaySelectSmP = (dayIdValue) => {
    setSelectedDayId(dayIdValue);
    setSelectedSectionId(null);
    setCurrentExerciseBlocks([]);
    if (selectedRole === 'student') {
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
    } else {
      setLessonSectionsForPanel([]);
    }
    window.dispatchEvent(new CustomEvent('dayChange', { detail: { selectedDayId: dayIdValue } }));
  };

  // Callback to handle section selection.
  const handleSectionSelectSmP = (sectionIdentifier) => {
    setSelectedSectionId(sectionIdentifier);
    const mainContentPanel = document.getElementById('main-content-panel');
    if (mainContentPanel) {
      mainContentPanel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Renders the day selector based on the selected role.
  const renderStudentDaySelector = () => {
    const daySelectLabel = <TransliterableText text={t('studyModePage.selectDayLabel', 'Select Day:')} />;

    if (selectedRole === 'student') {
      if (days.length > 0) {
        return (
          <div className="study-menu-section">
            <label htmlFor="smp-student-day-select">{daySelectLabel}</label>
            <select
              id="smp-student-day-select"
              value={selectedDayId || ""}
              onChange={(e) => handleDaySelectSmP(e.target.value)}
              disabled={isLoading}
            >
              <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
              {days.map(day => (
                <option key={day.dayNumber} value={String(day.dayNumber)} className={selectedDayId === String(day.dayNumber) ? 'selected' : ''}>
                  {`Day ${day.dayNumber}: ${day.lessonName}`}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (!isLoading && !error) {
        return <div className="study-menu-section"><p>{t('studyModePage.noSyllabusDays', 'No syllabus days found for this language.')}</p></div>;
      }
    } else if (selectedRole === 'teacher') {
      if (days.length > 0) {
        return (
          <div className="study-menu-section">
            <label htmlFor="smp-teacher-day-select">{daySelectLabel}</label>
            <select
              id="smp-teacher-day-select"
              value={selectedDayId || ""}
              onChange={(e) => handleDaySelectSmP(e.target.value)}
              disabled={isLoading}
            >
              <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
              {days.map(day => (
                <option key={day.id} value={day.id} className={selectedDayId === day.id ? 'selected' : ''}>
                  {day.title?.[currentLangKey] || day.title?.COSYenglish || `Day ID: ${day.id}`}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (!isLoading && !error) {
        return <div className="study-menu-section"><p>{t('studyModePage.noTeacherDays', 'No days configured by teacher yet.')}</p></div>;
      }
    }
    return null;
  };

  // Render the main study mode page.
  return (
    <div className="study-mode-page-container">
      <h1>
        <TransliterableText text={t('studyMode.mainHeading', 'COSYlanguages - Study Mode 🎓')} />
      </h1>

      {currentLangKey && <LanguageHeader selectedLanguage={currentLangKey} />}

      {/* Language selection and other controls. */}
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

      {/* Role selection. */}
      <div className="study-menu-section">
        <label htmlFor="role-selector-buttons" id="study-choose-role-label">
          <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
        </label>
        <RoleSelector />
      </div>

      {/* Welcome message */}
      {!selectedRole && (
        <div className="welcome-message">
          <h2>Welcome to Study Mode!</h2>
          <p>Please select your role to begin.</p>
        </div>
      )}

      {/* Day selector. */}
      {renderStudentDaySelector()}

      {/* Error and loading messages. */}
      {error && <p className="error-message" role="alert">{error}</p>}
      {isLoading && selectedRole && (!days || days.length === 0) && !error && (
        <p role="status"><TransliterableText text={t('loading', 'Loading...')} /></p>
      )}

      {/* The main content area with a three-panel layout. */}
      <div className="study-content-area">
        {!selectedRole ? (
          <p id="study-welcome-message">
            <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
          </p>
        ) : selectedRole === 'student' ? (
          <StudentPage
            lessonSectionsForPanel={lessonSectionsForPanel}
            handleSectionSelectSmP={handleSectionSelectSmP}
            currentLangKey={currentLangKey}
            selectedSectionId={selectedSectionId}
            currentExerciseBlocks={currentExerciseBlocks}
          />
        ) : (
          <TeacherPage
            selectedDayId={selectedDayId}
            lessonSectionsForPanel={lessonSectionsForPanel}
            handleSectionSelectSmP={handleSectionSelectSmP}
            currentLangKey={currentLangKey}
            selectedSectionId={selectedSectionId}
          />
        )}
      </div>
    </div>
  );
};

export default StudyModePage;
