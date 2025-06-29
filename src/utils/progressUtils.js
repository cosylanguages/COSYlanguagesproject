// frontend/src/utils/progressUtils.js

const PROGRESS_STORAGE_KEY = 'COSY_STUDY_MODE_PROGRESS';

/**
 * Loads all progress data from localStorage.
 * @returns {object} The entire progress object, or an empty object if none found.
 */
const loadAllProgress = () => {
    try {
        const rawProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
        return rawProgress ? JSON.parse(rawProgress) : {};
    } catch (error) {
        console.error("Error loading progress from localStorage:", error);
        return {}; // Return empty object on error to prevent app crash
    }
};

/**
 * Saves the entire progress object to localStorage.
 * @param {object} allProgressData - The complete progress data object to save.
 */
const saveAllProgress = (allProgressData) => {
    try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgressData));
    } catch (error) {
        console.error("Error saving progress to localStorage:", error);
    }
};

/**
 * Loads progress for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {object} The user's progress data, or an empty object if none found for this user.
 */
export const loadUserProgress = (userId) => {
    if (!userId) return {};
    const allProgress = loadAllProgress();
    return allProgress[userId] || {};
};

/**
 * Updates and saves progress for a specific block for a given user.
 * @param {object} params - The parameters for updating progress.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.dayId - The ID of the day.
 * @param {string} params.sectionId - The ID of the lesson section.
 * @param {string} params.blockId - The ID of the content block.
 * @param {number} params.score - The score achieved in the latest attempt.
 * @param {number} params.total - The total possible score for the block.
 * @returns {object} The updated progress data for the specific block.
 */
export const updateBlockProgress = ({
    userId,
    dayId,
    sectionId,
    blockId,
    score,
    total,
    // onAnswerPayload // Could be used to store more detailed history if needed later
}) => {
    if (!userId || !dayId || !sectionId || !blockId) {
        console.error("Missing IDs for updating block progress.");
        return null;
    }

    const allProgress = loadAllProgress();
    if (!allProgress[userId]) {
        allProgress[userId] = {};
    }
    if (!allProgress[userId][dayId]) {
        allProgress[userId][dayId] = {};
    }
    if (!allProgress[userId][dayId][sectionId]) {
        allProgress[userId][dayId][sectionId] = {};
    }

    const now = new Date().toISOString();
    const currentBlockProgress = allProgress[userId][dayId][sectionId][blockId] || {
        attempts: 0,
        score: 0,
        total: total, // Initialize total if it's the first attempt
        isCompleted: false,
        firstAttemptDate: now, // Set on first attempt
    };

    const updatedBlockData = {
        ...currentBlockProgress,
        score: score,
        total: total, // Update total in case it changes (e.g. config update)
        attempts: (currentBlockProgress.attempts || 0) + 1,
        lastAttemptDate: now,
        isCompleted: score === total,
    };
    
    if (updatedBlockData.attempts === 1) { // If it was the first attempt (after increment)
        updatedBlockData.firstAttemptDate = now;
    }


    allProgress[userId][dayId][sectionId][blockId] = updatedBlockData;
    saveAllProgress(allProgress);

    return updatedBlockData; // Return the updated progress for this specific block
};

/**
 * Gets the progress status for a specific block.
 * @param {string} userId - The ID of the user.
 * @param {string} dayId - The ID of the day.
 * @param {string} sectionId - The ID of the lesson section.
 * @param {string} blockId - The ID of the content block.
 * @returns {object | null} The block's progress data or null if not found.
 */
export const getBlockProgress = (userId, dayId, sectionId, blockId) => {
    if (!userId || !dayId || !sectionId || !blockId) return null;
    const userProgress = loadUserProgress(userId);
    return userProgress[dayId]?.[sectionId]?.[blockId] || null;
};

/**
 * Clears all study mode progress from localStorage.
 * Useful for testing or if a user wants to reset everything.
 */
export const clearAllStudyModeProgress = () => {
    try {
        localStorage.removeItem(PROGRESS_STORAGE_KEY);
        console.log("All Study Mode progress cleared from localStorage.");
    } catch (error) {
        console.error("Error clearing progress from localStorage:", error);
    }
};
