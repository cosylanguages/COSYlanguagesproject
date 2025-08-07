import React, { useRef, useEffect } from 'react';
import StudentDashboard from './StudentDashboard';
import StudyProgressDashboard from '../../components/StudyMode/StudyProgressDashboard';
import StudentSidebar from './StudentSidebar';
import { useStudentProgress } from '../../hooks/useStudentProgress';

const StudentPage = ({
  lessonSectionsForPanel,
  handleSectionSelectSmP,
  currentLangKey,
  selectedSectionId,
  currentExerciseBlocks,
}) => {
  const mainContentRef = useRef(null);
  const { progress, loading, error } = useStudentProgress();

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedSectionId]);

  return (
    <div className="dashboard-layout">
      <StudentSidebar
        lessonSectionsForPanel={lessonSectionsForPanel}
        handleSectionSelectSmP={handleSectionSelectSmP}
        currentLangKey={currentLangKey}
        selectedSectionId={selectedSectionId}
      />
      <div className="layout-center-panel" ref={mainContentRef}>
        {loading && <p>Loading progress...</p>}
        {error && <p className="error-message">{error}</p>}
        {progress && <StudyProgressDashboard progress={progress} />}
        <StudentDashboard
          lessonBlocks={currentExerciseBlocks}
        />
      </div>
    </div>
  );
};

export default StudentPage;
