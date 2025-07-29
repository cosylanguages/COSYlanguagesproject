
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feed.css';

const Feed = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleLike = (postId) => {
    axios.post(`/posts/${postId}/like`, { userId })
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post._id === postId) {
            return response.data;
          }
          return post;
        });
        setPosts(updatedPosts);
      });
  };

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
              <button>Comment</button>
              <button>Share</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
