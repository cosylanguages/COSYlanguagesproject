const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

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

// @route   POST /api/clubs
// @desc    Create a new club
// @access  Private (Admin/Teacher)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const newClub = new Event(req.body);
    const club = await newClub.save();
    res.json(club);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/clubs/:id
// @desc    Update a club
// @access  Private (Admin/Teacher)
router.put('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const club = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/clubs/:id
// @desc    Delete a club
// @access  Private (Admin/Teacher)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const club = await Event.findByIdAndDelete(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json({ message: 'Club removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
