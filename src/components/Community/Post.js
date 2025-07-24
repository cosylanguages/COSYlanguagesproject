import React from 'react';
import './Post.css';

// This component displays a single post in the feed.
function Post({ post }) {
  const { author, avatar, text, image, likes, comments } = post;

  return (
    <div className="post">
      <div className="post-header">
        <img src={avatar} alt={`${author}'s avatar`} className="post-avatar" />
        <h3 className="post-author">{author}</h3>
      </div>
      <p className="post-text">{text}</p>
      {image && <img src={image} alt="Post" className="post-image" />}
      <div className="post-actions">
        <button className="post-action-button">Like ({likes})</button>
        <button className="post-action-button">Comment ({comments})</button>
        <button className="post-action-button">Share</button>
      </div>
    </div>
  );
}

export default Post;
