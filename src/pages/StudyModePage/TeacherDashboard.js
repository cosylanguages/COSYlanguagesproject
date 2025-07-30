// Import necessary libraries, hooks, and components.
import React, { useState, useEffect, useCallback } from 'react';
import StudyModeBanner from '../../components/StudyMode/StudyModeBanner';
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
import { displayComponentMap } from '../../components/StudyMode/common/displayComponentMap';
import { getBlockElementId } from './utils';
import DayManager from '../../components/StudyMode/DayManager';
import LessonSectionManager from '../../components/StudyMode/LessonSectionManager';
import { getLessonSectionDetails, updateLessonSection } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import LessonEditor from '../../components/StudyMode/LessonEditor';

// Import the CSS for this component.
import './TeacherDashboard.css'; 
import '../../components/StudyMode/TemplateConfig/SimpleTextConfig.css';
import { logos, flags } from '../../config/languageAssets';

/**
 * The teacher's dashboard in Study Mode.
 * This component provides an interface for teachers to create, edit, and manage lesson content.
 * It includes a lesson editor, template management, and tools for organizing days and lesson sections.
 * @returns {JSX.Element} The TeacherDashboard component.
 */
const TeacherDashboard = () => {
  const { t, i18n } = useI18n();
  const { authToken } = useAuth();
  // State for managing lesson blocks, modals, tabs, and other UI elements.
  const { currentLangKey, allTranslations } = i18n || { currentLangKey: null, allTranslations: {} };
  const [lessonBlocks, setLessonBlocks] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');
  const [editingBlock, setEditingBlock] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [currentSectionDetails, setCurrentSectionDetails] = useState(null);
  const [isVirtualTutorVisible, setIsVirtualTutorVisible] = useState(false);

  /**
   * Displays a feedback message to the user.
   * @param {string} messageKey - The key for the translated message.
   * @param {string} defaultText - The default text to display if the translation is not found.
   * @param {boolean} [isError=false] - Whether the message is an error message.
   */
  const displayFeedback = useCallback((messageKey, defaultText, isError = false) => {
    setFeedbackMessage({text: t(messageKey, defaultText), type: isError ? 'error' : 'success'});
    setTimeout(() => setFeedbackMessage(''), 3000);
  }, [t]);

  // Effect to fetch lesson content when a section is selected.
  useEffect(() => {
    if (selectedSectionId && authToken) {
      const fetchSectionContent = async () => {
        try {
          displayFeedback('teacherDashboard.loadingSectionContent', 'Loading section content...', false);
          const sectionDetailsFull = await getLessonSectionDetails(authToken, selectedSectionId);
          setCurrentSectionDetails(sectionDetailsFull);
          setLessonBlocks(sectionDetailsFull.exerciseBlocks || []);
        } catch (error) {
          console.error("Error fetching section details:", error);
          displayFeedback('teacherDashboard.errorLoadingSectionContent', `Error loading section: ${error.message}`, true);
          setLessonBlocks([]);
        }
      };
      fetchSectionContent();
    } else {
      setLessonBlocks([]);
       setCurrentSectionDetails(null);
    }
  }, [selectedSectionId, authToken, displayFeedback]);

  /**
   * Handles the selection of a day.
   * @param {string} dayId - The ID of the selected day.
   */
  const handleDaySelect = (dayId) => {
    setSelectedDayId(dayId);
    setSelectedSectionId(null);
    setCurrentSectionDetails(null);
  };

  /**
   * Handles the selection of a lesson section.
   * @param {string} sectionId - The ID of the selected section.
   */
  const handleSectionSelect = (sectionId) => {
    setSelectedSectionId(sectionId);
  };

  // Functions to open and close the template selection modal.
  const openTemplateModal = () => setIsTemplateModalOpen(true);
  const closeTemplateModal = () => setIsTemplateModalOpen(false);

  /**
   * Handles the selection of a template type from the modal.
   * @param {string} typePath - The path of the selected template type.
   * @param {string} typeName - The name of the selected template type.
   */
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

  /**
   * Removes a lesson block from the lesson.
   * @param {string} blockId - The ID of the block to remove.
   */
  const handleRemoveBlock = (blockId) => {
    setLessonBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  };

  /**
   * Opens the configuration editor for a lesson block.
   * @param {object} block - The block to configure.
   */
  const handleOpenConfiguration = (block) => {
    setEditingBlock(block); 
  };

  // Closes the configuration editor.
  const handleCloseConfiguration = () => {
    setEditingBlock(null);
  };

  /**
   * Saves the configuration of a lesson block.
   * @param {object} updatedBlock - The updated block data.
   */
  const handleSaveBlockConfiguration = (updatedBlock) => {
    setLessonBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
    handleCloseConfiguration(); 
  };

  /**
   * Moves a lesson block up or down in the lesson.
   * @param {string} blockId - The ID of the block to move.
   * @param {string} direction - The direction to move the block ('up' or 'down').
   */
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

  /**
   * Saves the current lesson to the API or local storage.
   */
  const handleSaveLesson = async () => {
    if (!selectedSectionId) {
        displayFeedback('teacherDashboard.cannotSaveNoSection', 'Please select a lesson section before saving.', true);
        return;
    }
    if (!authToken) {
        displayFeedback('teacherDashboard.cannotSaveNoAuth', 'Authentication error. Please log in again.', true);
        return;
    }

    try {
      // We can use local storage as a backup before API call, using a dynamic key
      const storageKey = `teacherSavedLesson_${selectedSectionId}`;
      localStorage.setItem(storageKey, JSON.stringify(lessonBlocks));

      await updateLessonSection(authToken, selectedSectionId, {
        title: currentSectionDetails.title, 
        exerciseBlocks: lessonBlocks,
      });
      displayFeedback('teacherDashboard.sectionSavedSuccess', 'Section content saved successfully!');
      // Optional: remove from local storage after successful API save
      // localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error saving section to API:", error);
      displayFeedback('teacherDashboard.sectionSavedErrorAPI', `Error saving section: ${error.message}. Your work is saved locally.`, true);
    }
  };

  /**
   * Loads a lesson from local storage for the currently selected section.
   * @param {boolean} [showFeedback=true] - Whether to show feedback messages.
   */
  const handleLoadLesson = useCallback((showFeedback = true) => {
    if (!selectedSectionId) {
        if (showFeedback) displayFeedback('teacherDashboard.cannotLoadNoSection', 'Please select a section to load a saved draft.', true);
        return;
    }
    const storageKey = `teacherSavedLesson_${selectedSectionId}`;
    try {
      const savedLessonJson = localStorage.getItem(storageKey);
      if (savedLessonJson) {
        const loadedBlocks = JSON.parse(savedLessonJson);
        if (Array.isArray(loadedBlocks)) {
          setLessonBlocks(loadedBlocks);
          if (showFeedback) displayFeedback('teacherDashboard.lessonLoadedSuccess', 'Locally saved draft loaded successfully!');
        } else {
          console.error("Loaded lesson data is not an array:", loadedBlocks);
          if (showFeedback) displayFeedback('teacherDashboard.lessonLoadedErrorCorrupt', 'Could not load draft: data is corrupt.', true);
        }
      } else {
        if (showFeedback) displayFeedback('teacherDashboard.lessonNotFound', 'No locally saved draft found for this section.', true);
      }
    } catch (error) {
      console.error("Error loading lesson from localStorage:", error);
      if (showFeedback) displayFeedback('teacherDashboard.lessonLoadedError', 'Error loading draft.', true);
    }
  }, [selectedSectionId, displayFeedback]);

  /**
   * Clears the saved lesson from local storage for the currently selected section.
   */
  const handleClearSavedLesson = () => {
    if (!selectedSectionId) {
        displayFeedback('teacherDashboard.cannotClearNoSection', 'Please select a section to clear its draft.', true);
        return;
    }
    const storageKey = `teacherSavedLesson_${selectedSectionId}`;
    try {
      localStorage.removeItem(storageKey);
      displayFeedback('teacherDashboard.clearedSuccess', 'Locally saved draft for this section has been cleared.');
    } catch (error) {
      console.error("Error clearing saved lesson from localStorage:", error);
      displayFeedback('teacherDashboard.clearedError', 'Error clearing saved draft.', true);
    }
  };
  
  /**
   * Renders a single lesson block item.
   * @param {object} block - The block to render.
   * @param {number} index - The index of the block.
   * @param {number} totalBlocks - The total number of blocks.
   * @returns {JSX.Element} The rendered block item.
   */
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

  /**
   * Renders the configuration editor for the currently editing block.
   * @returns {JSX.Element|null} The rendered configuration editor, or null if no block is being edited.
   */
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

  // Render the main teacher dashboard.
  return (
    <div className="teacher-dashboard-container-grid">
      <StudyModeBanner />
      {/* Affichage du logo et du drapeau de la langue sélectionnée */}
      {currentLangKey && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
          {logos[currentLangKey] && (
            <img src={logos[currentLangKey]} alt={t('languageSelector.logoAlt', 'Logo')} style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          {flags[currentLangKey] && (
            <img src={flags[currentLangKey]} alt={t('languageSelector.flagAlt', 'Drapeau')} style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            {allTranslations[currentLangKey]?.cosyName || currentLangKey}
          </span>
        </div>
      )}
      {/* The sidebar for managing days and lesson sections. */}
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

      {/* The main content area with tabs for lessons and templates. */}
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
        
        {/* Display feedback messages. */}
        {feedbackMessage && 
          <div className={`feedback-message ${feedbackMessage.type === 'error' ? 'feedback-error' : 'feedback-success'}`}>
            {feedbackMessage.text}
          </div>
        }
        
        {/* The lesson editor tab. */}
        {activeTab === 'lessons' && (
          <LessonEditor
            lessonBlocks={lessonBlocks}
            selectedSectionId={selectedSectionId}
            feedbackMessage={feedbackMessage}
            handleLoadLesson={handleLoadLesson}
            handleSaveLesson={handleSaveLesson}
            openTemplateModal={openTemplateModal}
            handleClearSavedLesson={handleClearSavedLesson}
            renderBlockItem={renderBlockItem}
          />
        )}

        {/* The templates tab. */}
        {activeTab === 'templates' && (
          <TemplateList openTemplateEditor={() => setIsTemplateEditorOpen(true)} />
        )}

        {/* The template selection modal. */}
        {isTemplateModalOpen && (
          <TemplateTypeSelectionModal
            isOpen={isTemplateModalOpen}
            onClose={closeTemplateModal}
            onSelectTemplateType={handleSelectTemplateType}
          />
        )}

        {/* The block configuration editor. */}
        {editingBlock && renderBlockConfiguration()}

        {/* The template editor. */}
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
