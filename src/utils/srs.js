// Spaced Repetition System (SRS) utility functions

const getNextReviewInterval = (currentInterval, factor) => {
  return Math.round(currentInterval * factor);
};

const getNextGrammarReviewInterval = (currentInterval, factor) => {
    return Math.round(currentInterval * factor);
};

export const getGrammarReviewSchedule = () => {
    const schedule = localStorage.getItem('grammarReviewSchedule');
    return schedule ? JSON.parse(schedule) : {};
};

export const updateGrammarReviewSchedule = (schedule) => {
    localStorage.setItem('grammarReviewSchedule', JSON.stringify(schedule));
};

export { getNextReviewInterval, getNextGrammarReviewInterval };
