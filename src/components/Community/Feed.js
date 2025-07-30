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
  const { authToken } = useAuth();

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

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="feed">
      {error && <p className="error-message">{error}</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} t={translate} />
      ))}
      {loading && <p>{translate('feed.loading')}</p>}
    </div>
  );
}

export default Feed;
