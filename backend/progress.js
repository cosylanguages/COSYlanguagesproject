const express = require('express');
const router = express.Router();

// Mock user progress data
let userProgress = {
  1: {
    learnedWords: [],
    streaks: 0
  }
};

// Get user progress
router.get('/:userId', (req, res) => {
  const progress = userProgress[req.params.userId];
  if (progress) {
    res.json(progress);
  } else {
    res.status(404).json({ success: false, message: 'User progress not found' });
  }
});

// Update user progress
router.put('/:userId', (req, res) => {
  const { learnedWords, streaks } = req.body;
  userProgress[req.params.userId] = { learnedWords, streaks };
  res.json(userProgress[req.params.userId]);
});

module.exports = router;
