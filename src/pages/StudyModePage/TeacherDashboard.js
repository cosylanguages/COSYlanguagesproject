import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import TemplateTypeSelectionModal from '../../components/StudyMode/TemplateTypeSelectionModal';
import { getDisplayNameForTemplatePath } from '../../config/templateSections'; // To get a user-friendly name

// Placeholder for actual block rendering components
// import TextBlock from '../../components/StudyMode/DisplayBlocks/TextBlock'; 
// ... import other block types

import './TeacherDashboard.css'; // Create this file for specific styling

const TeacherDashboard = () => {
  const { t } = useI18n();
  const [lessonBlocks, setLessonBlocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null); // For configuring a block later

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectTemplateType = (typePath, typeName) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      typePath: typePath,
      typeName: typeName || getDisplayNameForTemplatePath(typePath), // Ensure typeName is set
      data: { // Initial placeholder data structure
        title: { default: `New ${typeName || getDisplayNameForTemplatePath(typePath)}` },
        // Other type-specific data will be added during configuration
      },
      // We might need more metadata, like creation date, order, etc.
    };
    setLessonBlocks(prevBlocks => [...prevBlocks, newBlock]);
    closeModal();
  };

  const handleRemoveBlock = (blockId) => {
    setLessonBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  };

  const handleConfigureBlock = (block) => {
    // This will later open a configuration UI for the specific block type
    setEditingBlock(block); 
    console.log("TODO: Open configuration UI for block:", block);
    // For now, maybe just log or update a placeholder
  };
  
  // Function to render a specific block based on its typePath
  // This will be expanded significantly
  const renderBlock = (block) => {
    // For now, just display basic info. Later, this will use dynamic imports or a switch
    // to render the actual block component (e.g., <TextBlock data={block.data} />)
    return (
      <div key={block.id} className="lesson-block-item">
        <div className="block-info">
          <strong><TransliterableText text={block.typeName} /></strong>
          {block.data.title?.default && <span> - <TransliterableText text={block.data.title.default} /></span>}
        </div>
        <div className="block-actions">
          <button onClick={() => handleConfigureBlock(block)} className="btn btn-sm btn-secondary">
            {t('configureBtn') || 'Configure'}
          </button>
          <button onClick={() => handleRemoveBlock(block.id)} className="btn btn-sm btn-danger">
            {t('removeBtn') || 'Remove'}
          </button>
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
        <button onClick={openModal} className="btn btn-primary add-block-btn">
          <TransliterableText text={t('addContentBlockBtn') || '+ Add Content Block'} />
        </button>
      </div>

      {lessonBlocks.length === 0 ? (
        <p className="no-blocks-message">
          <TransliterableText text={t('teacherDashboard.noBlocksMessage', 'No content blocks added yet. Click "Add Content Block" to start building your lesson.')} />
        </p>
      ) : (
        <div className="lesson-blocks-list">
          {lessonBlocks.map(block => renderBlock(block))}
        </div>
      )}

      {isModalOpen && (
        <TemplateTypeSelectionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectTemplateType={handleSelectTemplateType}
        />
      )}

      {/* Placeholder for block configuration UI */}
      {editingBlock && (
        <div className="block-configuration-placeholder">
          <h3><TransliterableText text={t('configureBlockTitle', { blockName: editingBlock.typeName }) || `Configure ${editingBlock.typeName}`} /></h3>
          <p><TransliterableText text={t('configureBlockComingSoon', 'Configuration options for this block type will appear here.')} /></p>
          <button onClick={() => setEditingBlock(null)} className="btn btn-secondary">
            {t('closeConfigBtn') || 'Close Configuration'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
