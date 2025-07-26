const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const progressSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedLessons: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  score: {
    type: Number,
    default: 0
  }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
