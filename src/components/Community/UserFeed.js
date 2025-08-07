import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import Post from './Post';
import { getUserPosts } from '../../api/community';
import Pagination from '../Common/Pagination';

const UserFeed = ({ userId }) => {
    const { t } = useI18n();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { posts: fetchedPosts, totalPages: fetchedTotalPages } = await getUserPosts({
                userId,
                page: currentPage,
                limit: 10,
            });
            setPosts(fetchedPosts);
            setTotalPages(fetchedTotalPages);
        } catch (err) {
            setError('Failed to fetch posts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, currentPage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="user-feed-container">
            <h2>{t('profile.myPosts.title', 'My Posts')}</h2>
            {loading && <p>{t('community.loading', 'Loading...')}</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && posts.length > 0 ? (
                posts.map(post => (
                    <Post key={post._id} post={post} />
                ))
            ) : (
                !loading && <p>{t('community.noPosts', 'No posts to display.')}</p>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default UserFeed;
