const mongoose = require('mongoose');
const Event = require('./models/event.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cosylanguages';

const events = [
  {
    title: "I Couldn't Help But Wonder",
    videoUrl: 'https://www.youtube.com/watch?v=c5-i0KjR384',
    videoTitle: "I Couldn't Help But Wonder.",
    start: new Date(),
    end: new Date(),
    description: "Speaking club",
  },
  {
    title: "Mind matters",
    videoUrl: 'https://www.youtube.com/watch?v=iKhneDP4Bsk',
    videoTitle: "Mind matters.",
    start: new Date(),
    end: new Date(),
    description: "Speaking club",
  },
  {
    title: "Keeping up with science",
    videoUrl: 'https://www.youtube.com/watch?v=0LiuP7RmHEE',
    videoTitle: "Keeping up with science.",
    start: new Date(),
    end: new Date(),
    description: "Speaking club",
  },
  {
    title: "Let’s Celebrate",
    videoUrl: 'https://www.youtube.com/watch?v=50n-axjpaZ8',
    videoTitle: "Let’s Celebrate.",
    start: new Date(),
    end: new Date(),
    description: "Speaking club",
  },
  {
    title: "The greatest quotes",
    videoUrl: 'https://www.youtube.com/watch?v=ON2SlXA7gq8',
    videoTitle: "The greatest quotes.",
    start: new Date(),
    end: new Date(),
    description: "Speaking club",
  },
];

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    return Event.insertMany(events);
  })
  .then(() => {
    console.log('Events seeded');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding events:', err);
    mongoose.connection.close();
  });
