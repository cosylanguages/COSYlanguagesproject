const express = require('express');
const router = express.Router();

// Mock study sets data
let studySets = [
  { id: 1, name: 'My First Study Set', cards: [] }
];

// Get all study sets
router.get('/', (req, res) => {
  res.json(studySets);
});

// Get a study set by id
router.get('/:id', (req, res) => {
  const studySet = studySets.find(s => s.id === parseInt(req.params.id));
  if (studySet) {
    res.json(studySet);
  } else {
    res.status(404).json({ success: false, message: 'Study set not found' });
  }
});

// Create a new study set
router.post('/', (req, res) => {
  const { name } = req.body;
  const newStudySet = { id: studySets.length + 1, name, cards: [] };
  studySets.push(newStudySet);
  res.json(newStudySet);
});

// Update a study set
router.put('/:id', (req, res) => {
  const { name } = req.body;
  const studySet = studySets.find(s => s.id === parseInt(req.params.id));
  if (studySet) {
    studySet.name = name;
    res.json(studySet);
  } else {
    res.status(404).json({ success: false, message: 'Study set not found' });
  }
});

// Delete a study set
router.delete('/:id', (req, res) => {
  const index = studySets.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    studySets.splice(index, 1);
    res.json({ success: true, message: 'Study set deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Study set not found' });
  }
});

module.exports = router;
