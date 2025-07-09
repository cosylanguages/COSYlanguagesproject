import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './LessonSectionsPanel.css';

const LessonSectionsPanel = ({
  sectionsFromSyllabus = null, // For students: array of { title, content_blocks, ... }
  apiLessonSections = null,   // For teachers: array of { id, title: { lang: 'val' }, ... }
  onSectionSelect,
  selectedSectionId, // For student: section.title; For teacher: section.id
  currentLangKey,    // To get teacher section titles in current language
  isStudentMode = false,
}) => {
  const { t } = useI18n();

  const getTeacherSectionTitle = (section) => {
    // Teacher sections have multilingual titles
    const langKeyToUse = currentLangKey || 'COSYenglish'; // Fallback language
    if (section.title) {
      return section.title[langKeyToUse] || section.title.COSYenglish || section.title.default || t('lessonSectionsPanel.untitledSection', 'Untitled Section');
    }
    return t('lessonSectionsPanel.untitledSection', 'Untitled Section');
  };

  const sectionsToDisplay = isStudentMode ? sectionsFromSyllabus : apiLessonSections;

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
          if (isStudentMode) {
            // Student mode: section is { title, content_blocks, ... }
            // selectedSectionId is section.title
            const sectionTitle = section.title || t('lessonSectionsPanel.untitledSection', 'Untitled Section');
            return (
              <li
                key={section.title || index} // Use title or index as key
                className={`section-item ${sectionTitle === selectedSectionId ? 'active-section' : ''}`}
              >
                <button
                  onClick={() => onSectionSelect(sectionTitle)}
                  className="section-link-button"
                  title={sectionTitle}
                  aria-pressed={sectionTitle === selectedSectionId}
                >
                  <TransliterableText text={sectionTitle} />
                </button>
              </li>
            );
          } else {
            // Teacher mode: section is { id, title: { lang: 'val' }, ... }
            // selectedSectionId is section.id
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
          }
        })}
      </ul>
    </div>
  );
};

export default LessonSectionsPanel;
