import React, { useState, useEffect, useCallback } from 'react';
import Post from './Post';
import { useAuth } from '../../contexts/AuthContext';
import { getPosts as apiGetPosts } from '../../api/community';
import Pagination from '../Common/Pagination';

function Feed({ t }) {
  // TODO: The `t` function should be provided by a proper i18n context/provider.
  const translate = t || ((key) => key.split('.').pop());

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { authToken } = useAuth();

  const getPosts = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const { posts: fetchedPosts, totalPages: fetchedTotalPages } = await apiGetPosts({
        page: currentPage,
        limit: 10,
      });
      setPosts(fetchedPosts);
      setTotalPages(fetchedTotalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken, currentPage]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  return (
    <div className="feed">
      {error && <p className="error-message">{error}</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} t={translate} />
      ))}
      {loading && <p>{translate('feed.loading')}</p>}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Feed;
