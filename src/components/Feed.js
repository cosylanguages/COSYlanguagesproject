
import React, { useState, useEffect } from 'react';
import { getPosts, likePost } from '../api/community';
import './Feed.css';

const Feed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(response => {
        setPosts(response);
      })
      .catch(error => {
        setError('Failed to fetch posts.');
        console.error('Failed to fetch posts:', error);
      });
  }, []);

  const handleLike = (postId) => {
    likePost(postId, userId)
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post._id === postId) {
            return response;
          }
          return post;
        });
        setPosts(updatedPosts);
      })
      .catch(error => {
        console.error('Failed to like post:', error);
      });
  };

  const handleComment = (postId) => {
    console.log(`Commenting on post ${postId}`);
  };

  const handleShare = (postId) => {
    console.log(`Sharing post ${postId}`);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="feed">
      {posts.map(post => (
        <div key={post._id} className="post">
          <video controls src={post.videoUrl} className="post-video" />
          <div className="post-info">
            <p><strong>{post.author?.username || 'Unknown'}</strong></p>
            <p>{post.caption}</p>
            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>Like ({post.likes.length})</button>
              <button onClick={() => handleComment(post._id)}>Comment</button>
              <button onClick={() => handleShare(post._id)}>Share</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
