import React, { useState, useEffect, useCallback } from 'react';
import Post from './Post';
import { useAuth } from '../../contexts/AuthContext';
import { getPosts as apiGetPosts, createPost as apiCreatePost } from '../../api/api';

function Feed({ t }) {
  // TODO: The `t` function should be provided by a proper i18n context/provider.
  const translate = t || ((key) => key.split('.').pop());

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPostText, setNewPostText] = useState('');
  const { authToken, currentUser } = useAuth();

  const getPosts = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetPosts(authToken);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!authToken || !currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const postData = {
        author: currentUser.username,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Mock avatar
        text: newPostText,
      };
      const data = await apiCreatePost(authToken, postData);
      setPosts((prev) => [data, ...prev]);
      setNewPostText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="feed">
      <form onSubmit={handleCreatePost} className="new-post-form">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder={translate('feed.newPostPlaceholder')}
        />
        <button type="submit" disabled={loading}>{translate('feed.postButton')}</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} t={translate} />
      ))}
      {loading && <p>{translate('feed.loading')}</p>}
    </div>
  );
}

export default Feed;
