const express = require('express');
const router = express.Router();
const StudySet = require('./models/studySet');

// Get all study sets for the current user
router.get('/', async (req, res) => {
  try {
    const studySets = await StudySet.find({ user: req.user._id });
    res.json(studySets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching study sets', error });
  }
});

// Get a study set by id
router.get('/:id', async (req, res) => {
  try {
    const studySet = await StudySet.findOne({ _id: req.params.id, user: req.user._id });
    if (studySet) {
      res.json(studySet);
    } else {
      res.status(404).json({ success: false, message: 'Study set not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching study set', error });
  }
});

// Create a new study set
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newStudySet = new StudySet({
      name,
      user: req.user._id,
      cards: [],
    });
    await newStudySet.save();
    res.status(201).json(newStudySet);
  } catch (error) {
    res.status(400).json({ message: 'Error creating study set', error });
  }
});

// Add a card to a study set
router.post('/:id/cards', async (req, res) => {
  try {
    const { front, back } = req.body;
    const studySet = await StudySet.findOne({ _id: req.params.id, user: req.user._id });
    if (studySet) {
      const newCard = { front, back };
      studySet.cards.push(newCard);
      await studySet.save();
      res.status(201).json(studySet);
    } else {
      res.status(404).json({ success: false, message: 'Study set not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error adding card', error });
  }
});

// Update a study set
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const studySet = await StudySet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name },
      { new: true }
    );
    if (studySet) {
      res.json(studySet);
    } else {
      res.status(404).json({ success: false, message: 'Study set not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating study set', error });
  }
});

// Delete a study set
router.delete('/:id', async (req, res) => {
  try {
    const result = await StudySet.deleteOne({ _id: req.params.id, user: req.user._id });
    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Study set deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Study set not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting study set', error });
  }
});

module.exports = router;
