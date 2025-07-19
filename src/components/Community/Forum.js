import React, { useState } from 'react';
import './Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (newPost.trim()) {
      setPosts([...posts, { text: newPost, author: 'You' }]);
      setNewPost('');
    }
  };

  return (
    <div className="forum">
      <h3>Community Forum</h3>
      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <p className="post-author">{post.author}</p>
            <p className="post-text">{post.text}</p>
          </div>
        ))}
      </div>
      <div className="new-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
        />
        <button onClick={handlePost}>Post</button>
      </div>
    </div>
  );
};

export default Forum;
