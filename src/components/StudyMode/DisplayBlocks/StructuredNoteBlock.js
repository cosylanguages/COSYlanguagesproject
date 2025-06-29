import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import { useAuth } from '../../../AuthContext'; // To check if current user is student or teacher for visibility
import { getHeadingForColor } from '../../../config/templateSections'; // To generate title from color
import './StructuredNoteBlock.css'; // Basic styling for the block

const StructuredNoteBlock = ({ blockData }) => {
    const { t, language: currentUILanguage } = useI18n();
    const { currentUser } = useAuth();

    if (!blockData || blockData.type !== 'utility/note') {
        return <p>{t('errorIncorrectBlockData') || 'Incorrect data for Structured Note block.'}</p>;
    }

    const { content, title: blockTitleObj } = blockData;
    const noteContent = content?.text || '';
    const noteColor = content?.color || '#FFFF00'; // Default yellow
    const isVisibleToStudent = content?.isVisibleToStudent !== undefined ? content.isVisibleToStudent : true;

    // Determine the title: use the one from blockData if available, otherwise generate from color
    let displayTitle = blockTitleObj?.[currentUILanguage] || blockTitleObj?.COSYenglish;
    if (!displayTitle) {
        displayTitle = getHeadingForColor(noteColor, currentUILanguage);
    }
    
    // Students should not see the note if it's marked as not visible
    if (currentUser?.role !== 'teacher' && !isVisibleToStudent) {
        return null; // Render nothing for students if not visible
    }

    return (
        <div 
            className="structured-note-block exercise-block-display" 
            style={{ 
                borderLeft: `5px solid ${noteColor}`,
                backgroundColor: `${noteColor}20` // Light background tint based on color
            }}
        >
            <h5 className="structured-note-title" style={{ color: noteColor }}>
                {displayTitle}
            </h5>
            <div 
                className="structured-note-text-content" 
                dangerouslySetInnerHTML={{ __html: noteContent.replace(/\n/g, '<br />') }} 
            />
            {currentUser?.role === 'teacher' && !isVisibleToStudent && (
                <p className="visibility-notice">
                    <em>({t('noteNotVisibleToStudents') || 'Note: Not visible to students'})</em>
                </p>
            )}
        </div>
    );
};

export default StructuredNoteBlock;
