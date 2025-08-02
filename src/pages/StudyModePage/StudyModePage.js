// src/pages/StudyModePage/StudyModePage.js
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStudentData } from '../../hooks/useStudentData';
import { useTeacherData } from '../../hooks/useTeacherData';
import { useStudyMode } from '../../hooks/useStudyMode';
import RoleSelector from './RoleSelector';
import StudentPage from './StudentPage';
import TeacherPage from './TeacherPage';
import TransliterableText from '../../components/Common/TransliterableText';
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';
import Button from '../../components/Common/Button';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import LanguageHeader from '../../components/Common/LanguageHeader';
import './StudyModePage.css';

import StudyLayout from '../../components/Layout/StudyLayout';

const StudyModePage = () => {
  const { t, language, currentLangKey } = useI18n();
  const { authToken } = useAuth();
  const { selectedRole, selectedDayId, handleDaySelect, selectedSectionId, handleSectionSelect } = useStudyMode();

  const {
    days: studentDays,
    lessonSectionsForPanel: studentLessonSections,
    currentExerciseBlocks: studentExerciseBlocks,
    isLoading: isStudentLoading,
    error: studentError,
  } = useStudentData(language, selectedDayId, selectedSectionId);

  const {
    days: teacherDays,
    lessonSectionsForPanel: teacherLessonSections,
    isLoading: isTeacherLoading,
    error: teacherError,
  } = useTeacherData(authToken, selectedDayId, selectedSectionId);

  const isLoading = isStudentLoading || isTeacherLoading;
  const error = studentError || teacherError;
  const days = selectedRole === 'student' ? studentDays : teacherDays;
  const lessonSectionsForPanel = selectedRole === 'student' ? studentLessonSections : teacherLessonSections;

  const renderDaySelector = () => {
    const daySelectLabel = <TransliterableText text={t('studyModePage.selectDayLabel', 'Select Day:')} />;

    if (selectedRole === 'student') {
      if (days.length > 0) {
        return (
          <div className="study-menu-section">
            <label htmlFor="smp-student-day-select">{daySelectLabel}</label>
            <select
              id="smp-student-day-select"
              value={selectedDayId || ""}
              onChange={(e) => handleDaySelect(e.target.value)}
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
              onChange={(e) => handleDaySelect(e.target.value)}
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
    <StudyLayout>
      <div className="study-mode-page-container">
        {currentLangKey && <LanguageHeader selectedLanguage={currentLangKey} />}

        <div className="study-menu-section">
          <label htmlFor="language-select" id="study-choose-language-label">
            <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
          </label>
          <LanguageSelector />
          <ToggleLatinizationButton
            currentDisplayLanguage={currentLangKey || language}
          />
          <Button onClick={() => window.location.href = '/freestyle'}>
            <TransliterableText text={t('studyModePage.freestyleButton', 'Freestyle 🚀')} />
          </Button>
        </div>

        <div className="study-menu-section">
          <label htmlFor="role-selector-buttons" id="study-choose-role-label">
            <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
          </label>
          <RoleSelector />
        </div>

        {!selectedRole && (
          <div className="welcome-message">
            <h2><TransliterableText text={t('studyModePage.welcomeHeading', 'Welcome to Study Mode!')} /></h2>
            <p><TransliterableText text={t('studyModePage.welcomeMessage', 'Please select your role to begin.')} /></p>
          </div>
        )}

        {renderDaySelector()}

        {error && <p className="error-message" role="alert">{error}</p>}
        {isLoading && selectedRole && (!days || days.length === 0) && !error && (
          <p role="status"><TransliterableText text={t('loading', 'Loading...')} /></p>
        )}

        <div className="study-content-area">
          {!selectedRole ? (
            <p id="study-welcome-message">
              <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
            </p>
          ) : selectedRole === 'student' ? (
            <StudentPage
              lessonSectionsForPanel={lessonSectionsForPanel}
              handleSectionSelectSmP={handleSectionSelect}
              currentLangKey={currentLangKey}
              selectedSectionId={selectedSectionId}
              currentExerciseBlocks={studentExerciseBlocks}
            />
          ) : (
            <TeacherPage
              selectedDayId={selectedDayId}
              lessonSectionsForPanel={lessonSectionsForPanel}
              handleSectionSelectSmP={handleSectionSelect}
              currentLangKey={currentLangKey}
              selectedSectionId={selectedSectionId}
            />
          )}
        </div>
      </div>
    </StudyLayout>
  );
};

export default StudyModePage;
