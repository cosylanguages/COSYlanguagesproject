const router = require('express').Router();
const Event = require('../models/event.model');

// Get all events with filtering and pagination
router.route('/').get(async (req, res) => {
  const { filter, page = 1, limit = 10 } = req.query;
  const query = {};
  const now = new Date();

  if (filter === 'current') {
    query.end = { $gte: now };
  } else if (filter === 'past') {
    query.end = { $lt: now };
  }

  try {
    const events = await Event.find(query)
      .sort({ start: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('comments.author', 'username'); // Populate author's username

    const totalEvents = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add an event
router.route('/add').post((req, res) => {
  const newEvent = new Event(req.body);
  newEvent.save()
    .then(() => res.json('Event added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a comment to an event
router.route('/:id/comments').post(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json('Event not found');

    const newComment = {
      // Assuming req.user.id is available from an auth middleware
      author: req.user.id,
      text: req.body.text,
    };

    event.comments.push(newComment);
    await event.save();

    // Populate the author of the newly added comment
    const updatedEvent = await Event.findById(event._id).populate('comments.author', 'username');
    res.status(201).json(updatedEvent.comments);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Like/unlike an event
router.route('/:id/like').post(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json('Event not found');

    const userId = req.user._id;
    const index = event.likes.indexOf(userId);

    if (index === -1) {
      event.likes.push(userId);
    } else {
      event.likes.splice(index, 1);
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get event by id
router.route('/:id').get((req, res) => {
  Event.findById(req.params.id)
    .populate('comments.author', 'username')
    .then(event => res.json(event))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
