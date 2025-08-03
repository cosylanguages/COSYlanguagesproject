const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: String,
  type: {
    type: String,
    enum: [
      'Icebreaker',
      'Conceptual',
      'Critical Thinking',
      'Ethical Dilemma',
      'Creative',
      '2nd Conditional',
      '3rd Conditional',
      'Tool-based'
    ]
  },
  difficulty: {
    type: String,
    enum: ['★', '★★', '★★★']
  }
});

const roundSchema = new Schema({
  title: String,
  questions: [questionSchema]
});

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Starter', 'Elementary', 'Intermediate', 'Advanced'],
    required: true,
  },
  clubType: {
    type: String,
    enum: ['Keeping Up With Science', 'Let\'s Celebrate', 'The Greatest Quotes', 'Mind Matters', 'I Couldn\'t Help But Wonder'],
    required: true,
  },
  inspiringMaterial: {
    link: String,
    thumbnail: String,
  },
  description: String,
  topics: [String],
  vocabularyBank: [{
    word: String,
    pronunciation: String, // URL to audio file
  }],
  teacherNotes: {
    discussionTips: String,
    commonPitfalls: String,
    culturalContext: String,
  },
  sessionFlow: {
    round1: roundSchema,
    miniBreak: {
      funFact: String,
      tongueTwister: String,
      memeUrl: String,
    },
    round2: roundSchema, // This will be customized for specialized clubs
  },
  closingSection: {
    keyTakeaways: [String],
    continueExploring: [{
      title: String,
      link: String,
    }],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Specialized club fields
  specializedContent: {
    type: Schema.Types.Mixed, // Allows for flexible content based on clubType
  }
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
