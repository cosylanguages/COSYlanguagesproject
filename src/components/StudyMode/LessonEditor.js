// src/components/StudyMode/LessonEditor.js
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';

const LessonEditor = ({
  lessonBlocks,
  selectedSectionId,
  feedbackMessage,
  handleLoadLesson,
  handleSaveLesson,
  openTemplateModal,
  handleClearSavedLesson,
  renderBlockItem,
}) => {
  const { t } = useI18n();

  return (
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
  );
};

export default LessonEditor;
