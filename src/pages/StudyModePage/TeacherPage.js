// src/pages/StudyModePage/TeacherPage.js
import React, { useRef, useEffect } from 'react';
import TeacherDashboard from './TeacherDashboard';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';

const TeacherPage = ({
  selectedDayId,
  lessonSectionsForPanel,
  handleSectionSelectSmP,
  currentLangKey,
  selectedSectionId,
}) => {
  const mainContentRef = useRef(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedSectionId]);

  return (
    <div className="dashboard-layout">
      <div className="layout-left-panel">
        {selectedDayId && (
          <LessonSectionsPanel
            apiLessonSections={lessonSectionsForPanel}
            onSectionSelect={handleSectionSelectSmP}
            currentLangKey={currentLangKey}
            selectedSectionId={selectedSectionId}
            isStudentMode={false}
            selectedDayId={selectedDayId}
          />
        )}
      </div>
      <div className="layout-center-panel" ref={mainContentRef}>
        <TeacherDashboard
          selectedDayId={selectedDayId}
          key={selectedDayId}
        />
      </div>
      <div className="layout-right-panel">
        <ToolsPanel />
      </div>
    </div>
  );
};

export default TeacherPage;
