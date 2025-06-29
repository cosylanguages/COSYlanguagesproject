import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './NotesPanel.css'; // To be created

const NOTES_STORAGE_KEY = 'cosyStudyModeNotes';

const NotesPanel = ({ isOpen, onClose }) => {
    const { t } = useI18n();
    const [notes, setNotes] = useState('');
    const [saveFeedback, setSaveFeedback] = useState('');

    useEffect(() => {
        const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, []);

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
        if (saveFeedback) setSaveFeedback(''); // Clear feedback on new input
    };

    const handleSaveNotes = () => {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY, notes);
            setSaveFeedback(t('notesSavedSuccess') || 'Notes saved!');
        } catch (error) {
            console.error("Error saving notes to localStorage:", error);
            setSaveFeedback(t('notesSaveError') || 'Could not save notes.');
        }
        setTimeout(() => setSaveFeedback(''), 2000);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="notes-panel-overlay" onClick={onClose}>
            <div className="notes-panel-content" onClick={(e) => e.stopPropagation()}>
                <div className="notes-panel-header">
                    <h3>{t('myNotesTitle') || 'My Notes'}</h3>
                    <button onClick={onClose} className="btn-icon close-notes-btn" aria-label={t('closeNotesBtnAria') || 'Close Notes'}>
                        &times;
                    </button>
                </div>
                <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder={t('typeNotesPlaceholder') || 'Type your notes here...'}
                    rows="15"
                />
                <div className="notes-panel-footer">
                    <button onClick={handleSaveNotes} className="btn btn-primary">
                        {t('saveNotesBtn') || 'Save Notes'}
                    </button>
                    {saveFeedback && <span className="save-feedback">{saveFeedback}</span>}
                </div>
            </div>
        </div>
    );
};

export default NotesPanel;
