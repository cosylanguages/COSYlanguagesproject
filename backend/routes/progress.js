const router = require('express').Router();
const Progress = require('../models/progress.model');

// Get progress for a student in a course
router.route('/:courseId/:studentId').get((req, res) => {
  Progress.findOne({ course: req.params.courseId, student: req.params.studentId })
    .then(progress => res.json(progress))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update progress
router.route('/update').post((req, res) => {
  Progress.findOneAndUpdate(
    { course: req.body.courseId, student: req.body.studentId },
    { $addToSet: { completedLessons: req.body.lessonId }, $inc: { score: req.body.score } },
    { upsert: true, new: true }
  )
    .then(progress => res.json(progress))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
