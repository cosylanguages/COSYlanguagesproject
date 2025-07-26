const express = require('express');
const router = express.Router();

// Mock booster packs data
let boosterPacks = [];

// Get all booster packs
router.get('/', (req, res) => {
  res.json(boosterPacks);
});

// Create a new booster pack
router.post('/', (req, res) => {
  const { name, content } = req.body;
  const newBoosterPack = { id: boosterPacks.length + 1, name, content };
  boosterPacks.push(newBoosterPack);
  res.json(newBoosterPack);
});

// Delete a booster pack
router.delete('/:id', (req, res) => {
  const index = boosterPacks.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    boosterPacks.splice(index, 1);
    res.json({ success: true, message: 'Booster pack deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Booster pack not found' });
  }
});

module.exports = router;
