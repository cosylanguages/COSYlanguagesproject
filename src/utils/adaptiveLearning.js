/**
 * Adjusts the difficulty of a learning activity based on the user's performance.
 * @param {number} currentDifficulty - The current difficulty level (from 1 to 10).
 * @param {number} performance - The user's performance on the activity (from 0 to 1).
 * @returns {number} The new difficulty level.
 */
const adjustDifficulty = (currentDifficulty, performance) => {
  // Scale the performance to a range of -1 to 1.
  const performanceFactor = (performance - 0.5) * 2;
  // Adjust the difficulty by up to 2 points.
  const difficultyAdjustment = Math.round(performanceFactor * 2);
  const newDifficulty = currentDifficulty + difficultyAdjustment;
  // Clamp the difficulty between 1 and 10.
  return Math.max(1, Math.min(10, newDifficulty));
};

export { adjustDifficulty };
