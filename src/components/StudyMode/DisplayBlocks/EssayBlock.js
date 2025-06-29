import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './SimpleTextDisplay.css'; // Reuse shared CSS

const EssayBlock = ({ blockData, onStudentInput }) => { // onStudentInput is a potential prop for saving student's work
    const { t, language } = useI18n();
    const { title, prompt = {} } = blockData;

    const blockTitle = title?.[language] || title?.COSYenglish || title?.default || t('essayBlockDefaultTitle') || 'Essay';
    const essayPrompt = prompt?.[language] || prompt?.COSYenglish || prompt?.default || '';

    const [studentEssay, setStudentEssay] = useState('');

    const handleInputChange = (event) => {
        setStudentEssay(event.target.value);
        if (onStudentInput) {
            // Debounce this or call on a "save progress" button
            // onStudentInput(blockData.id, event.target.value);
        }
    };

    return (
        <div className="essay-block display-simple-block">
            <h4>{blockTitle}</h4>
            {essayPrompt ? (
                <p className="essay-prompt-display">{essayPrompt}</p>
            ) : (
                <p>({t('noEssayPromptProvided') || 'No essay prompt provided.'})</p>
            )}
            <textarea
                className="student-essay-input"
                value={studentEssay}
                onChange={handleInputChange}
                placeholder={t('startWritingEssayPlaceholder') || 'Start writing your essay here...'}
                rows="10"
                aria-label={t('essayInputAriaLabel') || 'Essay input area'}
            />
            {/* Future: Add save button or auto-save indicator if onStudentInput is used */}
        </div>
    );
};

export default EssayBlock;
