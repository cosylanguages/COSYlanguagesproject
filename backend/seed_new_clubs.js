const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Event = require('./models/event.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cosylanguages';

const clubJsonFiles = [
  '../science_club.json',
  '../celebrate_club.json',
  '../quotes_club.json',
  '../mind_matters_club.json',
  '../wonder_club.json'
];

const eventsToSeed = [];

clubJsonFiles.forEach(file => {
  try {
    const filePath = path.resolve(__dirname, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const eventData = JSON.parse(fileContent);
    eventsToSeed.push(eventData);
  } catch (err) {
    console.error(`Error reading or parsing file ${file}:`, err);
    process.exit(1);
  }
});

if (eventsToSeed.length !== 5) {
  console.error('Did not successfully load all 5 event files. Aborting.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB for seeding new clubs.');
    // Optional: Clear out old, simple events if they exist
    // For this task, we will just add the new ones.
    // await Event.deleteMany({ description: "Speaking club" });

    console.log('Inserting 5 new detailed club sessions...');
    return Event.insertMany(eventsToSeed);
  })
  .then((result) => {
    console.log(`${result.length} new events have been successfully seeded.`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding new events:', err);
    mongoose.connection.close();
    process.exit(1);
  });
