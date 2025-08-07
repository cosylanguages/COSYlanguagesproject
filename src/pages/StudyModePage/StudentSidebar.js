import React from 'react';
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel';
import ToolsPanel from '../../components/StudyMode/ToolsPanel';

const StudentSidebar = ({
    lessonSectionsForPanel,
    handleSectionSelectSmP,
    currentLangKey,
    selectedSectionId,
}) => {
    return (
        <>
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
            <div className="layout-right-panel">
                <ToolsPanel />
            </div>
        </>
    );
};

export default StudentSidebar;
