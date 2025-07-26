import React, { useState } from 'react';
import './NotesPanel.css';

const NotesTool = () => {
  const [notes, setNotes] = useState('');

  return (
    <div className="notes-panel">
      <h3>Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Take notes here..."
      />
    </div>
  );
};

export default NotesTool;
