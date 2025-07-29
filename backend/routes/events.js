const router = require('express').Router();
const Event = require('../models/event.model');

// Get all events
router.route('/').get((req, res) => {
  Event.find()
    .then(events => res.json(events))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add an event
router.route('/add').post((req, res) => {
  const newEvent = new Event(req.body);
  newEvent.save()
    .then(() => res.json('Event added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update an event
router.route('/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      if (!event) return res.status(404).json('Event not found');
      event.title = req.body.title;
      event.videoUrl = req.body.videoUrl;
      event.videoTitle = req.body.videoTitle;
      event.start = req.body.start;
      event.end = req.body.end;
      event.description = req.body.description;
      event.topics = req.body.topics;
      event.discussion = req.body.discussion;
      event.vocabulary = req.body.vocabulary;
      event.round1 = req.body.round1;
      event.round2 = req.body.round2;
      event.save()
        .then(() => res.json('Event updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get event by id
router.route('/:id').get((req, res) => {
  Event.findById(req.params.id)
    .then(event => res.json(event))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
