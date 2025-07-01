import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import './LessonSectionsPanel.css'; // Create this CSS file

const LessonSectionsPanel = ({ lessonBlocks = [], onSectionSelect }) => {
  const { t, currentLangKey } = useI18n();

  const getBlockTitle = (block) => {
    if (block.data && block.data.title) {
      return block.data.title[currentLangKey] || block.data.title.default || block.typeName || `Block ${block.id}`;
    }
    return block.typeName || `Block ${block.id}`;
  };

  if (!lessonBlocks || lessonBlocks.length === 0) {
    return (
      <div className="lesson-sections-panel">
        <h4>
          <TransliterableText text={t('studyMode.lessonSectionsTitle', 'Lessons & Sections')} />
        </h4>
        <p className="no-sections-message">
          <TransliterableText text={t('studyMode.noSectionsAvailable', 'No sections in this lesson.')} />
        </p>
      </div>
    );
  }

  return (
    <div className="lesson-sections-panel">
      <h4>
        <TransliterableText text={t('studyMode.lessonSectionsTitle', 'Lessons & Sections')} />
      </h4>
      <ul className="sections-list">
        {lessonBlocks.map((block) => (
          <li key={block.id} className="section-item">
            <button 
              onClick={() => onSectionSelect(block.id)} 
              className="section-link-button"
              title={getBlockTitle(block)} // Tooltip with full title
            >
              <TransliterableText text={getBlockTitle(block)} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonSectionsPanel;
