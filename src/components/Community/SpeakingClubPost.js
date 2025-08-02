import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useI18n } from '../../i18n/I18nContext';
import { fetchStudySets, addStudySet, addCardToStudySet } from '../../api/studySets';
import { commentOnEvent, likeEvent } from '../../api/community';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import Button from '../Common/Button';
import './SpeakingClubPost.css';

const SpeakingClubPost = ({ event }) => {
  const { t } = useI18n();
  const { currentUser } = useAuth();
  const [playing] = useState(true);
  const [muted] = useState(true);
  const [loop] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(event.comments || []);
  const [likes, setLikes] = useState(event.likes || []);

  useEffect(() => {
    setComments(event.comments || []);
    setLikes(event.likes || []);
  }, [event]);

  const handleAddWordToDictionary = async (word) => {
    try {
      let studySets = await fetchStudySets();
      let targetSet;

      if (studySets.length === 0) {
        targetSet = await addStudySet({ name: 'My Dictionary' });
        toast.success('Created a new "My Dictionary" for you!');
      } else {
        targetSet = studySets[0];
      }

      await addCardToStudySet(targetSet._id, {
        front: word,
        back: '... add definition',
      });
      toast.success(`"${word}" added to ${targetSet.name}!`);
    } catch (error) {
      console.error('Failed to add word to dictionary:', error);
      toast.error('Failed to add word to dictionary.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const updatedComments = await commentOnEvent(event._id, { text: newComment });
      setComments(updatedComments);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.error('Failed to post comment.');
    }
  };

  const handleLike = async () => {
    try {
      const updatedEvent = await likeEvent(event._id);
      setLikes(updatedEvent.likes);
    } catch (error) {
      console.error('Failed to like event:', error);
      toast.error('Failed to like event.');
    }
  };

  if (!event) {
    return <div>{t('speakingClubPost.loading', 'Loading event...')}</div>;
  }

  const getVideoUrl = (url) => {
    return url.replace("youtube.com", "pense.pro");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="speaking-club-post">
      <div className="post-header">
        <img src="/path/to/placeholder-avatar.png" alt="author avatar" className="post-author-avatar" />
        <div>
          <h3 className="post-title">{event.title}</h3>
          <p className="post-date">{formatDate(event.start)}</p>
        </div>
      </div>
      <p className="post-description">{event.description}</p>

      {event.videoUrl && (
        <div className="video-container">
          <ReactPlayer
            url={getVideoUrl(event.videoUrl)}
            playing={playing}
            muted={muted}
            loop={loop}
            controls
            width="100%"
            height="100%"
            className="react-player"
          />
        </div>
      )}

      <div className="post-actions">
        <Button onClick={handleLike} className="like-btn">
          ❤️ {likes.length} {t('speakingClubPost.likes', 'Likes')}
        </Button>
      </div>

      <div className="post-details">
        <h4>{t('speakingClubPost.topics', 'Topics')}</h4>
        <ul>
          {event.topics && event.topics.map((topic, index) => <li key={index}>{topic}</li>)}
        </ul>
      </div>

      <div className="post-details">
        <h4>{t('speakingClubPost.vocabulary', 'Vocabulary')}</h4>
        <ul className="vocabulary-list">
          {event.vocabulary && event.vocabulary.map((word, index) => (
            <li key={index}>
              {word}
              <Button className="add-word-btn" onClick={() => handleAddWordToDictionary(word)}>
                +
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="comments-section">
        <h4>{t('speakingClubPost.comments', 'Comments')}</h4>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p><strong>{comment.author?.username || 'Anonymous'}:</strong> {comment.text}</p>
          </div>
        ))}
        {currentUser && (
          <div className="comment-input-area">
            <textarea
              className="comment-input"
              placeholder={t('speakingClubPost.addComment', 'Add a comment...')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button className="comment-submit-btn" onClick={handleCommentSubmit}>
              {t('speakingClubPost.submitComment', 'Submit')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingClubPost;
