import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import NotesPanel from './StudentTools/NotesPanel'; // Corrected path
import IrregularVerbsTool from './StudentTools/IrregularVerbsTool'; // Corrected path
import TimerTool from './StudentTools/TimerTool'; // Import TimerTool

// Basic styling can be added to StudyModePage.css or a dedicated file

const ToolsPanel = () => {
  const { t, language: currentUILanguage } = useI18n(); // Get currentUILanguage
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isIrregularVerbsOpen, setIsIrregularVerbsOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false); // State for TimerTool
  // Add state for dictionary when available

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  const toggleIrregularVerbs = () => setIsIrregularVerbsOpen(!isIrregularVerbsOpen);
  const toggleTimer = () => setIsTimerOpen(!isTimerOpen); // Handler for TimerTool

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
          <button className="btn-link" disabled>
            <TransliterableText text={t('studyMode.toolDictionary', '📖 Dictionary (Soon)')} />
          </button>
        </li>
        {/* Add more tools as needed */}
      </ul>

      {isNotesOpen && <NotesPanel isOpen={isNotesOpen} onClose={toggleNotes} />}
      {isIrregularVerbsOpen && <IrregularVerbsTool isOpen={isIrregularVerbsOpen} onClose={toggleIrregularVerbs} />}
      {isTimerOpen && <TimerTool isOpen={isTimerOpen} onClose={toggleTimer} />} {/* Render TimerTool */}
      {/* Render DictionaryTool when available and isDictionaryOpen is true */}
    </div>
  );
};

export default ToolsPanel;
