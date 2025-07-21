import React, { useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStudy } from '../../contexts/StudyContext';
import { fetchDays as fetchTeacherDays } from '../../api/days';
import { fetchLessonSections as fetchTeacherLessonSections, getLessonSectionDetails as getTeacherLessonSectionDetails } from '../../api/lessonSections';
import { getAvailableSyllabusDays, fetchSyllabusByFileName } from '../../utils/syllabusService';
import RoleSelector from './RoleSelector';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudyProgressDashboard from '../../components/StudyMode/StudyProgressDashboard';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';
import TransliterableText from '../../components/Common/TransliterableText';
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';
import Button from '../../components/Common/Button';
import CosyLanguageSelector from '../../components/LanguageSelector/CosyLanguageSelector';

import './StudyModePage.css';

export const getBlockElementId = (blockId, index) => `lesson-block-content-${blockId || `gen-${index}`}`;

const StudyModePage = () => {
  const { t, language, changeLanguage, currentLangKey } = useI18n();
  const { authToken } = useAuth();
  const {
    selectedRole,
    setSelectedRole,
    selectedDayId,
    setSelectedDayId,
    selectedSectionId,
    setSelectedSectionId,
  } = useStudy();

  const [days, setDays] = React.useState([]);
  const [currentSyllabus, setCurrentSyllabus] = React.useState(null);
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = React.useState([]);
  const [currentExerciseBlocks, setCurrentExerciseBlocks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

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

  useEffect(() => {
    if (!selectedDayId) {
      setCurrentSyllabus(null);
      setLessonSectionsForPanel([]);
      setSelectedSectionId(null);
      setCurrentExerciseBlocks([]);
      return;
    }

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

  useEffect(() => {
    if (!selectedSectionId) {
      setCurrentExerciseBlocks([]);
      return;
    }

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

  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(prevRole => {
      const newRole = prevRole === role ? null : role;
      if (prevRole !== newRole) {
        setDays([]);
        setSelectedDayId(null);
        setCurrentSyllabus(null);
        setLessonSectionsForPanel([]);
        setSelectedSectionId(null);
        setCurrentExerciseBlocks([]);
        setError(null);
      }
      return newRole;
    });
  }, [setSelectedRole, setSelectedDayId, setSelectedSectionId]);

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

  const handleSectionSelectSmP = (sectionIdentifier) => {
    setSelectedSectionId(sectionIdentifier);
    const mainContentPanel = document.getElementById('main-content-panel');
    if (mainContentPanel) {
      mainContentPanel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                <option key={day.dayNumber} value={String(day.dayNumber)}>
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
                <option key={day.id} value={day.id}>
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

  return (
    <div className="study-mode-page-container">
      <h1>
        <TransliterableText text={t('studyMode.mainHeading', 'COSYlanguages - Study Mode 🎓')} />
      </h1>

      <div className="study-menu-section">
        <label htmlFor="language-select" id="study-choose-language-label">
          <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
        </label>
        <CosyLanguageSelector
          selectedLanguage={language}
          onLanguageChange={changeLanguage}
        />
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
              ) : selectedDayId && !isLoading && !error ? (
                <p>
                  {selectedRole === 'student'
                    ? t('studyModePage.noSectionsInSyllabus', 'No sections found in the syllabus for this day.')
                    : t('studyModePage.noSectionsForTeacherDay', 'No sections configured for this day yet.')
                  }
                </p>
              ) : (
                selectedRole && !isLoading && days && days.length > 0 && !error && (
                  <p>
                    {selectedRole === 'student'
                      ? t('studyModePage.pleaseSelectDay', 'Please select a day to see lesson sections.')
                      : t('studyModePage.teacherPleaseSelectDay', 'Please select a day to manage its sections.')
                    }
                  </p>
                )
              )}
              {!isLoading && (!days || days.length === 0) && selectedRole && !error && !selectedDayId && (
                <p>
                </p>
              )}
            </div>
            <div className="layout-center-panel" id="main-content-panel">
              {selectedRole === 'student' &&
                <>
                  <StudyProgressDashboard progress={{ Vocabulary: 75, Grammar: 60, Listening: 85, Speaking: 50 }} />
                  <StudentDashboard
                    lessonBlocks={currentExerciseBlocks}
                  />
                </>}
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
