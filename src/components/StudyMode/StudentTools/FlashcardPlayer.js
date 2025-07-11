import React, { useState, useEffect, useMemo } from 'react'; // Removed useCallback
import { useI18n } from '../../../i18n/I18nContext';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchStudySetById } from '../../../api/studySets'; // Removed updateStudySet
import { pronounceText } from '../../../utils/speechUtils'; // Added
import './FlashcardPlayer.css'; 

const STUDENT_PERSONAL_SETS_STORAGE_KEY = 'cosyStudySets_student_personal_cards';

// Helper function to shuffle an array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// SRS Logic (ported and adapted from old app-study-mode.js concepts)
const calculateNewInterval = (previousInterval, easeFactor, repetitions) => {
    if (repetitions <= 1) return 1;
    if (repetitions === 2) return Math.max(2, Math.round(previousInterval * 1.5)); // Or a fixed value like 3-6 days
    return Math.min(365, Math.round(previousInterval * easeFactor)); // Cap interval at 1 year
};
const adjustEaseFactor = (easeFactor, quality) => { // quality: 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
    let newEase = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    return Math.max(1.3, newEase); // Minimum ease factor
};


const FlashcardPlayer = ({ studySetId, initialSetData, onExitPlayer, source }) => {
    const { t, language: currentUILanguage } = useI18n(); // currentUILanguage is the BCP47-like code from I18nContext
    const { authToken } = useAuth();

    const [currentSet, setCurrentSet] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [allCards, setAllCards] = useState([]); // Original order of cards from the set
    const [sessionQueue, setSessionQueue] = useState([]); // Cards to be studied in this session
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const [promptWith, setPromptWith] = useState('term1'); // 'term1' or 'term2'
    const [isShuffled, setIsShuffled] = useState(false);

    // Load full set data
    useEffect(() => {
        const loadSet = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let setData;
                if (source === 'student' && initialSetData) { // Student personal set passed directly
                    setData = initialSetData;
                } else if (source === 'teacher' && studySetId && authToken) { // Teacher set, fetch from API
                    setData = await fetchStudySetById(authToken, studySetId);
                } else if (initialSetData) { // Fallback if source isn't perfectly clear but data is there
                    setData = initialSetData;
                }
                else {
                    throw new Error(t('flashcardPlayerErrorNoSet') || "No study set specified.");
                }
                
                if (!setData || !setData.items) {
                     throw new Error(t('flashcardPlayerErrorInvalidSet') || "Invalid study set data.");
                }
                // Ensure items have default SRS data if missing
                const processedItems = setData.items.map(item => ({
                    ...item,
                    srsData: item.srsData || { nextReview: new Date().toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0, lapses: 0 }
                }));
                setCurrentSet({...setData, items: processedItems});
                setAllCards(processedItems);

            } catch (err) {
                console.error("Error loading study set for player:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadSet();
    }, [studySetId, initialSetData, source, authToken, t]);

    // Initialize session queue when allCards is populated or shuffle/prompt preference changes
    useEffect(() => {
        if (allCards.length > 0) {
            let queue = [...allCards];
            // TODO: Implement more sophisticated SRS queue logic (e.g., prioritize due cards)
            // For now, just use all cards, optionally shuffled
            if (isShuffled) {
                queue = shuffleArray(queue);
            }
            setSessionQueue(queue);
            setCurrentIndex(0);
            setIsFlipped(false);
        }
    }, [allCards, isShuffled]);


    const currentCard = useMemo(() => {
        if (sessionQueue.length > 0 && currentIndex < sessionQueue.length) {
            return sessionQueue[currentIndex];
        }
        return null;
    }, [sessionQueue, currentIndex]);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        if (currentIndex < sessionQueue.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            // End of session or loop?
            // For now, just stay on last card or show "Session Complete"
            alert(t('flashcardSessionComplete') || "Session complete!");
        }
    };
    
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    const handleSrsFeedback = async (quality) => { // quality: 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
        if (!currentCard) return;

        let updatedSrsData = { ...currentCard.srsData };
        updatedSrsData.lastReviewed = new Date().toISOString();
        
        if (quality === 0) { // Again
            updatedSrsData.repetitions = 0; // Reset repetitions
            updatedSrsData.lapses = (updatedSrsData.lapses || 0) + 1;
            updatedSrsData.interval = 1; // Reset interval to 1 day
        } else { // Hard, Good, Easy
            updatedSrsData.repetitions = (updatedSrsData.repetitions || 0) + 1;
            updatedSrsData.easeFactor = adjustEaseFactor(updatedSrsData.easeFactor || 2.5, quality);
            updatedSrsData.interval = calculateNewInterval(updatedSrsData.interval || 1, updatedSrsData.easeFactor, updatedSrsData.repetitions);
        }
        updatedSrsData.nextReview = new Date(Date.now() + updatedSrsData.interval * 24 * 60 * 60 * 1000).toISOString();

        // Update the card in the main `allCards` state and `sessionQueue`
        const updatedAllCards = allCards.map(card => card.id === currentCard.id ? { ...card, srsData: updatedSrsData } : card);
        setAllCards(updatedAllCards); 
        // Also update in sessionQueue to reflect immediately if card is revisited in same session (though typically next card)
        setSessionQueue(prevQ => prevQ.map(card => card.id === currentCard.id ? { ...card, srsData: updatedSrsData } : card));


        // Persist changes
        if (source === 'student') {
            try {
                localStorage.setItem(STUDENT_PERSONAL_SETS_STORAGE_KEY, JSON.stringify(updatedAllCards));
            } catch (err) {
                console.error("Error saving student set to localStorage:", err);
                // May want to notify user
            }
        } else if (source === 'teacher' && authToken && currentSet) {
            // For teacher sets, student progress isn't saved to the main set.
            // This is where you might save to a student-specific progress store if implemented.
            // For now, this feedback is ephemeral for teacher sets.
            console.log("SRS Feedback for teacher set item (not saved to backend in this version):", currentCard.id, updatedSrsData);
        }
        
        handleNext(); // Move to next card
    };


    if (isLoading) return <p>{t('loadingFlashcards') || "Loading flashcards..."}</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!currentCard) return <p>{t('noFlashcardsInSet') || "No flashcards in this set, or session ended."}</p>;

    const frontContent = promptWith === 'term1' ? currentCard.term1 : currentCard.term2;
    const backContent = promptWith === 'term1' ? currentCard.term2 : currentCard.term1;

    return (
        <div className="flashcard-player">
            <div className="player-header">
                <h3>{currentSet?.name || (t('studyingSet') || 'Studying Set')}</h3>
                <button onClick={onExitPlayer} className="btn btn-sm btn-outline-secondary exit-player-btn">
                    {t('exitPlayerBtn') || '✕ Exit'}
                </button>
            </div>
            <div className="player-controls-top">
                <label>
                    {t('promptWithLabel') || 'Prompt with:'}
                    <select value={promptWith} onChange={(e) => setPromptWith(e.target.value)}>
                        <option value="term1">{t('term1LabelShort') || 'Term 1'}</option>
                        <option value="term2">{t('term2LabelShort') || 'Term 2'}</option>
                    </select>
                </label>
                <label>
                    <input type="checkbox" checked={isShuffled} onChange={() => setIsShuffled(!isShuffled)} />
                    {t('shuffleCardsLabel') || 'Shuffle'}
                </label>
            </div>

            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip} role="button" tabIndex={0} aria-live="polite">
                <div className="flashcard-inner">
                    <div className="flashcard-front">
                        <p>{frontContent || (t('noContent') || '(No content)')}</p>
                        {frontContent && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); pronounceText(frontContent, currentSet?.languageCode || currentUILanguage); }} 
                                className="btn-icon pronounce-btn-flashcard"
                                title={t('pronounceText') || 'Pronounce'}
                                aria-label={t('pronounceText') || 'Pronounce'}
                            >🔊</button>
                        )}
                    </div>
                    <div className="flashcard-back">
                        <p>{backContent || (t('noContent') || '(No content)')}</p>
                        {backContent && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); pronounceText(backContent, currentSet?.languageCode || currentUILanguage); }} 
                                className="btn-icon pronounce-btn-flashcard"
                                title={t('pronounceText') || 'Pronounce'}
                                aria-label={t('pronounceText') || 'Pronounce'}
                            >🔊</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-progress">
                {t('cardProgressLabel', { current: currentIndex + 1, total: sessionQueue.length }) || `Card ${currentIndex + 1} of ${sessionQueue.length}`}
            </div>

            {isFlipped && (
                <div className="srs-feedback-buttons">
                    <button onClick={() => handleSrsFeedback(0)} className="btn btn-danger">{t('srsAgainBtn') || 'Again (0)'}</button>
                    <button onClick={() => handleSrsFeedback(1)} className="btn btn-warning">{t('srsHardBtn') || 'Hard (1)'}</button>
                    <button onClick={() => handleSrsFeedback(2)} className="btn btn-success">{t('srsGoodBtn') || 'Good (2)'}</button>
                    <button onClick={() => handleSrsFeedback(3)} className="btn btn-info">{t('srsEasyBtn') || 'Easy (3)'}</button>
                </div>
            )}

            <div className="navigation-buttons">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="btn btn-secondary">
                    {t('prevCardBtn') || '⬅ Previous'}
                </button>
                {!isFlipped ? (
                     <button onClick={handleFlip} className="btn btn-primary">{t('flipCardBtn') || 'Show Answer'}</button>
                ) : (
                    <span>&nbsp;</span> // Placeholder to keep spacing if SRS buttons shown
                )}
                <button onClick={handleNext} disabled={currentIndex >= sessionQueue.length - 1 && isFlipped} className="btn btn-secondary">
                    {isFlipped && currentIndex >= sessionQueue.length -1 ? (t('endSessionBtn') || 'End') : (t('nextCardBtn') || 'Next ➡')}
                </button>
            </div>
        </div>
    );
};

export default FlashcardPlayer;
