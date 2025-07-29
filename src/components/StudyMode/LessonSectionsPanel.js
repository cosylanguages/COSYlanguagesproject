// Import necessary libraries, hooks, and components.
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './LessonSectionsPanel.css';
import { fetchLessonSections } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

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
  selectedDayId,
  onSectionSelect,
  selectedSectionId,
  currentLangKey,
  isStudentMode = false,
}) => {
  const { t } = useI18n();
  const { authToken } = useAuth();
  const [sections, setSections] = useState([]);

  // Fetch the lesson sections from the API when in teacher mode.
  useEffect(() => {
    if (selectedDayId && !isStudentMode) {
      fetchLessonSections(authToken, selectedDayId)
        .then(data => setSections(data || []))
        .catch(err => console.error("Error fetching lesson sections:", err));
    }
  }, [selectedDayId, isStudentMode, authToken]);

  /**
   * Gets the title of a section in the appropriate language.
   * @param {object} section - The section object.
   * @returns {string} The title of the section.
   */
  const getTeacherSectionTitle = (section) => {
    const langKeyToUse = currentLangKey || 'COSYenglish';
    if (section.title) {
      return section.title[langKeyToUse] || section.title.COSYenglish || section.title.default || t('lessonSectionsPanel.untitledSection', 'Untitled Section');
    }
    return t('lessonSectionsPanel.untitledSection', 'Untitled Section');
  };

  const sectionsToDisplay = sections;

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
          const sectionTitle = getTeacherSectionTitle(section);
          return (
            <li
              key={section.id}
              className={`section-item ${section.id === selectedSectionId ? 'active-section' : ''}`}
            >
              <button
                onClick={() => onSectionSelect(section.id)}
                className="section-link-button"
                title={sectionTitle}
                aria-pressed={section.id === selectedSectionId}
              >
                <TransliterableText text={sectionTitle} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LessonSectionsPanel;
