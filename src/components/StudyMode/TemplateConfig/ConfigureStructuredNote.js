import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { getHeadingForColor } from '../../../config/templateSections'; // Assuming this helper is also ported or available
import './ConfigureStructuredNote.css';

// This function might need to be moved to a shared util or config if not already.
// For now, keeping it here if it's specific or until we refactor templateSections.js fully.
const STRUCTURED_NOTE_COLOR_TO_HEADING_MAP_REACT = {
    "#ff0000": { "COSYenglish": "Important Note", "COSYfrançais": "Note Importante" }, 
    "#0000ff": { "COSYenglish": "Grammar Tip", "COSYfrançais": "Conseil de Grammaire" }, 
    "#008000": { "COSYenglish": "Vocabulary Focus", "COSYfrançais": "Focus Vocabulaire" }, 
    "#ffff00": { "COSYenglish": "Quick Tip", "COSYfrançais": "Conseil Rapide" }, 
    "#800080": { "COSYenglish": "Reminder", "COSYfrançais": "Rappel" }, 
    "#808080": { "COSYenglish": "General Note", "COSYfrançais": "Note Générale" },  
    "#ffa500": { "COSYenglish": "Speaking Prompt", "COSYfrançais": "Sujet de Conversation" }, 
    "#add8e6": { "COSYenglish": "Teacher's Feedback", "COSYfrançais": "Retour de l'enseignant" } 
    // Ensure all languages from allTranslations are covered or have a fallback.
};

// Helper to ensure all languages have a fallback for headings
const ensureAllHeadings = (allLangs) => {
    allLangs.forEach(lang => {
        Object.values(STRUCTURED_NOTE_COLOR_TO_HEADING_MAP_REACT).forEach(headingMap => {
            if (!headingMap[lang]) {
                headingMap[lang] = headingMap["COSYenglish"] || "Note";
            }
        });
    });
};


const ConfigureStructuredNote = ({ existingBlockData, onSave, onCancel, availableLanguages }) => {
    const { t, language: currentUILanguage, allTranslations } = useI18n();
    
    // Ensure headings are complete when component mounts or allTranslations changes
    useEffect(() => {
        if (allTranslations) {
            ensureAllHeadings(Object.keys(allTranslations));
        }
    }, [allTranslations]);

    const getInitialTitlePreview = (color) => {
        // Use the imported getHeadingForColor if it's correctly set up and exported from templateSections.js
        // Otherwise, use the local version for now.
        const headingMap = STRUCTURED_NOTE_COLOR_TO_HEADING_MAP_REACT[color.toLowerCase()];
        if (headingMap) {
            return headingMap[currentUILanguage] || headingMap["COSYenglish"] || "Note";
        }
        return STRUCTURED_NOTE_COLOR_TO_HEADING_MAP_REACT["#808080"]?.[currentUILanguage] || "Note";
    };

    const [noteText, setNoteText] = useState(existingBlockData?.content?.text || '');
    const [noteColor, setNoteColor] = useState(existingBlockData?.content?.color || '#ffff00');
    const [isVisibleToStudent, setIsVisibleToStudent] = useState(
        existingBlockData?.content?.isVisibleToStudent !== undefined ? existingBlockData.content.isVisibleToStudent : true
    );
    const [titlePreview, setTitlePreview] = useState(getInitialTitlePreview(noteColor));

    useEffect(() => {
        setTitlePreview(getInitialTitlePreview(noteColor));
    }, [noteColor, currentUILanguage, allTranslations]); // Re-calculate on color or language change

    const handleSave = () => {
        if (!noteText.trim()) {
            alert(t('noteContentEmptyValidation') || "Note content cannot be empty.");
            return;
        }

        const newBlockData = {
            id: existingBlockData?.id || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'utility/note',
            // Title is now dynamically generated based on color, so we don't save a user-input title for the block itself.
            // The display component will use getHeadingForColor.
            // However, the backend structure from app-study-mode.js saves a 'title' object for the block.
            // We need to decide if this React version will do the same or rely purely on color for display title.
            // For consistency with existing data structure from app-study-mode.js, let's generate it.
            title: {}, // This will be populated based on color
            content: {
                text: noteText.trim(),
                color: noteColor,
                isVisibleToStudent: isVisibleToStudent,
            },
            createdAt: existingBlockData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Populate multilingual titles based on the selected color
        Object.keys(allTranslations || { "COSYenglish": {} }).forEach(langKey => {
            newBlockData.title[langKey] = getHeadingForColor(noteColor, langKey);
        });
        
        onSave(newBlockData);
    };

    return (
        <div className="configure-structured-note">
            <h4>{existingBlockData ? (t('editStructuredNoteTitle') || 'Edit Structured Note') : (t('addStructuredNoteTitle') || 'Add Structured Note')}</h4>
            
            <div className="form-group">
                <label htmlFor="structured-note-color">{t('noteColorLabel') || 'Note Color:'}</label>
                <input 
                    type="color" 
                    id="structured-note-color" 
                    value={noteColor} 
                    onChange={(e) => setNoteColor(e.target.value)} 
                    className="form-control-color"
                />
            </div>

            <div className="form-group">
                <label htmlFor="structured-note-title-preview">{t('noteTitlePreviewLabel') || 'Heading (Auto-generated from color):'}</label>
                <input 
                    type="text" 
                    id="structured-note-title-preview" 
                    value={titlePreview} 
                    readOnly 
                    disabled 
                    className="form-control-plaintext"
                />
            </div>

            <div className="form-group">
                <label htmlFor="structured-note-text">{t('noteContentLabel') || 'Note Content:'}</label>
                <textarea
                    id="structured-note-text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows="6"
                    placeholder={t('noteContentPlaceholder') || "Enter the text for your note..."}
                    className="form-control-textarea"
                />
            </div>

            <div className="form-group form-check">
                <input 
                    type="checkbox" 
                    id="structured-note-visibility" 
                    checked={isVisibleToStudent} 
                    onChange={(e) => setIsVisibleToStudent(e.target.checked)} 
                    className="form-check-input"
                />
                <label htmlFor="structured-note-visibility" className="form-check-label">
                    {t('noteVisibleToStudentLabel') || 'Visible to Student'}
                </label>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    {t('cancelBtn') || 'Cancel'}
                </button>
                <button type="button" onClick={handleSave} className="btn btn-primary">
                    {t('saveBtn') || 'Save Note Section'}
                </button>
            </div>
        </div>
    );
};

export default ConfigureStructuredNote;
