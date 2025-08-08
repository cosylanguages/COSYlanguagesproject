import React, { useState } from 'react';
import './Post.css';

import { useAuth } from '../../contexts/AuthContext';
import { likePost } from '../../api/community';
import CommentList from './CommentList';
import AddComment from './AddComment';

// This component displays a single post in the feed.
function Post({ post: initialPost, t }) {
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const { currentUser } = useAuth();

  // TODO: The `t` function should be provided by a proper i18n context/provider.
  const translate = t || ((key, vars) => {
    // Basic placeholder for variable substitution
    if (vars) {
      return Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), key);
    }
    return key.split('.').pop();
  });

  const handleLike = async () => {
    if (!currentUser) return;

    const originalLikes = post.likes;
    const isLiked = post.likes.includes(currentUser._id);

    // Optimistic update
    const newLikes = isLiked
      ? post.likes.filter((id) => id !== currentUser._id)
      : [...post.likes, currentUser._id];
    setPost({ ...post, likes: newLikes });

    try {
      await likePost(post._id, currentUser._id);
    } catch (error) {
      // Revert on error
      setPost({ ...post, likes: originalLikes });
      console.error('Failed to like post', error);
    }
  };

  const handleCommentAdded = (newComment) => {
    // Ideally, the CommentList should re-fetch, but for an immediate update:
    // This is a simplification. A more robust solution would use a shared state management.
    setPost({ ...post, comments: [...post.comments, newComment] });
  };

  const { author, videoUrl, caption, likes, comments } = post;

  return (
    <div className="post">
      <div className="post-header">
        {/* Placeholder for avatar */}
        <div className="post-avatar-placeholder" />
        <h3 className="post-author">{author?.username}</h3>
      </div>
      <p className="post-text">{caption}</p>
      {videoUrl && (
        <video controls className="post-video">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="post-actions">
        <button className="post-action-button" onClick={handleLike}>{translate('post.like', { count: likes.length })}</button>
        <button className="post-action-button" onClick={() => setShowComments(!showComments)}>{translate('post.comment', { count: comments.length })}</button>
        <button className="post-action-button" onClick={() => { /* TODO: Implement share functionality */ }}>{translate('post.share')}</button>
      </div>
      {showComments && (
        <div className="comments-section">
          <AddComment postId={post._id} onCommentAdded={handleCommentAdded} />
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
}

export default Post;
