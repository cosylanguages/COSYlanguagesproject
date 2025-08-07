import React from 'react';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';

const TeacherSidebar = ({
    selectedDayId,
    lessonSectionsForPanel,
    handleSectionSelectSmP,
    currentLangKey,
    selectedSectionId,
}) => {
    return (
        <>
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
            <div className="layout-right-panel">
                <ToolsPanel />
            </div>
        </>
    );
};

export default TeacherSidebar;
