const express = require('express');
const router = express.Router();

// Mock freestyle progress data
let freestyleProgress = {
  1: {
    progress: {}
  }
};

// Get freestyle progress
router.get('/:userId', (req, res) => {
  const progress = freestyleProgress[req.params.userId];
  if (progress) {
    res.json(progress);
  } else {
    res.status(404).json({ success: false, message: 'Freestyle progress not found' });
  }
});

// Update freestyle progress
router.put('/:userId', (req, res) => {
  const { progress } = req.body;
  freestyleProgress[req.params.userId] = { progress };
  res.json(freestyleProgress[req.params.userId]);
});

module.exports = router;
