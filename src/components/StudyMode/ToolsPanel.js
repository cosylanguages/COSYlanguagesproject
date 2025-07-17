import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import NotesPanel from './StudentTools/NotesPanel'; // Corrected path
import IrregularVerbsTool from './StudentTools/IrregularVerbsTool'; // Corrected path
import TimerTool from './StudentTools/TimerTool'; // Import TimerTool
import DictionaryTool from './StudentTools/DictionaryTool'; // Import DictionaryTool

// Basic styling can be added to StudyModePage.css or a dedicated file

const ToolsPanel = () => {
  const { t, language: currentUILanguage } = useI18n(); // Get currentUILanguage
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isIrregularVerbsOpen, setIsIrregularVerbsOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false); // State for TimerTool
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false); // State for DictionaryTool

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  const toggleIrregularVerbs = () => setIsIrregularVerbsOpen(!isIrregularVerbsOpen);
  const toggleTimer = () => setIsTimerOpen(!isTimerOpen); // Handler for TimerTool
  const toggleDictionary = () => setIsDictionaryOpen(!isDictionaryOpen); // Handler for DictionaryTool

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
        {/* Add more tools as needed */}
      </ul>

      {isNotesOpen && <NotesPanel isOpen={isNotesOpen} onClose={toggleNotes} />}
      {isIrregularVerbsOpen && <IrregularVerbsTool isOpen={isIrregularVerbsOpen} onClose={toggleIrregularVerbs} />}
      {isTimerOpen && <TimerTool isOpen={isTimerOpen} onClose={toggleTimer} />}
      {isDictionaryOpen && <DictionaryTool isOpen={isDictionaryOpen} onClose={toggleDictionary} />}
    </div>
  );
};

export default ToolsPanel;
