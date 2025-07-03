import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import { useAuth } from '../../AuthContext';
import { fetchDays } from '../../api/days';
import { fetchLessonSections, getLessonSectionDetails } from '../../api/lessonSections';
import RoleSelector from './RoleSelector'; 
import StudentDashboard from './StudentDashboard'; 
import TeacherDashboard from './TeacherDashboard'; 
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel'; 
import ToolsPanel from '../../components/StudyMode/ToolsPanel'; 
import TransliterableText from '../../components/Common/TransliterableText'; 
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';

import './StudyModePage.css'; 

// Helper function (can be moved to a utility file if used elsewhere)
export const getBlockElementId = (blockId) => `lesson-block-content-${blockId}`;

const StudyModePage = () => {
  const { t, language, currentLangKey } = useI18n();
  const { authToken } = useAuth();

  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('selectedRole') || null);
  
  // API Data State
  const [days, setDays] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [lessonSectionsForPanel, setLessonSectionsForPanel] = useState([]); // Sections for the LessonSectionsPanel
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [currentExerciseBlocks, setCurrentExerciseBlocks] = useState([]); // Exercise blocks for StudentDashboard

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Effects for Data Fetching ---

  // Effect to fetch all days
  useEffect(() => {
    if (authToken) {
      setIsLoading(true);
      fetchDays(authToken)
        .then(data => {
          setDays(data || []);
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching days:", err);
          setError(t('studyModePage.errorFetchingDays', 'Failed to load study days.'));
          setDays([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setDays([]); 
      setSelectedDayId(null);
    }
  }, [authToken, t]);

  // Effect to fetch lesson sections when a day is selected
  useEffect(() => {
    if (selectedDayId && authToken) {
      setIsLoading(true);
      fetchLessonSections(authToken, selectedDayId)
        .then(data => {
          setLessonSectionsForPanel(data || []);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching sections for day ${selectedDayId}:`, err);
          setError(t('studyModePage.errorFetchingSections', 'Failed to load lesson sections.'));
          setLessonSectionsForPanel([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setLessonSectionsForPanel([]); 
      setSelectedSectionId(null); 
    }
  }, [selectedDayId, authToken, t]);

  // Effect to fetch exercise blocks for the selected section (primarily for StudentDashboard)
  useEffect(() => {
    if (selectedSectionId && authToken && selectedRole === 'student') {
      setIsLoading(true);
      getLessonSectionDetails(authToken, selectedSectionId)
        .then(data => {
          setCurrentExerciseBlocks(data.exerciseBlocks || []);
          setError(null);
        })
        .catch(err => {
          console.error(`Error fetching details for section ${selectedSectionId}:`, err);
          setError(t('studyModePage.errorFetchingSectionContent', 'Failed to load section content.'));
          setCurrentExerciseBlocks([]);
        })
        .finally(() => setIsLoading(false));
    } else if (selectedRole === 'student') { 
      setCurrentExerciseBlocks([]);
    }
  }, [selectedSectionId, authToken, selectedRole, t]);

  // --- UI Handlers and Local Storage ---

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    } else {
      localStorage.removeItem('selectedRole');
    }
  }, [selectedRole]);

  const handleRoleSelect = (role) => {
    setSelectedRole(prevRole => prevRole === role ? null : role);
    setSelectedDayId(null);
    setSelectedSectionId(null);
    setLessonSectionsForPanel([]);
    setCurrentExerciseBlocks([]);
    setError(null);
  };
  
  const handleDaySelectSmP = (dayId) => {
    setSelectedDayId(dayId);
    setSelectedSectionId(null); 
    setCurrentExerciseBlocks([]); 
  };

  const handleSectionSelectSmP = (sectionId) => {
    setSelectedSectionId(sectionId);
    const mainContentPanel = document.getElementById('main-content-panel');
    if (mainContentPanel) {
      mainContentPanel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const renderStudentDaySelector = () => {
    if (selectedRole === 'student' && days.length > 0) {
      return (
        <div className="study-menu-section">
          <label htmlFor="smp-day-select">
            <TransliterableText text={t('studyModePage.selectDayLabel', 'Select Day:')} />
          </label>
          <select 
            id="smp-day-select" 
            value={selectedDayId || ""} 
            onChange={(e) => handleDaySelectSmP(e.target.value)}
            disabled={isLoading}
          >
            <option value="">{t('studyModePage.selectDayOption', '-- Select a Day --')}</option>
            {days.map(day => (
              <option key={day.id} value={day.id}>
                {day.title?.[currentLangKey] || day.title?.COSYenglish || day.id}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="study-mode-page-container">
      <h1>
        <TransliterableText text={t('studyMode.mainHeading', 'COSYlanguages - Study Mode')} />
      </h1>
      
      <div className="study-menu-section">
        <label htmlFor="language-select" id="study-choose-language-label">
          <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
        </label>
        <LanguageSelector /> 
        <ToggleLatinizationButton 
          currentDisplayLanguage={currentLangKey || language}
        />
      </div>

      <div className="study-menu-section">
        <label htmlFor="role-selector-buttons" id="study-choose-role-label"> 
            <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
        </label>
        <RoleSelector onSelectRole={handleRoleSelect} currentRole={selectedRole} />
      </div>

      {renderStudentDaySelector()}

      {error && <p className="error-message" role="alert">{error}</p>}
      {isLoading && !error && <p role="status"><TransliterableText text={t('loading', 'Loading...')} /></p>}
      
      <div className="study-content-area">
        {!selectedRole ? (
          <p id="study-welcome-message">
            <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
          </p>
        ) : (
          <div className="dashboard-layout">
            <div className="layout-left-panel">
              {selectedDayId ? (
                <LessonSectionsPanel 
                  apiLessonSections={lessonSectionsForPanel} 
                  onSectionSelect={handleSectionSelectSmP} 
                  currentLangKey={currentLangKey}
                  selectedSectionId={selectedSectionId} 
                />
              ) : (
                selectedRole === 'student' && !isLoading && days.length > 0 &&
                <p><TransliterableText text={t('studyModePage.pleaseSelectDay', 'Please select a day to see lesson sections.')} /></p>
              )}
            </div>
            <div className="layout-center-panel" id="main-content-panel">
              {selectedRole === 'student' && 
                <StudentDashboard 
                  lessonBlocks={currentExerciseBlocks} 
                />}
              {selectedRole === 'teacher' && 
                <TeacherDashboard />
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
