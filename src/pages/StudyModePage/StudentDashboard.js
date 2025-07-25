// Import necessary libraries, hooks, and components.
import React, { useState } from 'react';
import StudyModeBanner from '../../components/StudyMode/StudyModeBanner';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../../components/Common/TransliterableText';
import MistakeNotebook from '../../components/StudyMode/MistakeNotebook';
import GrammarReview from '../../components/StudyMode/GrammarReview';
import VirtualTutor from '../../components/StudyMode/VirtualTutor';
import SmartReview from '../../components/StudyMode/SmartReview';
import TodaysFocus from '../StudyMode/PersonalizationPage/components/TodaysFocus';
import MyLearningGarden from '../../components/Gamification/MyLearningGarden';
// The CosyCorner component is not yet implemented.
// import CosyCorner from '../../components/Community/CosyCorner';
import LanguagePet from '../../components/Gamification/LanguagePet';
import SouvenirCollection from '../../components/Gamification/SouvenirCollection';
import CosyStreaks from '../../components/Gamification/CosyStreaks';
import StudyFillInTheBlanks from '../../components/StudyMode/exercises/StudyFillInTheBlanks';
import StudySentenceUnscramble from '../../components/StudyMode/exercises/StudySentenceUnscramble';
import QuizTaker from '../../components/StudyMode/QuizTaker';
import QuizResults from '../../components/StudyMode/QuizResults';
import FlashcardPlayer from '../../components/StudyMode/FlashcardPlayer';

// Import the centralized map of display components.
import { displayComponentMap } from '../../components/StudyMode/common/displayComponentMap';

// Import the helper function for generating consistent element IDs.
import { getBlockElementId } from './StudyModePage'; 

// Import the CSS for this component.
import './StudentDashboard.css'; 

// Mock data for quizzes.
const mockQuizzes = [
    {
        id: 1,
        title: 'French Vocabulary Quiz',
        questions: [
            {
                text: 'What is the French word for "hello"?',
                options: ['Bonjour', 'Au revoir', 'Merci', 'Oui'],
                correctOption: 0,
            },
            {
                text: 'What is the French word for "goodbye"?',
                options: ['Bonjour', 'Au revoir', 'Merci', 'Oui'],
                correctOption: 1,
            },
        ],
    },
];

// Mock data for flashcard decks.
const mockDecks = [
    {
        id: 1,
        title: 'French Vocabulary',
        cards: [
            { front: 'Hello', back: 'Bonjour' },
            { front: 'Goodbye', back: 'Au revoir' },
            { front: 'Thank you', back: 'Merci' },
        ],
    },
];

/**
 * The student's dashboard in Study Mode.
 * This component displays the lesson content, including various types of exercise blocks,
 * and provides access to study tools and gamification features.
 * @param {object} props - The component's props.
 * @param {Array} [props.lessonBlocks=[]] - An array of lesson content blocks to display.
 * @returns {JSX.Element} The StudentDashboard component.
 */
const StudentDashboard = ({ lessonBlocks = [] }) => {
  const { t, currentLangKey, allTranslations } = useI18n();
  // Logos et drapeaux comme dans CosyLanguageSelector
  const logos = {
    COSYarmenian: '/assets/icons/cosylanguages_logos/cosyarmenian.png',
    COSYbashkir: '/assets/icons/cosylanguages_logos/cosybachkir.png',
    COSYbreton: '/assets/icons/cosylanguages_logos/cosybreton.png',
    COSYenglish: '/assets/icons/cosylanguages_logos/cosyenglish.png',
    COSYfrench: '/assets/icons/cosylanguages_logos/cosyfrench.png',
    COSYgeorgian: '/assets/icons/cosylanguages_logos/cosygeorgian.png',
    COSYgerman: '/assets/icons/cosylanguages_logos/cosygerman.png',
    COSYgreek: '/assets/icons/cosylanguages_logos/cosygreek.png',
    COSYitalian: '/assets/icons/cosylanguages_logos/cosyitalian.png',
    COSYportuguese: '/assets/icons/cosylanguages_logos/cosyportuguese.png',
    COSYrussian: '/assets/icons/cosylanguages_logos/cosyrussian.png',
    COSYspanish: '/assets/icons/cosylanguages_logos/cosyspanish.png',
    COSYtatar: '/assets/icons/cosylanguages_logos/cosytatar.png',
  };
  const flags = {
    COSYbashkir: '/assets/flags/Flag_of_Bashkortostan.png',
    COSYbreton: '/assets/flags/Flag_of_Brittany.png',
    COSYtatar: '/assets/flags/Flag_of_Tatarstan.png',
  };
  // State for controlling the visibility of different study tools.
  const [isMistakeNotebookVisible, setIsMistakeNotebookVisible] = useState(false);
  const [isGrammarReviewVisible, setIsGrammarReviewVisible] = useState(false);
  const [isVirtualTutorVisible, setIsVirtualTutorVisible] = useState(false);
  const [isSmartReviewVisible, setIsSmartReviewVisible] = useState(false);
  const [isFillInTheBlanksVisible, setIsFillInTheBlanksVisible] = useState(false);
  const [isSentenceUnscrambleVisible, setIsSentenceUnscrambleVisible] = useState(false);
  // State for managing quizzes and flashcards.
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  
  /**
   * Handles navigation between lesson blocks.
   * @param {string} direction - The direction to navigate ('previous' or 'next').
   * @param {number} currentIndex - The index of the current block.
   */
  const handleNavigateBlock = (direction, currentIndex) => {
    let targetIndex;
    if (direction === 'previous') {
      targetIndex = currentIndex - 1;
    } else { // next
      targetIndex = currentIndex + 1;
    }

    if (targetIndex >= 0 && targetIndex < lessonBlocks.length) {
      const targetBlock = lessonBlocks[targetIndex];
      const elementId = getBlockElementId(targetBlock.id || targetBlock.title || targetBlock.block_type, targetIndex);
      const element = document.getElementById(elementId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Handles the submission of a quiz.
   * @param {object} answers - The user's answers to the quiz.
   */
  const handleQuizSubmit = (answers) => {
      setQuizAnswers(answers);
  }

  // If quiz answers are available, show the results.
  if (quizAnswers) {
      return <QuizResults quiz={selectedQuiz} answers={quizAnswers} />;
  }

  // If a quiz is selected, show the quiz taker.
  if (selectedQuiz) {
      return <QuizTaker quiz={selectedQuiz} onSubmit={handleQuizSubmit} />;
  }

  // If a flashcard deck is selected, show the flashcard player.
  if(selectedDeck) {
      return <FlashcardPlayer deck={selectedDeck} />;
  }

  // If there are no lesson blocks, display a message.
  if (!lessonBlocks || lessonBlocks.length === 0) {
    return (
      <div className="student-dashboard-container">
        <h2><TransliterableText text={t('studyMode.studentDashboardHeading', 'Student Dashboard')} /></h2>
        <p><TransliterableText text={t('studentDashboard.noLessonContent', 'No lesson content is currently available.')} /></p>
      </div>
    );
  }

  // Render the main student dashboard.
  return (
    <div className="student-dashboard-container">
      <StudyModeBanner />
      {/* Affichage du logo et du drapeau de la langue sélectionnée */}
      {currentLangKey && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
          {logos[currentLangKey] && (
            <img src={logos[currentLangKey]} alt={t('languageSelector.logoAlt', 'Logo')} style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          {flags[currentLangKey] && (
            <img src={flags[currentLangKey]} alt={t('languageSelector.flagAlt', 'Drapeau')} style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            {allTranslations[currentLangKey]?.cosyName || currentLangKey}
          </span>
        </div>
      )}
      {/* Gamification and personalization components. */}
      <div className="cosy-dashboard">
        <TodaysFocus />
        <MyLearningGarden />
        {/* <CosyCorner /> */}
        <LanguagePet />
        <SouvenirCollection />
        <CosyStreaks />
      </div>
      {/* The header for the current lesson, with buttons for study tools. */}
      <div className="lesson-header">
        <h2><TransliterableText text={t('studyMode.lessonTitlePlaceholder', 'Current Lesson')} /></h2>
        <button onClick={() => setIsMistakeNotebookVisible(true)}>Mistake Notebook</button>
        <button onClick={() => setIsGrammarReviewVisible(true)}>Grammar Review</button>
        <button onClick={() => setIsVirtualTutorVisible(true)}>Virtual Tutor</button>
        <button onClick={() => setIsSmartReviewVisible(true)}>Smart Review</button>
        <button onClick={() => setIsFillInTheBlanksVisible(true)}>Fill in the Blanks</button>
        <button onClick={() => setIsSentenceUnscrambleVisible(true)}>Sentence Unscramble</button>
      </div>
      
      {/* Render the study tools if they are visible. */}
      {isMistakeNotebookVisible && <MistakeNotebook />}
      {isGrammarReviewVisible && <GrammarReview />}
      {isVirtualTutorVisible && <VirtualTutor />}
      {isSmartReviewVisible && <SmartReview userId="123" />}
      {isFillInTheBlanksVisible && <StudyFillInTheBlanks language={t('currentLanguage')} />}
      {isSentenceUnscrambleVisible && <StudySentenceUnscramble language={t('currentLanguage')} />}

      {/* A section for quizzes. */}
      <div className="quizzes-section">
          <h3>Quizzes</h3>
          <ul>
              {mockQuizzes.map(quiz => (
                  <li key={quiz.id}>
                      <button onClick={() => setSelectedQuiz(quiz)}>{quiz.title}</button>
                  </li>
              ))}
          </ul>
      </div>

      {/* A section for flashcard decks. */}
      <div className="flashcards-section">
          <h3>My Flashcards</h3>
          <ul>
              {mockDecks.map(deck => (
                  <li key={deck.id}>
                      <button onClick={() => setSelectedDeck(deck)}>{deck.title}</button>
                  </li>
              ))}
          </ul>
      </div>

      {/* The main content of the lesson, with dynamically rendered exercise blocks. */}
      <div className="lesson-content-student-view">
        {lessonBlocks.map((block, index) => {
          const componentKey = block.block_type;
          const DisplayComponent = displayComponentMap[componentKey];
          const blockDomId = getBlockElementId(block.id || block.title || block.block_type, index);

          if (DisplayComponent) {
            return (
              <div key={index} id={blockDomId} className="student-lesson-block">
                <DisplayComponent 
                  blockData={block}
                />
                {/* Navigation buttons for moving between blocks. */}
                <div className="block-navigation-actions">
                  <button 
                    onClick={() => handleNavigateBlock('previous', index)} 
                    disabled={index === 0}
                    className="btn btn-sm btn-outline-secondary prev-block-btn"
                  >
                    <TransliterableText text={t('studentDashboard.prevBlockBtn', 'Previous')} />
                  </button>
                  <span className="block-nav-page-info">
                    <TransliterableText 
                        text={t('studentDashboard.blockPageInfo', 'Block {current}/{totalBlocks}', {
                            current: index + 1,
                            totalBlocks: lessonBlocks.length
                        })}
                    />
                  </span>
                  <button 
                    onClick={() => handleNavigateBlock('next', index)} 
                    disabled={index === lessonBlocks.length - 1}
                    className="btn btn-sm btn-outline-secondary next-block-btn"
                  >
                    <TransliterableText text={t('studentDashboard.nextBlockBtn', 'Next')} />
                  </button>
                </div>
              </div>
            );
          }
          return (
            // A fallback for unknown block types.
            <div key={index} id={blockDomId} className="student-lesson-block-fallback">
              <p>
                <TransliterableText
                  text={t('studentDashboard.unknownBlockType', 'Content block type "{blockType}" cannot be displayed yet.', { blockType: block.block_type || 'Unknown' })}
                />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
