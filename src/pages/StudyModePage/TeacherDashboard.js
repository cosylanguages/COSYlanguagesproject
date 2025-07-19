import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import VirtualTutorTeacherView from '../../components/StudyMode/VirtualTutorTeacherView';
import TemplateTypeSelectionModal from '../../components/StudyMode/TemplateTypeSelectionModal';
import { getDisplayNameForTemplatePath } from '../../config/templateSections';
import TextBlockConfig from '../../components/StudyMode/TemplateConfig/ConfigureTextBlock';
import MCQMultipleBlockConfig from '../../components/StudyMode/TemplateConfig/ConfigureMCQMultipleBlock';
import WritingBlockConfig from '../../components/StudyMode/TemplateConfig/ConfigureWritingBlock';
import TemplateList from '../../components/StudyMode/TemplateList';
import TemplateEditor from '../../components/StudyMode/TemplateEditor';

// Import the centralized displayComponentMap
import { displayComponentMap } from '../../components/StudyMode/common/displayComponentMap';

// Import the helper function for consistent ID generation
import { getBlockElementId } from './StudyModePage'; // Assuming it's exported from there

// Import DayManager and LessonSectionManager
import DayManager from '../../components/StudyMode/DayManager';
import LessonSectionManager from '../../components/StudyMode/LessonSectionManager';
import { getLessonSectionDetails, updateLessonSection } from '../../api/lessonSections'; // Import APIs
import { useAuth } from '../../contexts/AuthContext'; // To get the auth token

import './TeacherDashboard.css'; 
import '../../components/StudyMode/TemplateConfig/SimpleTextConfig.css';

const TEACHER_LESSON_STORAGE_KEY = 'teacherSavedLesson_default'; // Fixed key for now

const TeacherDashboard = () => {
  const { t } = useI18n();
  const { authToken } = useAuth(); // Get authToken
  const [lessonBlocks, setLessonBlocks] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');
  const [editingBlock, setEditingBlock] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // For save/load feedback
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [currentSectionDetails, setCurrentSectionDetails] = useState(null); // State for full section data
  const [isVirtualTutorVisible, setIsVirtualTutorVisible] = useState(false);

  const displayFeedback = useCallback((messageKey, defaultText, isError = false) => {
    setFeedbackMessage({text: t(messageKey, defaultText), type: isError ? 'error' : 'success'});
    setTimeout(() => setFeedbackMessage(''), 3000); // Clear feedback after 3 seconds
  }, [t]); // t is from useI18n, considered stable

  useEffect(() => {
    if (selectedSectionId && authToken) {
      const fetchSectionContent = async () => {
        try {
          displayFeedback('teacherDashboard.loadingSectionContent', 'Loading section content...', false);
          const sectionDetailsFull = await getLessonSectionDetails(authToken, selectedSectionId);
          setCurrentSectionDetails(sectionDetailsFull); // Store full details
          setLessonBlocks(sectionDetailsFull.exerciseBlocks || []);
          // setFeedbackMessage(''); // Clearing feedback message here might be too soon if displayFeedback has a timeout
        } catch (error) {
          console.error("Error fetching section details:", error);
          displayFeedback('teacherDashboard.errorLoadingSectionContent', `Error loading section: ${error.message}`, true);
          setLessonBlocks([]); // Clear blocks on error
        }
      };
      fetchSectionContent();
    } else {
      setLessonBlocks([]); // Clear blocks if no section is selected or no token
       setCurrentSectionDetails(null); // Clear details too
    }
  }, [selectedSectionId, authToken, displayFeedback]); // Added displayFeedback

  const handleDaySelect = (dayId) => {
    setSelectedDayId(dayId);
    setSelectedSectionId(null); // Reset section when day changes
    setCurrentSectionDetails(null); // Clear details
  };

  const handleSectionSelect = (sectionId) => {
    setSelectedSectionId(sectionId);
  };

  const openTemplateModal = () => setIsTemplateModalOpen(true);
  const closeTemplateModal = () => setIsTemplateModalOpen(false);

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

  const handleSaveLesson = async () => {
    if (!selectedSectionId || !authToken || !currentSectionDetails) {
      displayFeedback('teacherDashboard.cannotSaveSection', 'No section selected or not authenticated. Cannot save.', true);
      if (!selectedSectionId && lessonBlocks.length > 0) {
        try {
          localStorage.setItem(TEACHER_LESSON_STORAGE_KEY, JSON.stringify(lessonBlocks));
          displayFeedback('teacherDashboard.lessonSavedToLocalSuccess', 'Lesson saved to Local Storage (no section selected).');
        } catch (e) {
          console.error("Error saving lesson to localStorage:", e);
          displayFeedback('teacherDashboard.lessonSavedToLocalError', 'Error saving lesson to Local Storage.', true);
        }
      }
      return;
    }

    try {
      await updateLessonSection(authToken, selectedSectionId, {
        title: currentSectionDetails.title, 
        exerciseBlocks: lessonBlocks,
      });
      displayFeedback('teacherDashboard.sectionSavedSuccess', 'Section content saved successfully to API!');
    } catch (error) {
      console.error("Error saving section to API:", error);
      displayFeedback('teacherDashboard.sectionSavedErrorAPI', `Error saving section: ${error.message}`, true);
    }
  };

  const handleLoadLesson = useCallback((showFeedback = true) => { // Wrapped in useCallback
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
  }, [displayFeedback]); // Added displayFeedback as a dependency

  // Example: useEffect for initial load (if ever re-enabled)
  // useEffect(() => {
  //   handleLoadLesson(false); 
  // }, [handleLoadLesson]); // Now depends on the memoized handleLoadLesson

  const handleClearSavedLesson = () => {
    try {
      localStorage.removeItem(TEACHER_LESSON_STORAGE_KEY);
      displayFeedback('teacherDashboard.clearedSuccess', 'Saved lesson cleared from local storage.');
    } catch (error) {
      console.error("Error clearing saved lesson from localStorage:", error);
      displayFeedback('teacherDashboard.clearedError', 'Error clearing saved lesson.', true);
    }
  };
  
  const renderBlockItem = (block, index, totalBlocks) => {
    const DisplayComponent = displayComponentMap[block.typePath];
    return (
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
    if (editingBlock.typePath === 'writing/prose') {
      return <WritingBlockConfig block={editingBlock} onSave={handleSaveBlockConfiguration} onClose={handleCloseConfiguration} />;
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
    <div className="teacher-dashboard-container-grid"> 
      <div className="teacher-dashboard-sidebar">
        <DayManager 
          onDaySelect={handleDaySelect} 
          selectedDayId={selectedDayId} 
        />
        {selectedDayId && (
          <LessonSectionManager 
            dayId={selectedDayId}
            onSectionSelect={handleSectionSelect}
            selectedSectionId={selectedSectionId}
          />
        )}
      </div>

      <div className="teacher-dashboard-main-content">
        <div className="dashboard-header">
          <h2>
            <TransliterableText text={t('studyMode.teacherDashboardHeading', 'Lesson Content Editor')} />
          </h2>
          <div className="dashboard-tabs">
            <button onClick={() => setActiveTab('lessons')} className={`btn ${activeTab === 'lessons' ? 'btn-primary' : 'btn-secondary'}`}>
              <TransliterableText text={t('teacherDashboard.tabs.lessons', 'Lessons')} />
            </button>
            <button onClick={() => setActiveTab('templates')} className={`btn ${activeTab === 'templates' ? 'btn-primary' : 'btn-secondary'}`}>
              <TransliterableText text={t('teacherDashboard.tabs.templates', 'Templates')} />
            </button>
            <button onClick={() => setIsVirtualTutorVisible(true)} className="btn btn-secondary">
                <TransliterableText text={'Virtual Tutor'} />
            </button>
          </div>
        </div>
        
        {feedbackMessage && 
          <div className={`feedback-message ${feedbackMessage.type === 'error' ? 'feedback-error' : 'feedback-success'}`}>
            {feedbackMessage.text}
          </div>
        }
        
        {activeTab === 'lessons' && (
          <>
            <div className="dashboard-main-actions">
                <button
                  onClick={() => handleLoadLesson()}
                  className="btn btn-info load-lesson-btn"
                  title={t('loadFromLocalStorageTitle') || "Load from Local Storage (Legacy)"}
                >
                    <TransliterableText text={t('loadLessonBtn', 'Load Lesson')} />
                </button>
                <button
                  onClick={handleSaveLesson}
                  className="btn btn-success save-lesson-btn"
                  disabled={!selectedSectionId}
                  title={selectedSectionId ? (t('saveToCurrentSectionAPITitle') || "Save to Current Section (API)") : (t('saveToLocalStorageTitle') || "Save to Local Storage (Legacy)")}
                >
                    <TransliterableText text={t('saveLessonBtn', 'Save Lesson')} />
                </button>
                <button
                  onClick={openTemplateModal}
                  className="btn btn-primary add-block-btn"
                  disabled={!selectedSectionId}
                  title={selectedSectionId ? (t('addContentBlockBtn') || '+ Add Content Block') : (t('selectSectionToAddBlockTitle') || "Select a section to add blocks")}
                >
                  <TransliterableText text={t('addContentBlockBtn') || '+ Add Content Block'} />
                </button>
            </div>
            <div className="dashboard-utility-actions">
              <button onClick={handleClearSavedLesson} className="btn btn-sm btn-warning clear-saved-lesson-btn">
                  <TransliterableText text={t('clearSavedLessonBtn', 'Clear Saved Lesson (localStorage)')} />
              </button>
            </div>

            {!selectedSectionId && (
                <p className="no-blocks-message">
                    <TransliterableText text={t('teacherDashboard.selectDayAndSectionMessage', 'Please select a Day and a Lesson Section to view or edit content.')} />
                </p>
            )}

            {selectedSectionId && lessonBlocks.length === 0 && !feedbackMessage && (
              <p className="no-blocks-message">
                <TransliterableText text={t('teacherDashboard.noBlocksInSectionMessage', 'This section is empty. Click "Add Content Block" to start building!')} />
              </p>
            )}
            {selectedSectionId && lessonBlocks.length > 0 && (
                <div className="lesson-blocks-list">
                  {lessonBlocks.map((block, index) => renderBlockItem(block, index, lessonBlocks.length))}
                </div>
            )}
          </>
        )}

        {activeTab === 'templates' && (
          <TemplateList openTemplateEditor={() => setIsTemplateEditorOpen(true)} />
        )}

        {isTemplateModalOpen && (
          <TemplateTypeSelectionModal
            isOpen={isTemplateModalOpen}
            onClose={closeTemplateModal}
            onSelectTemplateType={handleSelectTemplateType}
          />
        )}

        {editingBlock && renderBlockConfiguration()}

        {isTemplateEditorOpen && (
          <TemplateEditor
            onSave={() => {}}
            onClose={() => setIsTemplateEditorOpen(false)}
          />
        )}
        {isVirtualTutorVisible && <VirtualTutorTeacherView />}
      </div>
    </div>
  );
};

export default TeacherDashboard;
