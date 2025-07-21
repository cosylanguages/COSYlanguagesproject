import React, { useState } from 'react';
import StudyModeBanner from '../../components/StudyMode/StudyModeBanner';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import MistakeNotebook from '../../components/StudyMode/MistakeNotebook';
import GrammarReview from '../../components/StudyMode/GrammarReview';
import VirtualTutor from '../../components/StudyMode/VirtualTutor';
import SmartReview from '../../components/StudyMode/SmartReview';
import TodaysFocus from '../../components/Personalization/TodaysFocus';
import MyLearningGarden from '../../components/Gamification/MyLearningGarden';
import CosyCorner from '../../components/Community/CosyCorner';
import LanguagePet from '../../components/Gamification/LanguagePet';
import SouvenirCollection from '../../components/Gamification/SouvenirCollection';
import CosyStreaks from '../../components/Gamification/CosyStreaks';
import StudyFillInTheBlanks from '../../components/StudyMode/exercises/StudyFillInTheBlanks';
import StudySentenceUnscramble from '../../components/StudyMode/exercises/StudySentenceUnscramble';

// Import the centralized displayComponentMap
import { displayComponentMap } from '../../components/StudyMode/common/displayComponentMap';

// Import the helper function for consistent ID generation
// getBlockElementId is now defined in StudyModePage and expects (blockId, index)
import { getBlockElementId } from './StudyModePage'; 

import './StudentDashboard.css'; 

const StudentDashboard = ({ lessonBlocks = [] }) => {
  const { t } = useI18n();
  const [isMistakeNotebookVisible, setIsMistakeNotebookVisible] = useState(false);
  const [isGrammarReviewVisible, setIsGrammarReviewVisible] = useState(false);
  const [isVirtualTutorVisible, setIsVirtualTutorVisible] = useState(false);
  const [isSmartReviewVisible, setIsSmartReviewVisible] = useState(false);
  const [isFillInTheBlanksVisible, setIsFillInTheBlanksVisible] = useState(false);
  const [isSentenceUnscrambleVisible, setIsSentenceUnscrambleVisible] = useState(false);
  
  const handleNavigateBlock = (direction, currentIndex) => {
    let targetIndex;
    if (direction === 'previous') {
      targetIndex = currentIndex - 1;
    } else { // next
      targetIndex = currentIndex + 1;
    }

    if (targetIndex >= 0 && targetIndex < lessonBlocks.length) {
      // Syllabus blocks might not have an 'id'. Use index for reliable ID generation.
      const targetBlock = lessonBlocks[targetIndex];
      // Assuming block.title or block.block_type could serve as a pseudo-id if available, else use index.
      const elementId = getBlockElementId(targetBlock.id || targetBlock.title || targetBlock.block_type, targetIndex);
      const element = document.getElementById(elementId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <StudyModeBanner />
      <div className="cosy-dashboard">
        <TodaysFocus />
        <MyLearningGarden />
        <CosyCorner />
        <LanguagePet />
        <SouvenirCollection />
        <CosyStreaks />
      </div>
      <div className="lesson-header">
        {/* TODO: Display actual lesson name from syllabus if available */}
        <h2><TransliterableText text={t('studyMode.lessonTitlePlaceholder', 'Current Lesson')} /></h2>
        <button onClick={() => setIsMistakeNotebookVisible(true)}>Mistake Notebook</button>
        <button onClick={() => setIsGrammarReviewVisible(true)}>Grammar Review</button>
        <button onClick={() => setIsVirtualTutorVisible(true)}>Virtual Tutor</button>
        <button onClick={() => setIsSmartReviewVisible(true)}>Smart Review</button>
        <button onClick={() => setIsFillInTheBlanksVisible(true)}>Fill in the Blanks</button>
        <button onClick={() => setIsSentenceUnscrambleVisible(true)}>Sentence Unscramble</button>
      </div>
      
      {isMistakeNotebookVisible && <MistakeNotebook />}
      {isGrammarReviewVisible && <GrammarReview />}
      {isVirtualTutorVisible && <VirtualTutor />}
      {isSmartReviewVisible && <SmartReview userId="123" />}
      {isFillInTheBlanksVisible && <StudyFillInTheBlanks language={t('currentLanguage')} />}
      {isSentenceUnscrambleVisible && <StudySentenceUnscramble language={t('currentLanguage')} />}

      <div className="lesson-content-student-view">
        {lessonBlocks.map((block, index) => {
          // Syllabus uses 'block_type', displayComponentMap might use 'typePath' or will be updated.
          // For now, assume displayComponentMap will be keyed by 'block_type'.
          const componentKey = block.block_type;
          const DisplayComponent = displayComponentMap[componentKey];

          // Use index for key as block.id might not exist or be unique in syllabus JSON.
          // block.title or block.block_type can be part of a more unique id if needed.
          const blockDomId = getBlockElementId(block.id || block.title || block.block_type, index);

          if (DisplayComponent) {
            return (
              // Using index as key is acceptable if list items don't have stable IDs and are not reordered.
              <div key={index} id={blockDomId} className="student-lesson-block">
                <DisplayComponent 
                  blockData={block} // Pass the whole block from syllabus as blockData
                />
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
            // Fallback for unknown block types
            <div key={index} id={blockDomId} className="student-lesson-block-fallback">
              <p>
                <TransliterableText
                  text={t('studentDashboard.unknownBlockType', 'Content block type "{blockType}" cannot be displayed yet.', { blockType: block.block_type || 'Unknown' })}
                />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
