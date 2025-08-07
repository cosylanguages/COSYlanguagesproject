// Import necessary libraries, hooks, and components.
import React, { useState, useMemo } from 'react';
import StudyModeBanner from '../../components/StudyMode/StudyModeBanner';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import TransliterableText from '../../components/Common/TransliterableText';
import MistakeNotebook from '../../components/StudyMode/MistakeNotebook';
import GrammarReview from '../../components/StudyMode/GrammarReview';
import VirtualTutor from '../../components/StudyMode/VirtualTutor';
import SmartReview from '../../components/StudyMode/SmartReview';
import GamificationDashboard from '../../components/Gamification/GamificationDashboard';
import StudyFillInTheBlanks from '../../components/StudyMode/exercises/StudyFillInTheBlanks';
import StudySentenceUnscramble from '../../components/StudyMode/exercises/StudySentenceUnscramble';
import QuizTaker from '../../components/StudyMode/QuizTaker';
import QuizResults from '../../components/StudyMode/QuizResults';
import FlashcardPlayer from '../../components/StudyMode/FlashcardPlayer';

// Import the centralized map of display components.
import { displayComponentMap } from '../../components/StudyMode/common/displayComponentMap';

// Import the helper function for generating consistent element IDs.
import { getBlockElementId } from './utils';
import { logos, flags } from '../../config/languageAssets';
import Button from '../../components/Common/Button';

// Import the CSS for this component.
import './StudentDashboard.css'; 

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
  const { currentUser } = useAuth();
  // State for controlling the visibility of different study tools.
  const [isMistakeNotebookVisible, setIsMistakeNotebookVisible] = useState(false);
  const [isGrammarReviewVisible, setIsGrammarReviewVisible] = useState(false);
  const [isVirtualTutorVisible, setIsVirtualTutorVisible] = useState(false);
  const [isSmartReviewVisible, setIsSmartReviewVisible] = useState(false);
  const [isFillInTheBlanksVisible, setIsFillInTheBlanksVisible] = useState(false);
  const [isSentenceUnscrambleVisible, setIsSentenceUnscrambleVisible] = useState(false);
  // State for managing quizzes and flashcards.
  const [selectedQuiz, ] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [selectedDeck, ] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedBlocks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return lessonBlocks.slice(startIndex, startIndex + itemsPerPage);
  }, [lessonBlocks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(lessonBlocks.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
      <div className="study-card">
        <GamificationDashboard />
      </div>
      {/* The header for the current lesson, with buttons for study tools. */}
      <div className="study-card">
        <div className="lesson-header">
          <h2><TransliterableText text={t('studyMode.lessonTitlePlaceholder', 'Current Lesson')} /></h2>
          <Button onClick={() => setIsMistakeNotebookVisible(true)}><TransliterableText text={t('studentDashboard.mistakeNotebook', 'Mistake Notebook')} /></Button>
          <Button onClick={() => setIsGrammarReviewVisible(true)}><TransliterableText text={t('studentDashboard.grammarReview', 'Grammar Review')} /></Button>
          <Button onClick={() => setIsVirtualTutorVisible(true)}><TransliterableText text={t('studentDashboard.virtualTutor', 'Virtual Tutor')} /></Button>
          <Button onClick={() => setIsSmartReviewVisible(true)}><TransliterableText text={t('studentDashboard.smartReview', 'Smart Review')} /></Button>
          <Button onClick={() => setIsFillInTheBlanksVisible(true)}><TransliterableText text={t('studentDashboard.fillInTheBlanks', 'Fill in the Blanks')} /></Button>
          <Button onClick={() => setIsSentenceUnscrambleVisible(true)}><TransliterableText text={t('studentDashboard.sentenceUnscramble', 'Sentence Unscramble')} /></Button>
        </div>
      </div>
      
      {/* Render the study tools if they are visible. */}
      {isMistakeNotebookVisible && <div className="study-card"><MistakeNotebook /></div>}
      {isGrammarReviewVisible && <div className="study-card"><GrammarReview /></div>}
      {isVirtualTutorVisible && <div className="study-card"><VirtualTutor /></div>}
      {isSmartReviewVisible && <div className="study-card"><SmartReview userId={currentUser?.id} /></div>}
      {isFillInTheBlanksVisible && <div className="study-card"><StudyFillInTheBlanks language={currentLangKey} /></div>}
      {isSentenceUnscrambleVisible && <div className="study-card"><StudySentenceUnscramble language={currentLangKey} /></div>}

      {/* A section for quizzes. */}
      <div className="study-card">
        <div className="quizzes-section">
            <h3><TransliterableText text={t('studentDashboard.quizzes', 'Quizzes')} /></h3>
            <p><em><TransliterableText text={t('studentDashboard.quizzesComingSoon', 'Quizzes are coming soon!')} /></em></p>
        </div>
      </div>

      {/* A section for flashcard decks. */}
      <div className="study-card">
        <div className="flashcards-section">
            <h3><TransliterableText text={t('studentDashboard.myFlashcards', 'My Flashcards')} /></h3>
            <p><em><TransliterableText text={t('studentDashboard.flashcardsComingSoon', 'Flashcard decks are coming soon!')} /></em></p>
        </div>
      </div>

      {/* The main content of the lesson, with dynamically rendered exercise blocks. */}
      <div className="lesson-content-student-view">
        {paginatedBlocks.map((block, index) => {
          const componentKey = block.block_type;
          const DisplayComponent = displayComponentMap[componentKey];
          const blockDomId = getBlockElementId(block.id || block.title || block.block_type, index);

          if (DisplayComponent) {
            return (
              <div key={index} id={blockDomId} className="study-card">
                <DisplayComponent 
                  blockData={block}
                />
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
      <div className="pagination-controls">
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
