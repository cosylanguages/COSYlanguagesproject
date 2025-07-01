import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import RoleSelector from './RoleSelector'; 
import StudentDashboard from './StudentDashboard'; 
import TeacherDashboard from './TeacherDashboard'; 
import LessonSectionsPanel from '../../components/StudyMode/LessonSectionsPanel'; 
import ToolsPanel from '../../components/StudyMode/ToolsPanel'; 
import TransliterableText from '../../components/Common/TransliterableText'; 
import ToggleLatinizationButton from '../../components/Common/ToggleLatinizationButton';

import './StudyModePage.css'; 

// DEV_NOTE: Mock data for lesson blocks - simulating what a teacher might create.
// This should be replaced with actual data fetching or state management when available.
const mockLessonBlocks = [
  {
    id: 'block-1', // This ID will be used for scrolling
    typePath: 'reading/text',
    typeName: 'Introduction Text',
    data: {
      title: { default: 'Welcome to the Lesson!', COSYfrench: 'Bienvenue à la leçon!' },
      content: { 
        default: 'This lesson will cover the basics of greetings and introductions.\nMake sure to pay attention to the examples provided.\n\nScroll down to see more content if this panel is tall enough!',
        COSYfrench: 'Cette leçon couvrira les bases des salutations et des présentations.\nAssurez-vous de prêter attention aux exemples fournis.'
      },
      lang: null,
    },
  },
  {
    id: 'block-2', // This ID will be used for scrolling
    typePath: 'comprehension/mcq-multiple',
    typeName: 'Greetings Quiz',
    data: {
      title: { default: 'Quick Quiz: Greetings', COSYfrench: 'Quiz rapide : Salutations' },
      question: { default: 'Which of the following are common ways to say "Hello"?', COSYfrench: 'Lesquels des suivants sont des manières courantes de dire "Bonjour" ?' },
      options: [
        { id: 'opt1', texts: { default: 'Hello', COSYfrench: 'Bonjour' }, isCorrect: true, feedback: { default: 'Correct! "Hello" is a standard greeting.' } },
        { id: 'opt2', texts: { default: 'Hi', COSYfrench: 'Salut' }, isCorrect: true, feedback: { default: 'Correct! "Hi" is a more informal greeting.' } },
        { id: 'opt3', texts: { default: 'Goodbye', COSYfrench: 'Au revoir' }, isCorrect: false, feedback: { default: 'Incorrect. "Goodbye" is used when leaving.' } },
        { id: 'opt4', texts: { default: 'Good morning', COSYfrench: 'Bonjour (matin)' }, isCorrect: true, feedback: { default: 'Correct! "Good morning" is used in the morning.' } },
      ],
      lang: null,
    },
  },
  {
    id: 'block-3', // This ID will be used for scrolling
    typePath: 'reading/text',
    typeName: 'Further Information',
    data: {
      title: { default: 'Additional Notes' },
      content: { default: 'Remember to practice these phrases regularly.\nThis is another block to demonstrate scrolling.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      lang: null,
    },
  }
];

export const getBlockElementId = (blockId) => `lesson-block-content-${blockId}`;

const StudyModePage = () => {
  const { t, language, currentLangKey } = useI18n();
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('selectedRole') || null; 
  });
  
  // DEV_NOTE: In a real app, `currentLessonBlocks` would come from TeacherDashboard's state
  // or a shared context/store, especially if the teacher is live-editing.
  // For now, `LessonSectionsPanel` will use `mockLessonBlocks` for students,
  // and a placeholder/static list or message for teachers.
  const currentLessonBlocksForPanel = selectedRole === 'student' ? mockLessonBlocks : []; 
  // For teacher view, we could pass teacherDashboard.lessonBlocks if we lift state or use context.
  // If a teacher is active, this panel would ideally show the structure of the lesson being built.
  // This is a simplification for now.

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    } else {
      localStorage.removeItem('selectedRole'); 
    }
  }, [selectedRole]);

  const handleRoleSelect = (role) => {
    setSelectedRole(prevRole => prevRole === role ? null : role);
  };

  const handleSectionSelect = (blockId) => {
    const elementId = getBlockElementId(blockId);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Element with ID ${elementId} not found for scrolling.`);
    }
  };

  return (
    <div className="study-mode-page-container">
      <h1>
        <TransliterableText text={t('studyMode.mainHeading', 'COSYlanguages - Study Mode')} />
      </h1>
      
      <div className="study-menu-section">
        <label htmlFor="language-select" id="study-choose-language-label">
          <TransliterableText text={t('studyMode.chooseLanguageLabel', '🌎 Choose Your Language:')} />
        </label>
        <LanguageSelector /> 
        <ToggleLatinizationButton 
          currentDisplayLanguage={currentLangKey || language}
        />
      </div>

      <div className="study-menu-section">
        <label htmlFor="role-selector-buttons" id="study-choose-role-label"> 
            <TransliterableText text={t('studyMode.chooseRoleLabel', '👤 Choose Your Role:')} />
        </label>
        <RoleSelector onSelectRole={handleRoleSelect} currentRole={selectedRole} />
      </div>
      
      <div className="study-content-area">
        {!selectedRole ? (
          <p id="study-welcome-message">
            <TransliterableText text={t('studyMode.welcomeMessage', 'Please select your role to begin.')} />
          </p>
        ) : (
          <div className="dashboard-layout">
            <div className="layout-left-panel">
              <LessonSectionsPanel 
                lessonBlocks={currentLessonBlocksForPanel} 
                onSectionSelect={handleSectionSelect} 
              />
            </div>
            <div className="layout-center-panel">
              {/* The dashboard components will need to ensure their rendered blocks have correct IDs */}
              {selectedRole === 'student' && 
                <StudentDashboard 
                  lessonBlocks={mockLessonBlocks} 
                  onNavigateToBlock={handleSectionSelect} // Pass the scroll handler
                />}
              {selectedRole === 'teacher' && 
                <TeacherDashboard 
                  // DEV_NOTE: TeacherDashboard would also need onNavigateToBlock if its
                  // internal list should be synced with LessonSectionsPanel scrolling.
                  // This requires TeacherDashboard's lessonBlocks to be the source for LessonSectionsPanel.
                />}
            </div>
            <div className="layout-right-panel">
              <ToolsPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModePage;
