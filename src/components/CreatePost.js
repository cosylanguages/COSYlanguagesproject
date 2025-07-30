
import React, { useState } from 'react';
import { createPost } from '../api/community';
import './CreatePost.css';

const CreatePost = ({ userId }) => {
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
      .then(res => console.log(res));
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div>
        <label>Vidéo</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
      </div>
      <div>
        <label>Légende</label>
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <button type="submit">Publier</button>
    </form>
  );
};

export default CreatePost;
