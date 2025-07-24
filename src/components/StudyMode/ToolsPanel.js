import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import TransliterableText from '../Common/TransliterableText';
import NotesPanel from './StudentTools/NotesPanel'; // Corrected path
import IrregularVerbsTool from './StudentTools/IrregularVerbsTool'; // Corrected path
import TimerTool from './StudentTools/TimerTool'; // Import TimerTool
import DictionaryTool from './StudentTools/DictionaryTool'; // Import DictionaryTool
import QuizCreator from './QuizCreator';
import Whiteboard from './Whiteboard';
import FlashcardCreator from './FlashcardCreator';
import Modal from '../Common/Modal';

// Basic styling can be added to StudyModePage.css or a dedicated file

const ToolsPanel = () => {
  const { t, language: currentUILanguage } = useI18n(); // Get currentUILanguage
  const { selectedRole } = useAuth();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isIrregularVerbsOpen, setIsIrregularVerbsOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false); // State for TimerTool
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false); // State for DictionaryTool
  const [isQuizCreatorOpen, setIsQuizCreatorOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isFlashcardCreatorOpen, setIsFlashcardCreatorOpen] = useState(false);

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  const toggleIrregularVerbs = () => setIsIrregularVerbsOpen(!isIrregularVerbsOpen);
  const toggleTimer = () => setIsTimerOpen(!isTimerOpen); // Handler for TimerTool
  const toggleDictionary = () => setIsDictionaryOpen(!isDictionaryOpen); // Handler for DictionaryTool
  const toggleQuizCreator = () => setIsQuizCreatorOpen(!isQuizCreatorOpen);
  const toggleWhiteboard = () => setIsWhiteboardOpen(!isWhiteboardOpen);
  const toggleFlashcardCreator = () => setIsFlashcardCreatorOpen(!isFlashcardCreatorOpen);

  const verbsToolLabel = currentUILanguage === 'COSYenglish'
    ? t('studyMode.toolIrregularVerbs', '📚 Irregular Verbs')
    : t('studyMode.toolConjugations', '📚 Conjugations');

  return (
    <div className="tools-panel">
      <h4>
        <TransliterableText text={t('studyMode.toolsTitle', 'Tools')} />
      </h4>
      <ul>
        <li>
          <button onClick={toggleNotes} className="btn-link">
            <TransliterableText text={t('studyMode.toolNotes', '📝 Notes')} />
          </button>
        </li>
        <li>
          <button onClick={toggleIrregularVerbs} className="btn-link">
            <TransliterableText text={verbsToolLabel} />
          </button>
        </li>
        <li>
          <button onClick={toggleTimer} className="btn-link"> {/* Button for TimerTool */}
            <TransliterableText text={t('studyMode.toolTimer', '⏱️ Timer')} />
          </button>
        </li>
        <li>
          <button onClick={toggleDictionary} className="btn-link">
            <TransliterableText text={t('studyMode.toolDictionary', '📖 Dictionary')} />
          </button>
        </li>
        <li>
            <button onClick={toggleWhiteboard} className="btn-link">
                <TransliterableText text={t('studyMode.toolWhiteboard', '🎨 Whiteboard')} />
            </button>
        </li>
        <li>
            <button onClick={toggleFlashcardCreator} className="btn-link">
                <TransliterableText text={t('studyMode.toolCreateFlashcards', '🃏 Create Flashcards')} />
            </button>
        </li>
        {selectedRole === 'teacher' && (
          <li>
            <button onClick={toggleQuizCreator} className="btn-link">
              <TransliterableText text={t('studyMode.toolCreateQuiz', '📝 Create Quiz')} />
            </button>
          </li>
        )}
        {/* Add more tools as needed */}
      </ul>

      {isNotesOpen && <NotesPanel isOpen={isNotesOpen} onClose={toggleNotes} />}
      {isIrregularVerbsOpen && <IrregularVerbsTool isOpen={isIrregularVerbsOpen} onClose={toggleIrregularVerbs} />}
      {isTimerOpen && <TimerTool isOpen={isTimerOpen} onClose={toggleTimer} />}
      {isDictionaryOpen && <DictionaryTool isOpen={isDictionaryOpen} onClose={toggleDictionary} />}
      {isQuizCreatorOpen && (
        <Modal isOpen={isQuizCreatorOpen} onClose={toggleQuizCreator}>
          <QuizCreator />
        </Modal>
      )}
      {isWhiteboardOpen && (
        <Modal isOpen={isWhiteboardOpen} onClose={toggleWhiteboard}>
            <Whiteboard />
        </Modal>
      )}
      {isFlashcardCreatorOpen && (
          <Modal isOpen={isFlashcardCreatorOpen} onClose={toggleFlashcardCreator}>
              <FlashcardCreator />
          </Modal>
      )}
    </div>
  );
};

export default ToolsPanel;
