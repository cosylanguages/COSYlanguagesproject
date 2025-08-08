const router = require('express').Router();
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const authMiddleware = require('../middleware/auth');

// Get all comments for a post
router.route('/:postId/comments').get(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username'
      }
    });
    if (!post) {
      return res.status(404).json('Post not found');
    }
    res.json(post.comments);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a comment to a post
router.route('/:postId/comments').post(authMiddleware, async (req, res) => {
  try {
    const { text, author } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json('Post not found');
    }

    const newComment = new Comment({
      text,
      author,
      post: post._id,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.json(newComment);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
