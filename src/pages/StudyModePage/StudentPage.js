// src/pages/StudyModePage/StudentPage.js
import React from 'react';
import StudentDashboard from './StudentDashboard';
import StudyProgressDashboard from '../../components/StudyMode/StudyProgressDashboard';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';

const StudentPage = ({
  lessonSectionsForPanel,
  handleSectionSelectSmP,
  currentLangKey,
  selectedSectionId,
  currentExerciseBlocks,
}) => {
  return (
    <div className="dashboard-layout">
      <div className="layout-left-panel">
        {lessonSectionsForPanel.length > 0 ? (
          <LessonSectionsPanel
            sectionsFromSyllabus={lessonSectionsForPanel}
            onSectionSelect={handleSectionSelectSmP}
            currentLangKey={currentLangKey}
            selectedSectionId={selectedSectionId}
            isStudentMode={true}
          />
        ) : (
          <p>No sections found for this day.</p>
        )}
      </div>
      <div className="layout-center-panel" id="main-content-panel">
        <StudyProgressDashboard progress={{ Vocabulary: 75, Grammar: 60, Listening: 85, Speaking: 50 }} />
        <StudentDashboard
          lessonBlocks={currentExerciseBlocks}
        />
      </div>
      <div className="layout-right-panel">
        <ToolsPanel />
      </div>
    </div>
  );
};

export default StudentPage;
