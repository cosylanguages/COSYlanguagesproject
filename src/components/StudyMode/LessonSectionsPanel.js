import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';

// Basic styling can be added to StudyModePage.css or a dedicated file
// For now, inline styles or classes for structure

const LessonSectionsPanel = () => {
  const { t } = useI18n();

  return (
    <div className="lesson-sections-panel">
      <h4>
        <TransliterableText text={t('studyMode.lessonSectionsTitle', 'Lessons & Sections')} />
      </h4>
      <p>
        <TransliterableText text={t('studyMode.lessonSectionsComingSoon', '(Lesson navigation will appear here)')} />
      </p>
      {/* Placeholder content */}
      <ul>
        <li><TransliterableText text={t('studyMode.lesson1', 'Lesson 1: Greetings')} /></li>
        <li><TransliterableText text={t('studyMode.lesson2', 'Lesson 2: Numbers')} /></li>
        <li><TransliterableText text={t('studyMode.lesson3', 'Lesson 3: Family')} /></li>
      </ul>
    </div>
  );
};

export default LessonSectionsPanel;
