
import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { createPost } from '../api/community';
import './CreatePost.css';

const CreatePost = ({ userId }) => {
  const { t } = useI18n();
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);
    formData.append('caption', caption);
    formData.append('author', userId);
    createPost(formData)
      .then(res => {
        console.log(res);
        alert('Post created successfully!');
      })
      .catch(err => {
        console.error('Error creating post:', err);
        alert('Error creating post. Please try again.');
      });
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h3>{t('createPost.title', 'Create a new post')}</h3>
      <div>
        <label htmlFor="video-upload">{t('createPost.videoLabel', 'Video')}</label>
        <input id="video-upload" type="file" accept="video/*" onChange={handleVideoChange} />
      </div>
      <div>
        <label htmlFor="caption-input">{t('createPost.captionLabel', 'Caption')}</label>
        <input id="caption-input" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <button type="submit">{t('createPost.submitButton', 'Post')}</button>
    </form>
  );
};

export default CreatePost;
