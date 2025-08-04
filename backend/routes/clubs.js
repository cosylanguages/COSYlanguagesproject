const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');

// @route   GET /api/clubs
// @desc    Get all club events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const clubs = await Event.find({ 'clubType': { $exists: true } });
    res.json(clubs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
