const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true }
});

const studySetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cards: [cardSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('StudySet', studySetSchema);
