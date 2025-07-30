import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './NotesPanel.css';

const NotesTool = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes || '';
  });
  const { t } = useI18n();

  useEffect(() => {
    localStorage.setItem('notes', notes);
  }, [notes]);

  return (
    <div className="notes-panel">
      <h3>{t('studyMode.toolNotes', 'Notes')}</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('studyMode.notesPlaceholder', 'Take notes here...')}
      />
    </div>
  );
};

export default NotesTool;
