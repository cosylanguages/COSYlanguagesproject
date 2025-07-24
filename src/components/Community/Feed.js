import React, { useState, useEffect } from 'react';
import Post from './Post';

// This component displays a feed of posts.
function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from an API.
    // For now, we'll use mock data.
    const mockPosts = [
      {
        id: 1,
        author: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        text: 'Just learned how to say "hello" in 10 languages! #languagelearning #polyglot',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        likes: 12,
        comments: 3,
      },
      {
        id: 2,
        author: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        text: 'The history of the Armenian language is fascinating! Did you know that it has its own unique script?',
        image: 'https://images.unsplash.com/photo-1543762435-9b1619a3a9e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        likes: 25,
        comments: 8,
      },
    ];
    setPosts(mockPosts);
  }, []);

  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
