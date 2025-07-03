import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './LessonSectionsPanel.css'; 

const LessonSectionsPanel = ({ 
  apiLessonSections = [], 
  onSectionSelect, 
  selectedSectionId,
  currentLangKey // Passed from StudyModePage for consistency, though useI18n also provides it
}) => {
  const { t } = useI18n(); // currentLangKey from hook can also be used if not passed as prop

  const getSectionTitle = (section) => {
    const langKeyToUse = currentLangKey || 'default'; // Fallback to 'default' if currentLangKey is undefined
    if (section.title) {
      return section.title[langKeyToUse] || section.title.COSYenglish || section.title.default || t('lessonSectionsPanel.untitledSection', 'Untitled Section');
    }
    return t('lessonSectionsPanel.untitledSection', 'Untitled Section');
  };

  if (!apiLessonSections || apiLessonSections.length === 0) {
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
        {apiLessonSections.map((section) => (
          <li 
            key={section.id} 
            className={`section-item ${section.id === selectedSectionId ? 'active-section' : ''}`}
          >
            <button 
              onClick={() => onSectionSelect(section.id)} 
              className="section-link-button"
              title={getSectionTitle(section)} 
              aria-pressed={section.id === selectedSectionId}
            >
              <TransliterableText text={getSectionTitle(section)} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonSectionsPanel;
