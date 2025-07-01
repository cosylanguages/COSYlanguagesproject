import React, { useState } from 'react'; // Removed useMemo, useEffect
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';

// Import Display Block Components
import TextBlock from '../../components/StudyMode/DisplayBlocks/TextBlock';
import MCQMultipleBlock from '../../components/StudyMode/DisplayBlocks/MCQMultipleBlock';

// Import the helper function for consistent ID generation
import { getBlockElementId } from './StudyModePage'; 

import './StudentDashboard.css'; 

const displayComponentMap = {
  'reading/text': TextBlock,
  'utility/note': TextBlock, 
  'comprehension/mcq-multiple': MCQMultipleBlock, // This component might need internal changes if it used progress
};

// const isBlockScoreable = (block) => { // Removed as scoring is removed
//   return block.typePath === 'comprehension/mcq-multiple';
// };

// const LESSON_PROGRESS_STORAGE_KEY_PREFIX = 'studentLessonProgress_'; // Removed
const MOCK_LESSON_ID = 'mockLesson123'; // This might be irrelevant now

const StudentDashboard = ({ lessonBlocks = [], lessonId = MOCK_LESSON_ID, onNavigateToBlock }) => { // Added onNavigateToBlock prop
  const { t } = useI18n();
  
  // const getStorageKey = (id) => `${LESSON_PROGRESS_STORAGE_KEY_PREFIX}${id}`; // Removed

  // const [blockAnswers, setBlockAnswers] = useState(() => { // Removed blockAnswers state
  //   // const savedAnswers = localStorage.getItem(getStorageKey(lessonId));
  //   // try {
  //   //   return savedAnswers ? JSON.parse(savedAnswers) : {};
  //   // } catch (error) {
  //   //   console.error("Error parsing saved answers from localStorage:", error);
  //   //   return {};
  //   // }
  //   return {}; // Default to empty if state was kept for other reasons, but it's tied to progress
  // }); 

  // useEffect(() => { // Removed useEffect for saving answers
  //   // try {
  //   //   localStorage.setItem(getStorageKey(lessonId), JSON.stringify(blockAnswers));
  //   // } catch (error) {
  //   //   console.error("Error saving answers to localStorage:", error);
  //   // }
  // }, [blockAnswers, lessonId]);

  // const handleBlockAnswer = (answerData) => { // Removed handleBlockAnswer
  //   // setBlockAnswers(prev => ({
  //   //   ...prev,
  //   //   [answerData.blockId]: {
  //   //     score: answerData.score,
  //   //     total: answerData.total,
  //   //   }
  //   // }));
  // };

  const handleNavigateBlock = (direction, currentIndex) => {
    let targetIndex;
    if (direction === 'previous') {
      targetIndex = currentIndex - 1;
    } else { // next
      targetIndex = currentIndex + 1;
    }

    if (targetIndex >= 0 && targetIndex < lessonBlocks.length) {
      const targetBlockId = lessonBlocks[targetIndex].id;
      if (onNavigateToBlock) {
        onNavigateToBlock(targetBlockId);
      } else {
        // Fallback if prop not passed, though it should be
        const elementId = getBlockElementId(targetBlockId);
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // const scoreSummary = useMemo(() => { // Removed scoreSummary
  //   let achievedScore = 0;
  //   let totalPossibleScore = 0;
  //   lessonBlocks.forEach(block => {
  //     // if (isBlockScoreable(block)) { // isBlockScoreable is also removed
  //     //   totalPossibleScore += 1; 
  //     //   if (blockAnswers[block.id]) {
  //     //     achievedScore += blockAnswers[block.id].score;
  //     //   }
  //     // }
  //   });
  //   return {
  //     achieved: achievedScore,
  //     possible: totalPossibleScore,
  //     percentage: totalPossibleScore > 0 ? Math.round((achievedScore / totalPossibleScore) * 100) : 0,
  //   };
  // }, [lessonBlocks, blockAnswers]); // blockAnswers is also removed

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
        {/* {scoreSummary.possible > 0 && ( // scoreSummary removed
          <div className="lesson-score-summary">
            <h3><TransliterableText text={t('studentDashboard.scoreSummaryTitle', 'Lesson Summary')} /></h3>
            <p><TransliterableText 
                text={t('studentDashboard.overallScore', 'Overall Score: {achieved}/{possible} ({percentage}%)', {
                  achieved: scoreSummary.achieved,
                  possible: scoreSummary.possible,
                  percentage: scoreSummary.percentage,
                })} /></p>
          </div>
        )} */}
      </div>
      
      <div className="lesson-content-student-view">
        {lessonBlocks.map((block, index) => {
          const DisplayComponent = displayComponentMap[block.typePath];
          if (DisplayComponent) {
            return (
              <div key={block.id} id={getBlockElementId(block.id)} className="student-lesson-block">
                <DisplayComponent 
                  blockData={block.data} 
                  // onAnswer={isBlockScoreable(block) ? handleBlockAnswer : undefined} // onAnswer and related logic removed
                />
                {/* {blockAnswers[block.id] && isBlockScoreable(block) && ( // blockAnswers and isBlockScoreable removed
                  <div className="block-score-feedback">
                    <TransliterableText 
                      text={t('studentDashboard.blockScore', 'Score: {score}/{total}', { 
                        score: blockAnswers[block.id].score, 
                        total: blockAnswers[block.id].total 
                      })} 
                    />
                  </div>
                )} */}
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
