const express = require('express');
const router = express.Router();

// Mock posts data
let posts = [];

// Get all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// Create a new post
router.post('/', (req, res) => {
  const { author, avatar, text, image } = req.body;
  const newPost = { id: posts.length + 1, author, avatar, text, image, likes: 0, comments: [] };
  posts.push(newPost);
  res.json(newPost);
});

// Like a post
router.post('/:id/like', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    post.likes++;
    res.json(post);
  } else {
    res.status(404).json({ success: false, message: 'Post not found' });
  }
});

// Comment on a post
router.post('/:id/comment', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    const { author, text } = req.body;
    const newComment = { id: post.comments.length + 1, author, text };
    post.comments.push(newComment);
    res.json(post);
  } else {
    res.status(404).json({ success: false, message: 'Post not found' });
  }
});

module.exports = router;
