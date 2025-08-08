import React, { useState, useEffect } from 'react';
import { getComments } from '../../api/community';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (err) {
        setError('Failed to load comments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p><strong>{comment.author.username}</strong>: {comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
