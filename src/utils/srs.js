// Spaced Repetition System (SRS) utility functions

const getNextReviewInterval = (currentInterval, factor) => {
  return Math.round(currentInterval * factor);
};

export { getNextReviewInterval };
