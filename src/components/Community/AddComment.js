import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentOnPost } from '../../api/community';

const AddComment = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;

    try {
      const newComment = await commentOnPost(postId, {
        text,
        author: currentUser._id,
      });
      setText('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-comment-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="add-comment-input"
      />
      <button type="submit" className="add-comment-button">Post</button>
    </form>
  );
};

export default AddComment;
