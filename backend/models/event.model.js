const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  videoTitle: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  topics: [String],
  discussion: String,
  vocabulary: [String],
  round1: String,
  round2: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
