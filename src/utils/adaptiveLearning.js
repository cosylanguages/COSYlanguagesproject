// Adaptive learning system utility functions

const adjustDifficulty = (currentDifficulty, performance) => {
  if (performance > 0.8) {
    return Math.min(currentDifficulty + 1, 10); // Increase difficulty, max 10
  } else if (performance < 0.5) {
    return Math.max(currentDifficulty - 1, 1); // Decrease difficulty, min 1
  }
  return currentDifficulty;
};

export { adjustDifficulty };
