import React, { useState, useEffect } from 'react'; // Added useEffect for initial load
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import TemplateTypeSelectionModal from '../../components/StudyMode/TemplateTypeSelectionModal';
import { getDisplayNameForTemplatePath } from '../../config/templateSections';
import TextBlockConfig from '../../components/StudyMode/ConfigBlocks/TextBlockConfig';
import MCQMultipleBlockConfig from '../../components/StudyMode/ConfigBlocks/MCQMultipleBlockConfig';

// Import Display Block Components
import TextBlock from '../../components/StudyMode/DisplayBlocks/TextBlock';
import MCQMultipleBlock from '../../components/StudyMode/DisplayBlocks/MCQMultipleBlock';

// Import the helper function for consistent ID generation
import { getBlockElementId } from './StudyModePage'; // Assuming it's exported from there


import './TeacherDashboard.css'; 
import '../../components/StudyMode/ConfigBlocks/ConfigBlocks.css';

// DEV_NOTE: displayComponentMap is duplicated in StudentDashboard.js.
// Consider centralizing if it grows or needs to be kept strictly in sync.
const displayComponentMap = {
  'reading/text': TextBlock,
  'utility/note': TextBlock, // Assuming TextBlock can render notes too
  'comprehension/mcq-multiple': MCQMultipleBlock,
  // Add other mappings here as DisplayBlocks are created/confirmed
};

const TEACHER_LESSON_STORAGE_KEY = 'teacherSavedLesson_default'; // Fixed key for now

const TeacherDashboard = () => {
  const { t } = useI18n();
  const [lessonBlocks, setLessonBlocks] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // For save/load feedback

  // Explicit load on mount is disabled for now. User must click "Load Lesson".
  // useEffect(() => {
  //   handleLoadLesson(false); // false to suppress feedback on initial auto-load
  // }, []);


  const openTemplateModal = () => setIsTemplateModalOpen(true);
  const closeTemplateModal = () => setIsTemplateModalOpen(false);

  const displayFeedback = (messageKey, defaultText, isError = false) => {
    setFeedbackMessage({text: t(messageKey, defaultText), type: isError ? 'error' : 'success'});
    setTimeout(() => setFeedbackMessage(''), 3000); // Clear feedback after 3 seconds
  };

  const handleSelectTemplateType = (typePath, typeName) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      typePath: typePath,
      typeName: typeName || getDisplayNameForTemplatePath(typePath),
      data: { 
        title: { default: `New ${typeName || getDisplayNameForTemplatePath(typePath)}` },
        lang: null, 
      },
    };
    if (typePath === 'comprehension/mcq-multiple') {
      newBlock.data.question = { default: '' };
      newBlock.data.options = [];
    } else if (typePath === 'reading/text' || typePath === 'utility/note') { 
      newBlock.data.content = { default: '' };
    }
    setLessonBlocks(prevBlocks => [...prevBlocks, newBlock]);
    closeTemplateModal();
  };

  const handleRemoveBlock = (blockId) => {
    setLessonBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  };

  const handleOpenConfiguration = (block) => {
    setEditingBlock(block); 
  };

  const handleCloseConfiguration = () => {
    setEditingBlock(null);
  };

  const handleSaveBlockConfiguration = (updatedBlock) => {
    setLessonBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
    handleCloseConfiguration(); 
  };

  const handleMoveBlock = (blockId, direction) => {
    setLessonBlocks(prevBlocks => {
      const blocks = [...prevBlocks];
      const index = blocks.findIndex(block => block.id === blockId);
      if (index === -1) return blocks;

      if (direction === 'up' && index > 0) {
        [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
      }
      return blocks;
    });
  };

  const handleSaveLesson = () => {
    try {
      if (lessonBlocks.length === 0) {
        displayFeedback('teacherDashboard.lessonEmptySave', 'Cannot save an empty lesson.', true);
        return;
      }
      localStorage.setItem(TEACHER_LESSON_STORAGE_KEY, JSON.stringify(lessonBlocks));
      displayFeedback('teacherDashboard.lessonSavedSuccess', 'Lesson saved successfully!');
    } catch (error) {
      console.error("Error saving lesson to localStorage:", error);
      displayFeedback('teacherDashboard.lessonSavedError', 'Error saving lesson.', true);
    }
  };

  const handleLoadLesson = (showFeedback = true) => {
    try {
      const savedLessonJson = localStorage.getItem(TEACHER_LESSON_STORAGE_KEY);
      if (savedLessonJson) {
        const loadedBlocks = JSON.parse(savedLessonJson);
        if (Array.isArray(loadedBlocks)) {
          setLessonBlocks(loadedBlocks);
          if (showFeedback) displayFeedback('teacherDashboard.lessonLoadedSuccess', 'Lesson loaded successfully!');
        } else {
          console.error("Loaded lesson data is not an array:", loadedBlocks);
          if (showFeedback) displayFeedback('teacherDashboard.lessonLoadedErrorCorrupt', 'Could not load lesson: data is corrupt.', true);
          setLessonBlocks([]); 
        }
      } else {
        if (showFeedback) displayFeedback('teacherDashboard.lessonNotFound', 'No saved lesson found.', true);
      }
    } catch (error) {
      console.error("Error loading lesson from localStorage:", error);
      if (showFeedback) displayFeedback('teacherDashboard.lessonLoadedError', 'Error loading lesson.', true);
      setLessonBlocks([]); 
    }
  };

  const handleClearSavedLesson = () => {
    try {
      localStorage.removeItem(TEACHER_LESSON_STORAGE_KEY);
      displayFeedback('teacherDashboard.clearedSuccess', 'Saved lesson cleared from local storage.');
      // Optionally, also clear the current lessonBlocks in the UI:
      // setLessonBlocks([]); 
    } catch (error) {
      console.error("Error clearing saved lesson from localStorage:", error);
      displayFeedback('teacherDashboard.clearedError', 'Error clearing saved lesson.', true);
    }
  };
  
  const renderBlockItem = (block, index, totalBlocks) => {
    const DisplayComponent = displayComponentMap[block.typePath];
    return (
      // Assign the scrollable ID to this wrapper div
      <div key={block.id} id={getBlockElementId(block.id)} className="lesson-block-item-container">
        <div className="lesson-block-header">
            <span className="block-type-name"><TransliterableText text={t('teacherDashboard.blockTypeLabel', 'Type:')} /> <TransliterableText text={block.typeName} /></span>
            <div className="block-actions">
                <button 
                  onClick={() => handleMoveBlock(block.id, 'up')} 
                  className="btn btn-sm btn-light"
                  disabled={index === 0}
                  title={t('moveUpBtnTitle', 'Move Up')}><TransliterableText text={'↑'} /></button>
                <button 
                  onClick={() => handleMoveBlock(block.id, 'down')} 
                  className="btn btn-sm btn-light"
                  disabled={index === totalBlocks - 1}
                  title={t('moveDownBtnTitle', 'Move Down')}><TransliterableText text={'↓'} /></button>
                <button onClick={() => handleOpenConfiguration(block)} className="btn btn-sm btn-secondary">
                    <TransliterableText text={t('configureBtn') || 'Configure'} /></button>
                <button onClick={() => handleRemoveBlock(block.id)} className="btn btn-sm btn-danger">
                    <TransliterableText text={t('removeBtn') || 'Remove'} /></button>
            </div>
        </div>
        <div className="lesson-block-content-preview">
            {DisplayComponent ? <DisplayComponent blockData={block.data} /> : (
                <div className="block-info">
                    <p><em><TransliterableText text={t('teacherDashboard.noPreviewAvailable', { typeName: block.typeName })} /></em></p>
                    {block.data?.title?.default && <p>Title: <TransliterableText text={block.data.title.default} /></p>}
                </div>
            )}
        </div>
      </div>
    );
  };

  const renderBlockConfiguration = () => {
    if (!editingBlock) return null;
    const textBlockTypePaths = ['reading/text', 'utility/note']; 
    if (textBlockTypePaths.includes(editingBlock.typePath)) {
      return <TextBlockConfig block={editingBlock} onSave={handleSaveBlockConfiguration} onClose={handleCloseConfiguration} />;
    }
    if (editingBlock.typePath === 'comprehension/mcq-multiple') {
      return <MCQMultipleBlockConfig block={editingBlock} onSave={handleSaveBlockConfiguration} onClose={handleCloseConfiguration} />;
    }
    return (
      <div className="block-configuration-placeholder modal-content"> 
        <h3><TransliterableText text={t('configureBlockTitle', { blockName: editingBlock.typeName })} /></h3>
        <p><TransliterableText text={t('noConfigAvailableYet', { blockType: editingBlock.typeName })} /></p>
        <div className="modal-actions">
            <button onClick={handleCloseConfiguration} className="btn btn-secondary">
                <TransliterableText text={t('closeConfigBtn') || 'Close Configuration'} /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <h2>
          <TransliterableText text={t('studyMode.teacherDashboardHeading', 'Teacher Dashboard')} />
        </h2>
        <div className="dashboard-main-actions">
            <button onClick={() => handleLoadLesson()} className="btn btn-info load-lesson-btn">
                <TransliterableText text={t('loadLessonBtn', 'Load Lesson')} />
            </button>
            <button onClick={handleSaveLesson} className="btn btn-success save-lesson-btn">
                <TransliterableText text={t('saveLessonBtn', 'Save Lesson')} />
            </button>
            <button onClick={openTemplateModal} className="btn btn-primary add-block-btn">
            <TransliterableText text={t('addContentBlockBtn') || '+ Add Content Block'} />
            </button>
        </div>
      </div>
      
      {feedbackMessage && 
        <div className={`feedback-message ${feedbackMessage.type === 'error' ? 'feedback-error' : 'feedback-success'}`}>
          {feedbackMessage.text}
        </div>
      }
      
      <div className="dashboard-utility-actions">
        <button onClick={handleClearSavedLesson} className="btn btn-sm btn-warning clear-saved-lesson-btn">
            <TransliterableText text={t('clearSavedLessonBtn', 'Clear Saved Lesson (localStorage)')} />
        </button>
      </div>

      {lessonBlocks.length === 0 && !feedbackMessage && ( 
        <p className="no-blocks-message">
          <TransliterableText text={t('teacherDashboard.noBlocksMessage', 'No content blocks added yet. Click "Add Content Block" to start building your lesson or "Load Lesson" to load a saved one.')} />
        </p>
      )}
      {lessonBlocks.length > 0 && (
          <div className="lesson-blocks-list">
            {lessonBlocks.map((block, index) => renderBlockItem(block, index, lessonBlocks.length))}
          </div>
      )}

      {isTemplateModalOpen && (
        <TemplateTypeSelectionModal
          isOpen={isTemplateModalOpen}
          onClose={closeTemplateModal}
          onSelectTemplateType={handleSelectTemplateType}
        />
      )}

      {editingBlock && renderBlockConfiguration()}
      
    </div>
  );
};

export default TeacherDashboard;
