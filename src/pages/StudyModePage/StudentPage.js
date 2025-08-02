// src/pages/StudyModePage/StudentPage.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import StudentDashboard from './StudentDashboard';
import StudyProgressDashboard from '../../components/StudyMode/StudyProgressDashboard';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { getStudentProgress } from '../../api/api';

const StudentPage = ({
  lessonSectionsForPanel,
  currentLangKey,
  currentExerciseBlocks,
}) => {
  const mainContentRef = useRef(null);
  const { currentUser, authToken } = useAuth();
  const { language } = useI18n();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    if (!currentUser || !language || !authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentProgress(language, currentUser.id, authToken);
      setProgress(data);
    } catch (err)
{
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, language, authToken]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return (
    <div className="dashboard-layout">
      <div className="layout-left-panel">
        {loading && <p>Loading progress...</p>}
        {error && <p className="error-message">{error}</p>}
        {progress && <StudyProgressDashboard progress={progress} />}
        {lessonSectionsForPanel.length > 0 ? (
          <LessonSectionsPanel
            sectionsFromSyllabus={lessonSectionsForPanel}
            currentLangKey={currentLangKey}
            isStudentMode={true}
            exerciseBlocks={currentExerciseBlocks}
          />
        ) : (
          <p>No sections found for this day.</p>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
