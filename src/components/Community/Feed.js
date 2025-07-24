import React, { useState, useEffect, useRef, useCallback } from 'react';
import Post from './Post';

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
  {
    id: 3,
    author: 'Peter Jones',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    text: 'I love the new booster packs! The "Cafe Hopping in Paris" one is my favorite.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    likes: 42,
    comments: 11,
  },
  {
    id: 4,
    author: 'Mary Williams',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
    text: 'Just finished the first day of the German course. It\'s challenging, but I\'m excited to learn more!',
    image: null,
    likes: 5,
    comments: 1,
  },
  {
    id: 5,
    author: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704h',
    text: 'Does anyone have any tips for learning Russian? I\'m struggling with the cases.',
    image: null,
    likes: 2,
    comments: 10,
  },
];

// This component displays a feed of posts.
function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    // In a real app, you'd fetch data from an API here.
    // We'll simulate it with a timeout.
    setTimeout(() => {
      const newPosts = mockPosts.map(p => ({ ...p, id: `${p.id}-${page}` }));
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLoading(false);
    }, 1000);
  }, [page]);

  return (
    <div className="feed">
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return <div ref={lastPostElementRef} key={post.id}><Post post={post} /></div>;
        } else {
          return <Post key={post.id} post={post} />;
        }
      })}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Feed;
