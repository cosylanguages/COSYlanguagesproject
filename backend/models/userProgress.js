const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  learnedWords: [String],
  streaks: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
