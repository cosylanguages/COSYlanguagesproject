// src/pages/StudyModePage/TeacherPage.js
import React, { useRef, useEffect } from 'react';
import TeacherDashboard from './TeacherDashboard';
import TeacherSidebar from './TeacherSidebar';

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
      <TeacherSidebar
        selectedDayId={selectedDayId}
        lessonSectionsForPanel={lessonSectionsForPanel}
        handleSectionSelectSmP={handleSectionSelectSmP}
        currentLangKey={currentLangKey}
        selectedSectionId={selectedSectionId}
      />
      <div className="layout-center-panel" ref={mainContentRef}>
        <TeacherDashboard
          selectedDayId={selectedDayId}
          key={selectedDayId}
        />
      </div>
    </div>
  );
};

export default TeacherPage;
