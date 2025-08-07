import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStudentData } from '../../hooks/useStudentData';
import { useTeacherData } from '../../hooks/useTeacherData';
import { useStudyMode } from '../../hooks/useStudyMode';
import RoleSelector from './RoleSelector';
import StudentPage from './StudentPage';
import TeacherPage from './TeacherPage';
import DaySelector from './DaySelector';
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

        <DaySelector
          role={selectedRole}
          days={days}
          selectedDayId={selectedDayId}
          onDaySelect={handleDaySelect}
          isLoading={isLoading}
          error={error}
        />

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
