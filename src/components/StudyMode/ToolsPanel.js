import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import TransliterableText from '../Common/TransliterableText';
import NotesPanel from './StudentTools/NotesPanel'; // Corrected path
import IrregularVerbsTool from './StudentTools/IrregularVerbsTool'; // Corrected path

// Basic styling can be added to StudyModePage.css or a dedicated file

const ToolsPanel = () => {
  const { t } = useI18n();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isIrregularVerbsOpen, setIsIrregularVerbsOpen] = useState(false);
  // Add state for dictionary when available

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  const toggleIrregularVerbs = () => setIsIrregularVerbsOpen(!isIrregularVerbsOpen);

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
            <TransliterableText text={t('studyMode.toolIrregularVerbs', '📚 Irregular Verbs')} />
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
      {/* Render DictionaryTool when available and isDictionaryOpen is true */}
    </div>
  );
};

export default ToolsPanel;
