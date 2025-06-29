import React, { useState } from 'react';
import { useI18n } from '../../../i18n/I18nContext';
import './CreateFlashcardForm.css'; // To be created

const STUDENT_PERSONAL_SETS_STORAGE_KEY = 'cosyStudySets_student_personal_cards';

const CreateFlashcardForm = ({ onFlashcardSaved }) => {
    const { t } = useI18n();
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [feedback, setFeedback] = useState('');

    const generateUniqueId = (prefix = 'item') => {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!frontText.trim()) {
            setFeedback(t('flashcardFrontRequired') || 'The "Front" of the flashcard cannot be empty.');
            return;
        }
        if (!backText.trim()) {
            setFeedback(t('flashcardBackRequired') || 'The "Back" of the flashcard cannot be empty.');
            return;
        }

        const newFlashcard = {
            id: generateUniqueId('student_fc'),
            term1: frontText.trim(), // Analogy to study set items
            term2: backText.trim(),  // Analogy to study set items
            source: 'student', // To distinguish from teacher-created sets/items
            createdAt: new Date().toISOString(),
            // SRS data can be added when the card is first studied
            srsData: { 
                nextReview: new Date().toISOString(), 
                interval: 1, 
                easeFactor: 2.5, 
                repetitions: 0, 
                lapses: 0 
            }
        };

        try {
            const existingCards = JSON.parse(localStorage.getItem(STUDENT_PERSONAL_SETS_STORAGE_KEY) || '[]');
            existingCards.push(newFlashcard);
            localStorage.setItem(STUDENT_PERSONAL_SETS_STORAGE_KEY, JSON.stringify(existingCards));
            
            setFeedback(t('flashcardSavedSuccess') || 'Flashcard saved successfully!');
            setFrontText('');
            setBackText('');
            if (onFlashcardSaved) {
                onFlashcardSaved(newFlashcard); // Callback for parent component if needed
            }
        } catch (error) {
            console.error("Error saving flashcard to localStorage:", error);
            setFeedback(t('flashcardSaveError') || 'Could not save flashcard.');
        }

        setTimeout(() => setFeedback(''), 3000); // Clear feedback after 3 seconds
    };

    return (
        <div className="create-flashcard-form">
            <h3>{t('createFlashcardTitle') || 'Create New Flashcard'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="flashcard-front">{t('flashcardFrontLabel') || 'Front Text'}:</label>
                    <textarea
                        id="flashcard-front"
                        value={frontText}
                        onChange={(e) => setFrontText(e.target.value)}
                        placeholder={t('flashcardFrontPlaceholder') || 'Enter text for the front...'}
                        rows="3"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="flashcard-back">{t('flashcardBackLabel') || 'Back Text (Answer/Translation)'}:</label>
                    <textarea
                        id="flashcard-back"
                        value={backText}
                        onChange={(e) => setBackText(e.target.value)}
                        placeholder={t('flashcardBackPlaceholder') || 'Enter text for the back...'}
                        rows="3"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {t('saveFlashcardBtn') || 'Save Flashcard'}
                </button>
            </form>
            {feedback && <p className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</p>}
        </div>
    );
};

export default CreateFlashcardForm;
