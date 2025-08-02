// Import necessary libraries, hooks, and components.
import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import TransliterableText from '../Common/TransliterableText';
import Modal from '../Common/Modal';
import './LessonSectionsPanel.css';

/**
 * A panel that displays a list of lesson sections for a given day.
 * It is used in both the student and teacher dashboards.
 * @param {object} props - The component's props.
 * @param {string} props.selectedDayId - The ID of the currently selected day.
 * @param {function} props.onSectionSelect - A callback function to handle the selection of a section.
 * @param {string} props.selectedSectionId - The ID of the currently selected section.
 * @param {string} props.currentLangKey - The current language key.
 * @param {boolean} [props.isStudentMode=false] - Whether the panel is in student mode.
 * @returns {JSX.Element} The LessonSectionsPanel component.
 */
const LessonSectionsPanel = ({
  sectionsFromSyllabus,
  apiLessonSections,
  onSectionSelect,
  selectedSectionId,
  currentLangKey,
  isStudentMode = false,
}) => {
  const { t, language } = useI18n();
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const sectionsToDisplay = isStudentMode ? sectionsFromSyllabus : apiLessonSections;

  const handleBookmark = (sectionId, selectedDayId) => {
    if (!currentUser) {
      const guestProgress = {
        language,
        dayId: selectedDayId,
        sectionId,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('cosyGuestProgress', JSON.stringify(guestProgress));
      setShowModal(true);
    } else {
      // In a real scenario, we would call an API to save progress for the logged-in user.
      // For now, we can just log it.
      console.log('Bookmarking for logged-in user:', { language, dayId: selectedDayId, sectionId });
      alert('Progress saved!');
    }
  };

  /**
   * Gets the title of a section in the appropriate language.
   * @param {object} section - The section object.
   * @returns {string} The title of the section.
   */
  const getSectionTitle = (section) => {
    if (isStudentMode) {
      return section.title;
    }
    const langKeyToUse = currentLangKey || 'COSYenglish';
    if (section.title) {
      return section.title[langKeyToUse] || section.title.COSYenglish || section.title.default || t('lessonSectionsPanel.untitledSection', 'Untitled Section');
    }
    return t('lessonSectionsPanel.untitledSection', 'Untitled Section');
  };

  // If there are no sections to display, show a message.
  if (!sectionsToDisplay || sectionsToDisplay.length === 0) {
    return (
      <div className="lesson-sections-panel">
        <h4>
          <TransliterableText text={t('studyMode.lessonSectionsTitle', 'Lesson Sections')} />
        </h4>
        <p className="no-sections-message">
          <TransliterableText text={t('studyMode.noSectionsAvailableForDay', 'No sections available for the selected day.')} />
        </p>
      </div>
    );
  }

  // Render the list of lesson sections.
  return (
    <div className="lesson-sections-panel">
      <h4>
        <TransliterableText text={t('studyMode.lessonSectionsTitle', 'Lesson Sections')} />
      </h4>
      <ul className="sections-list">
        {sectionsToDisplay.map((section, index) => {
          const sectionTitle = getSectionTitle(section);
          const sectionId = isStudentMode ? section.title : section.id;
          return (
            <li
              key={sectionId}
              className={`section-item ${sectionId === selectedSectionId ? 'active-section' : ''}`}
            >
              <div className="section-content">
                <button
                  onClick={() => onSectionSelect(sectionId)}
                  className="section-link-button"
                  title={sectionTitle}
                  aria-pressed={sectionId === selectedSectionId}
                >
                  <TransliterableText text={sectionTitle} />
                </button>
                <button
                  className="bookmark-button"
                  onClick={() => handleBookmark(sectionId, selectedDayId)}
                  title="Bookmark this section"
                >
                  🔖
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Progress Saved!</h2>
        <p>Your progress has been saved on this device. To save it permanently and access it from anywhere, please sign up or log in.</p>
      </Modal>
    </div>
  );
};

export default LessonSectionsPanel;
