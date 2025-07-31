import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useI18n } from '../../i18n/I18nContext';
import { addCardToStudySet } from '../../api/studySets';
import { commentOnEvent } from '../../api/community';
import { useAuth } from '../../contexts/AuthContext';
import './SpeakingClubPost.css';

const SpeakingClubPost = ({ event }) => {
  const { t } = useI18n();
  const { currentUser } = useAuth();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [loop, setLoop] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(event.comments || []);

  const handleAddWordToDictionary = async (word) => {
    try {
      // Assuming a default study set ID of 1, as per the mock data.
      // In a real app, you'd likely fetch the user's study sets and let them choose.
      const studySetId = 1;
      await addCardToStudySet(studySetId, {
        front: word,
        back: '... add definition', // Placeholder for the back of the card
      });
      alert(`"${word}" added to your dictionary!`);
    } catch (error) {
      console.error('Failed to add word to dictionary:', error);
      alert('Failed to add word to dictionary.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const updatedComments = await commentOnEvent(event._id, { text: newComment });
      setComments(updatedComments);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment.');
    }
  };

  if (!event) {
    return <div>{t('speakingClubPost.loading', 'Loading event...')}</div>;
  }

  const getVideoUrl = (url) => {
    return url.replace("youtube.com", "pense.pro");
  }

  return (
    <div className="speaking-club-post">
      <h3 className="post-title">{event.title}</h3>
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
              <button className="add-word-btn" onClick={() => handleAddWordToDictionary(word)}>
                +
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="comments-section">
        <h4>{t('speakingClubPost.comments', 'Comments')}</h4>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p><strong>{comment.author?.name || 'Anonymous'}:</strong> {comment.text}</p>
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
            <button className="comment-submit-btn" onClick={handleCommentSubmit}>
              {t('speakingClubPost.submitComment', 'Submit')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingClubPost;
