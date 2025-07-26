const router = require('express').Router();
const Post = require('../models/post.model');
const multer = require('multer');

// Simple disk storage for now (replace with GridFS if needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all posts
router.route('/').get((req, res) => {
  Post.find()
    .populate('author')
    .sort({ createdAt: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a post (with video upload)
router.route('/add').post(upload.single('video'), (req, res) => {
  const newPost = new Post({
    author: req.body.author,
    videoUrl: req.file ? `/uploads/${req.file.filename}` : '',
    caption: req.body.caption,
  });
  newPost.save()
    .then(() => res.json('Post added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Like/unlike a post
router.route('/:id/like').post((req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) return res.status(404).json('Post not found');
      const userId = req.body.userId;
      if (post.likes.includes(userId)) {
        post.likes.pull(userId);
      } else {
        post.likes.push(userId);
      }
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
