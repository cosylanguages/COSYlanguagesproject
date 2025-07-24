/**
 * Calculates the next review interval for a flashcard.
 * @param {number} currentInterval - The current review interval.
 * @param {number} factor - The factor to multiply the interval by.
 * @returns {number} The next review interval.
 */
const getNextReviewInterval = (currentInterval, factor) => {
  return Math.round(currentInterval * factor);
};

/**
 * Calculates the next review interval for a grammar point.
 * @param {number} currentInterval - The current review interval.
 * @param {number} factor - The factor to multiply the interval by.
 * @returns {number} The next review interval.
 */
const getNextGrammarReviewInterval = (currentInterval, factor) => {
    return Math.round(currentInterval * factor);
};

/**
 * Gets the grammar review schedule from local storage.
 * @returns {object} The grammar review schedule.
 */
export const getGrammarReviewSchedule = () => {
    const schedule = localStorage.getItem('grammarReviewSchedule');
    return schedule ? JSON.parse(schedule) : {};
};

/**
 * Updates the grammar review schedule in local storage.
 * @param {object} schedule - The new grammar review schedule.
 */
export const updateGrammarReviewSchedule = (schedule) => {
    localStorage.setItem('grammarReviewSchedule', JSON.stringify(schedule));
};

export { getNextReviewInterval, getNextGrammarReviewInterval };
