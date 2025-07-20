// Adaptive learning system utility functions

const adjustDifficulty = (currentDifficulty, performance) => {
  const performanceFactor = (performance - 0.5) * 2; // Scale performance to a range of -1 to 1
  const difficultyAdjustment = Math.round(performanceFactor * 2); // Adjust difficulty by up to 2 points
  const newDifficulty = currentDifficulty + difficultyAdjustment;
  return Math.max(1, Math.min(10, newDifficulty)); // Clamp difficulty between 1 and 10
};

export { adjustDifficulty };
