import React from 'react'; // Removed useState as it's no longer used after removing blockAnswers
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';

// Import the centralized displayComponentMap
import { displayComponentMap } from '../../components/StudyMode/common/displayComponentMap';

// Import the helper function for consistent ID generation
import { getBlockElementId } from './StudyModePage'; 

import './StudentDashboard.css'; 

// const MOCK_LESSON_ID = 'mockLesson123'; // This might be irrelevant now if lessonId prop is always provided

// Props: lessonBlocks
const StudentDashboard = ({ lessonBlocks = [] }) => {
  const { t } = useI18n();
  
  // All state (blockAnswers) and effects related to progress/scoring have been removed.
  // All functions (getStorageKey, handleBlockAnswer) related to progress/scoring have been removed.
  // All memoized calculations (scoreSummary) related to progress/scoring have been removed.

  const handleNavigateBlock = (direction, currentIndex) => {
    let targetIndex;
    if (direction === 'previous') {
      targetIndex = currentIndex - 1;
    } else { // next
      targetIndex = currentIndex + 1;
    }

    if (targetIndex >= 0 && targetIndex < lessonBlocks.length) {
      const targetBlockId = lessonBlocks[targetIndex].id;
      const elementId = getBlockElementId(targetBlockId);
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!lessonBlocks || lessonBlocks.length === 0) {
    return (
      <div className="student-dashboard-container">
        <h2><TransliterableText text={t('studyMode.studentDashboardHeading', 'Student Dashboard')} /></h2>
        <p><TransliterableText text={t('studentDashboard.noLessonContent', 'No lesson content is currently available.')} /></p>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      <div className="lesson-header">
        <h2><TransliterableText text={t('studyMode.lessonTitlePlaceholder', 'Current Lesson')} /></h2>
        {/* Score summary display has been removed */}
      </div>
      
      <div className="lesson-content-student-view">
        {lessonBlocks.map((block, index) => {
          const DisplayComponent = displayComponentMap[block.typePath];
          if (DisplayComponent) {
            return (
              <div key={block.id} id={getBlockElementId(block.id)} className="student-lesson-block">
                <DisplayComponent 
                  blockData={block.data} 
                  // No onAnswer prop is passed as scoring is removed.
                />
                {/* Block score feedback display has been removed */}
                <div className="block-navigation-actions">
                  <button 
                    onClick={() => handleNavigateBlock('previous', index)} 
                    disabled={index === 0}
                    className="btn btn-sm btn-outline-secondary prev-block-btn"
                  >
                    <TransliterableText text={t('studentDashboard.prevBlockBtn', 'Previous')} />
                  </button>
                  <span className="block-nav-page-info">
                    <TransliterableText 
                        text={t('studentDashboard.blockPageInfo', 'Block {current}/{totalBlocks}', {
                            current: index + 1,
                            totalBlocks: lessonBlocks.length
                        })}
                    />
                  </span>
                  <button 
                    onClick={() => handleNavigateBlock('next', index)} 
                    disabled={index === lessonBlocks.length - 1}
                    className="btn btn-sm btn-outline-secondary next-block-btn"
                  >
                    <TransliterableText text={t('studentDashboard.nextBlockBtn', 'Next')} />
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div key={block.id} id={getBlockElementId(block.id)} className="student-lesson-block-fallback">
              <p><TransliterableText text={t('studentDashboard.unknownBlockType', 'Content block type "{typeName}" cannot be displayed.', { typeName: block.typeName })} /></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
