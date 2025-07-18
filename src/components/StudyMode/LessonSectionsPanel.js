import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './LessonSectionsPanel.css';
import { fetchLessonSections } from '../../api/lessonSections';
import { useAuth } from '../../contexts/AuthContext';

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

  useEffect(() => {
    if (selectedDayId && !isStudentMode) {
      fetchLessonSections(authToken, selectedDayId)
        .then(data => setSections(data || []))
        .catch(err => console.error("Error fetching lesson sections:", err));
    }
  }, [selectedDayId, isStudentMode, authToken]);

  const getTeacherSectionTitle = (section) => {
    const langKeyToUse = currentLangKey || 'COSYenglish';
    if (section.title) {
      return section.title[langKeyToUse] || section.title.COSYenglish || section.title.default || t('lessonSectionsPanel.untitledSection', 'Untitled Section');
    }
    return t('lessonSectionsPanel.untitledSection', 'Untitled Section');
  };

  const sectionsToDisplay = sections;

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
